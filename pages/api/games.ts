import type { NextApiRequest, NextApiResponse } from "next";
import { Game } from "@/types/game";
import { computeSafetyScore, passesSafetyThreshold } from "@/lib/safety";
import { games as staticGames } from "@/data/games";
import { GAMING_KEYWORDS } from "@/lib/constants";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const cache = new Map<string, { data: Game[]; timestamp: number }>();

const curatedGameMap = new Map(
  staticGames
    .filter((g) => g.tokenMint)
    .map((g) => [g.tokenMint!.toLowerCase(), g])
);

interface DexPair {
  chainId: string;
  url: string;
  baseToken: { address: string; name: string; symbol: string };
  priceUsd: string;
  priceChange: { h24: number };
  volume: { h24: number };
  marketCap: number;
  liquidity?: { usd: number };
  pairCreatedAt?: number;
  info?: {
    imageUrl?: string;
    header?: string;
    websites?: { url: string; label?: string }[];
    socials?: { type: string; url: string }[];
  };
}

interface RpcAccountInfo {
  data: [string, "base64"];
  owner: string;
  executable: boolean;
  lamports: number;
}

interface BirdeyeSecurity {
  mintAuthority?: string | null;
  freezeAuthority?: string | null;
  renounced?: boolean;
  mutableMetadata?: boolean;
  top10HolderPercent?: number;
}

interface SolscanTokenMeta {
  success: boolean;
  data?: {
    mintAuthority?: string | null;
    freezeAuthority?: string | null;
    supply?: string;
    decimals?: number;
  };
}

function normalizeText(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function isGamingText(text: string): boolean {
  const lower = text.toLowerCase();
  return GAMING_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

async function fetchDexScreenerPairs(addresses: string[]): Promise<DexPair[]> {
  if (addresses.length === 0) return [];
  const BATCH_SIZE = 30;
  const pairs: DexPair[] = [];

  for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
    const batch = addresses.slice(i, i + BATCH_SIZE).join(",");
    const res = await fetch(`https://api.dexscreener.com/tokens/v1/solana/${batch}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) continue;
    const batchPairs: DexPair[] = await res.json();
    pairs.push(...batchPairs);
  }

  return pairs;
}

function parseMintAccount(base64: string): {
  mintRevoked: boolean;
  freezeRevoked: boolean;
} {
  const buf = Buffer.from(base64, "base64");
  // Standard SPL Token / Token-2022 mint account layout (first 82 bytes):
  // 0-3   : mint authority option (u32 LE, 0 = revoked)
  // 4-35  : mint authority pubkey (if option == 1)
  // 36-43 : supply (u64 LE)
  // 44    : decimals (u8)
  // 45    : isInitialized (u8)
  // 46-49 : freeze authority option (u32 LE, 0 = revoked)
  // 50-81 : freeze authority pubkey (if option == 1)
  const mintOption = buf.length >= 4 ? buf.readUInt32LE(0) : 1;
  const freezeOption = buf.length >= 50 ? buf.readUInt32LE(46) : 1;
  return {
    mintRevoked: mintOption === 0,
    freezeRevoked: freezeOption === 0,
  };
}

async function fetchMintAuthorities(addresses: string[]): Promise<
  Map<string, { mintRevoked: boolean; freezeRevoked: boolean }>
> {
  const apiKey = process.env.HELIUS_API_KEY;
  const map = new Map<string, { mintRevoked: boolean; freezeRevoked: boolean }>();
  if (!apiKey || addresses.length === 0) return map;

  const BATCH_SIZE = 100;

  for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
    const batch = addresses.slice(i, i + BATCH_SIZE);
    try {
      const res = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getMultipleAccounts",
          params: [batch, { encoding: "base64" }],
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) continue;
      const json = await res.json();
      const accounts: (RpcAccountInfo | null)[] = json.result?.value ?? [];

      for (let j = 0; j < batch.length; j++) {
        const info = accounts[j];
        if (!info?.data?.[0]) continue;
        map.set(batch[j].toLowerCase(), parseMintAccount(info.data[0]));
      }
    } catch {
      // Ignore RPC failures; token will rely on fallbacks or null signals.
    }
  }

  return map;
}

async function fetchBirdeyeSecurity(address: string): Promise<BirdeyeSecurity | null> {
  const apiKey = process.env.BIRDEYE_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`https://public-api.birdeye.so/defi/token_security?address=${address}`, {
      headers: {
        "x-api-key": apiKey,
        "accept": "application/json",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

async function fetchSolscanMetadata(address: string): Promise<SolscanTokenMeta | null> {
  const apiKey = process.env.SOLSCAN_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`https://pro-api.solscan.io/v2.0/token/meta?address=${address}`, {
      headers: { token: apiKey },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

interface DexProfile {
  chainId?: string;
  tokenAddress?: string;
  links?: { type?: string; label?: string; url?: string }[];
}

async function fetchDexScreenerPresence(addresses: string[]): Promise<{
  paid: Set<string>;
  socialsUpdated: Set<string>;
}> {
  const paid = new Set<string>();
  const socialsUpdated = new Set<string>();
  if (addresses.length === 0) return { paid, socialsUpdated };

  // Paid boosts.
  try {
    const res = await fetch("https://api.dexscreener.com/token-boosts/latest/v1", {
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data: { chainId?: string; tokenAddress?: string }[] = await res.json();
      for (const item of data) {
        if (item.chainId === "solana" && item.tokenAddress) {
          paid.add(item.tokenAddress.toLowerCase());
        }
      }
    }
  } catch {
    // Ignore DexScreener boosts failures.
  }

  // Updated profiles with socials.
  try {
    const res = await fetch("https://api.dexscreener.com/token-profiles/latest/v1", {
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data: DexProfile[] = await res.json();
      for (const item of data) {
        if (item.chainId !== "solana" || !item.tokenAddress) continue;
        const links = item.links ?? [];
        const hasWebsite = links.some(
          (l) =>
            l.url &&
            (l.type === "website" ||
              l.label?.toLowerCase() === "website" ||
              (!l.type && !l.label))
        );
        const hasX = links.some(
          (l) =>
            l.url &&
            (l.type === "twitter" ||
              l.label?.toLowerCase() === "twitter" ||
              l.url.toLowerCase().includes("x.com") ||
              l.url.toLowerCase().includes("twitter.com"))
        );
        if (hasWebsite && hasX) {
          socialsUpdated.add(item.tokenAddress.toLowerCase());
        }
      }
    }
  } catch {
    // Ignore DexScreener profile failures.
  }

  return { paid, socialsUpdated };
}

function isAuthorityRevoked(
  rpc?: { mintRevoked: boolean; freezeRevoked: boolean },
  birdeye?: BirdeyeSecurity,
  solscan?: SolscanTokenMeta
): {
  mintRevoked: boolean | null;
  freezeRevoked: boolean | null;
} {
  if (rpc) {
    return { mintRevoked: rpc.mintRevoked, freezeRevoked: rpc.freezeRevoked };
  }

  let mintRevoked: boolean | null = null;
  let freezeRevoked: boolean | null = null;

  // Birdeye fallback
  if (birdeye) {
    if (birdeye.mintAuthority !== undefined) {
      mintRevoked = birdeye.mintAuthority === null || birdeye.mintAuthority === "";
    }
    if (birdeye.freezeAuthority !== undefined) {
      freezeRevoked = birdeye.freezeAuthority === null || birdeye.freezeAuthority === "";
    }
    if (birdeye.renounced && mintRevoked === null) {
      mintRevoked = true;
    }
  }

  // Solscan fallback
  if (solscan?.data) {
    if (solscan.data.mintAuthority !== undefined && mintRevoked === null) {
      mintRevoked = solscan.data.mintAuthority === null || solscan.data.mintAuthority === "";
    }
    if (solscan.data.freezeAuthority !== undefined && freezeRevoked === null) {
      freezeRevoked = solscan.data.freezeAuthority === null || solscan.data.freezeAuthority === "";
    }
  }

  return { mintRevoked, freezeRevoked };
}

function highResIcon(url: string): string {
  if (!url) return url;
  return url.replace(/width=\d+&height=\d+/, "width=256&height=256");
}

function highResBanner(url: string): string {
  if (!url) return url;
  return url.replace(/width=\d+&height=\d+/, "width=600&height=200");
}

function tokenPlaceholder(symbol: string): string {
  const clean = symbol.replace(/^\$/, "").slice(0, 3).toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="#161618" />
      <rect x="16" y="16" width="224" height="224" rx="48" fill="none" stroke="#ff2a8c" stroke-width="6" />
      <text x="128" y="148" font-family="ui-sans-serif, system-ui, sans-serif" font-size="72" font-weight="700" fill="#ff2a8c" text-anchor="middle">${clean}</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function pairToGame(
  pair: DexPair,
  rpcAuthority?: { mintRevoked: boolean; freezeRevoked: boolean },
  birdeye?: BirdeyeSecurity,
  solscan?: SolscanTokenMeta,
  dexscreenerPaid = false,
  dexscreenerSocialsUpdated = false
): Game {
  const curated = curatedGameMap.get(pair.baseToken.address.toLowerCase());
  const name = curated?.name || pair.baseToken.name;
  const symbol = pair.baseToken.symbol;
  const overrideIcon = pair.info?.imageUrl || curated?.thumbnail || "";
  const rawIcon = highResIcon(overrideIcon);
  const icon = rawIcon || tokenPlaceholder(symbol);
  const rawBanner = highResBanner(
    pair.info?.header || curated?.banner || ""
  );
  const banner = rawBanner || icon;

  const website =
    curated?.website ||
    pair.info?.websites?.[0]?.url ||
    pair.url;

  const xUrl =
    curated?.xUrl ||
    pair.info?.socials?.find((s) => s.type === "twitter")?.url;

  const discordUrl =
    curated?.discordUrl ||
    pair.info?.socials?.find((s) => s.type === "discord")?.url;

  const telegramUrl =
    curated?.telegramUrl ||
    pair.info?.socials?.find((s) => s.type === "telegram")?.url;

  const description =
    curated?.description || `${symbol} on ${pair.chainId}`;
  const tagline = curated?.tagline || description.split("\n")[0].slice(0, 80) || `${symbol} token`;

  const gamingText = normalizeText(description, name, symbol, website);
  const gamingKeywordMatch = isGamingText(gamingText);

  const { mintRevoked, freezeRevoked } = isAuthorityRevoked(rpcAuthority, birdeye, solscan);

  const top10Percent: number | null = birdeye?.top10HolderPercent ?? null;

  const hasWebsiteAndX = Boolean(website && xUrl);
  const tokenAgeMs = pair.pairCreatedAt ? Date.now() - pair.pairCreatedAt : 0;
  const tokenAgeAbove7Days = tokenAgeMs > 7 * 24 * 60 * 60 * 1000;
  const liquidityAbove5k = (pair.liquidity?.usd || 0) >= 5000;

  const { score, breakdown } = computeSafetyScore({
    mintAuthorityRevoked: mintRevoked,
    freezeAuthorityRevoked: freezeRevoked,
    top10HoldersBelow30: top10Percent !== null ? top10Percent < 30 : null,
    tokenAgeAbove7Days,
    hasWebsiteAndX,
    gamingKeywordMatch,
    liquidityAbove5k,
    curatedGame: Boolean(curated),
    dexscreenerPaid,
    dexscreenerSocialsUpdated,
  });

  return {
    id: `dex-${pair.baseToken.address}`,
    name,
    slug: curated?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description,
    tagline,
    genre: curated?.genre || inferGenre(`${description} ${name} ${symbol} ${website}`),
    status: curated?.status || "live",
    tokenSymbol: symbol.startsWith("$") ? symbol : `$${symbol}`,
    tokenMint: pair.baseToken.address,
    price: parseFloat(pair.priceUsd) || 0,
    priceChange24h: pair.priceChange?.h24 ?? 0,
    marketCap: pair.marketCap || 0,
    volume24h: pair.volume?.h24 ?? 0,
    holders: Math.floor((pair.liquidity?.usd ?? 0) / 10),
    safetyScore: score,
    safetyBreakdown: breakdown,
    thumbnail: icon,
    banner,
    website,
    xUrl,
    discordUrl,
    telegramUrl,
    playUrl: pair.url,
    tags: curated?.tags || inferTags(`${description} ${name} ${symbol} ${website}`),
    trending: true,
  };
}

function inferGenre(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("rpg") || t.includes("mmo") || t.includes("quest") || t.includes("dungeon")) return "RPG";
  if (t.includes("strategy") || t.includes("battle") || t.includes("war") || t.includes("empire") || t.includes("kingdom")) return "Strategy";
  if (t.includes("action") || t.includes("shooter") || t.includes("fight")) return "Action";
  if (t.includes("arcade") || t.includes("runner") || t.includes("platform")) return "Arcade";
  if (t.includes("sim") || t.includes("craft") || t.includes("city") || t.includes("colony") || t.includes("world")) return "Simulation";
  if (t.includes("idle") || t.includes("tap") || t.includes("farm")) return "Idle";
  if (t.includes("sport") || t.includes("race") || t.includes("car")) return "Arcade";
  return "Meme";
}

function inferTags(text: string): string[] {
  const t = text.toLowerCase();
  const tags = new Set<string>(["Trending"]);

  const keywordTags: Record<string, string> = {
    mmo: "MMO", mmorpg: "MMORPG", rpg: "RPG", quest: "Quest", dungeon: "Dungeon",
    roguelike: "Roguelike", strategy: "Strategy", battle: "Battle", arena: "Arena",
    action: "Action", shooter: "Shooter", fps: "FPS", arcade: "Arcade", runner: "Runner",
    racing: "Racing", simulation: "Simulation", craft: "Crafting", idle: "Idle",
    farm: "Farming", mobile: "Mobile", p2e: "P2E", "play-to-earn": "P2E",
    metaverse: "Metaverse", nft: "NFT", pet: "Pet", card: "Card",
  };

  for (const [kw, tag] of Object.entries(keywordTags)) {
    if (t.includes(kw)) tags.add(tag);
  }

  return Array.from(tags);
}

async function buildGames(): Promise<Game[]> {
  // SavePoint is manually curated. We only show games listed in data/games.ts.
  const curatedMints = staticGames
    .map((g) => g.tokenMint)
    .filter((mint): mint is string => Boolean(mint));

  const pairs = await fetchDexScreenerPairs(curatedMints);
  const pairMap = new Map<string, DexPair>();
  for (const pair of pairs) {
    const key = pair.baseToken.address.toLowerCase();
    if (!pairMap.has(key)) {
      pairMap.set(key, pair);
    }
  }

  const enriched = staticGames
    .filter((g) => g.tokenMint && pairMap.has(g.tokenMint.toLowerCase()))
    .map((g) => ({ game: g, pair: pairMap.get(g.tokenMint!.toLowerCase())! }));

  // Collect addresses for batch on-chain enrichment.
  const addresses = enriched.map(({ pair }) => pair.baseToken.address);

  // Primary: read mint authority directly from chain via Helius RPC.
  const authorityMap = await fetchMintAuthorities(addresses);

  // Fallback 1: Birdeye for tokens missing RPC authority data or for holder distribution.
  const birdeyeAddresses = addresses.filter(
    (addr) => !authorityMap.has(addr.toLowerCase())
  );
  const birdeyeEntries = await Promise.all(
    birdeyeAddresses.map(async (addr) => {
      const data = await fetchBirdeyeSecurity(addr);
      return [addr.toLowerCase(), data] as const;
    })
  );
  const birdeyeMap = new Map(
    birdeyeEntries.filter(([, d]) => d !== null) as [string, BirdeyeSecurity][]
  );

  // Fallback 2: Solscan for tokens still missing authority data.
  const solscanAddresses = addresses.filter((addr) => {
    const key = addr.toLowerCase();
    return !authorityMap.has(key) && !birdeyeMap.get(key);
  });
  const solscanEntries = await Promise.all(
    solscanAddresses.map(async (addr) => {
      const data = await fetchSolscanMetadata(addr);
      return [addr.toLowerCase(), data] as const;
    })
  );
  const solscanMap = new Map(
    solscanEntries.filter(([, d]) => d !== null) as [string, SolscanTokenMeta][]
  );

  // DexScreener paid boost + profile-with-socials detection.
  const { paid: paidSet, socialsUpdated: socialsUpdatedSet } = await fetchDexScreenerPresence(addresses);

  const games: Game[] = [];

  for (const { pair } of enriched) {
    const key = pair.baseToken.address.toLowerCase();
    const authority = authorityMap.get(key);
    const birdeye = birdeyeMap.get(key);
    const solscan = solscanMap.get(key);
    const dexscreenerPaid = paidSet.has(key);
    const dexscreenerSocialsUpdated = socialsUpdatedSet.has(key);
    const game = pairToGame(pair, authority, birdeye, solscan, dexscreenerPaid, dexscreenerSocialsUpdated);

    games.push(game);
  }

  return games
    .filter((g) => passesSafetyThreshold(g.safetyScore))
    .sort((a, b) => b.volume24h - a.volume24h);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cached = cache.get("games");
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.status(200).json(cached.data);
    }

    const games = await buildGames();
    cache.set("games", { data: games, timestamp: Date.now() });

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=60");
    return res.status(200).json(games);
  } catch (error) {
    console.error("[/api/games] error:", error);
    return res.status(500).json({ error: "Failed to load games" });
  }
}
