import type { NextApiRequest, NextApiResponse } from "next";
import { Game } from "@/types/game";
import { computeSafetyScore, passesSafetyThreshold } from "@/lib/safety";
import { games as staticGames } from "@/data/games";
import {
  WHITELISTED_GAMING_TOKEN_ADDRESSES,
  BLOCKED_TOKEN_SYMBOLS,
  GAMING_KEYWORDS,
} from "@/lib/constants";

const DEXSCREENER_PROFILE_LIMIT = 100;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const cache = new Map<string, { data: Game[]; timestamp: number }>();

const curatedGameMap = new Map(
  staticGames
    .filter((g) => g.tokenMint)
    .map((g) => [g.tokenMint!.toLowerCase(), g])
);

interface DexProfile {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon: string;
  header?: string;
  openGraph?: string;
  description?: string;
  links?: { label?: string; type?: string; url: string }[];
}

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

interface HeliusTokenMetadata {
  mint?: string;
  mintAuthority?: string | null;
  freezeAuthority?: string | null;
  supply?: number;
  decimals?: number;
  onChainInfo?: {
    mintAuthority?: string | null;
    freezeAuthority?: string | null;
    supply?: string;
    decimals?: number;
  };
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

function isBlockedToken(name: string, symbol: string, address: string): boolean {
  const text = normalizeText(name, symbol, address);
  return (
    BLOCKED_TOKEN_SYMBOLS.has(symbol.toLowerCase()) ||
    BLOCKED_TOKEN_SYMBOLS.has(name.toLowerCase()) ||
    Array.from(BLOCKED_TOKEN_SYMBOLS).some((term) => text.includes(term))
  );
}

function isWhitelistedGame(address: string): boolean {
  return WHITELISTED_GAMING_TOKEN_ADDRESSES.some(
    (a) => a.toLowerCase() === address.toLowerCase()
  );
}

function isGamingText(text: string): boolean {
  const lower = text.toLowerCase();
  return GAMING_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

function isGamingProfile(profile: DexProfile, pair?: DexPair): boolean {
  if (isWhitelistedGame(profile.tokenAddress)) return true;

  if (
    isBlockedToken(
      pair?.baseToken?.name || "",
      pair?.baseToken?.symbol || "",
      profile.tokenAddress
    )
  ) {
    return false;
  }

  const text = normalizeText(
    profile.description,
    pair?.baseToken?.name,
    pair?.baseToken?.symbol,
    profile.links?.map((l) => `${l.label || ""} ${l.url}`).join(" "),
    pair?.info?.websites?.map((w) => w.url).join(" ")
  );

  return isGamingText(text);
}

function isGamingPair(pair: DexPair): boolean {
  if (isWhitelistedGame(pair.baseToken.address)) return true;

  if (isBlockedToken(pair.baseToken.name, pair.baseToken.symbol, pair.baseToken.address)) {
    return false;
  }

  const text = normalizeText(
    pair.baseToken.name,
    pair.baseToken.symbol,
    pair.info?.websites?.map((w) => w.url).join(" ")
  );

  return isGamingText(text);
}

async function fetchDexScreenerProfiles(limit: number): Promise<DexProfile[]> {
  const res = await fetch("https://api.dexscreener.com/token-profiles/latest/v1", {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error("Failed to fetch DexScreener profiles");
  const data: DexProfile[] = await res.json();
  return data.filter((p) => p.chainId === "solana").slice(0, limit);
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

async function fetchWhitelistedPairs(): Promise<DexPair[]> {
  const results = await Promise.all(
    WHITELISTED_GAMING_TOKEN_ADDRESSES.map(async (addr) => {
      try {
        const res = await fetch(`https://api.dexscreener.com/tokens/v1/solana/${addr}`, {
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return [];
        const data: DexPair[] = await res.json();
        return data;
      } catch {
        return [];
      }
    })
  );
  return results.flat();
}

async function fetchHeliusMetadata(addresses: string[]): Promise<Map<string, HeliusTokenMetadata>> {
  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey || addresses.length === 0) return new Map();

  const map = new Map<string, HeliusTokenMetadata>();

  try {
    const res = await fetch(`https://api.helius.xyz/v0/tokens/metadata?api-key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mintAccounts: addresses }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return map;
    const data: HeliusTokenMetadata[] = await res.json();

    for (const item of data) {
      if (item.mint) {
        map.set(item.mint.toLowerCase(), item);
      }
    }
  } catch {
    // Ignore Helius metadata failures.
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

function isAuthorityRevoked(helius?: HeliusTokenMetadata, birdeye?: BirdeyeSecurity, solscan?: SolscanTokenMeta): {
  mintRevoked: boolean | null;
  freezeRevoked: boolean | null;
} {
  let mintRevoked: boolean | null = null;
  let freezeRevoked: boolean | null = null;

  // Helius priority
  const heliusMint = helius?.mintAuthority ?? helius?.onChainInfo?.mintAuthority;
  const heliusFreeze = helius?.freezeAuthority ?? helius?.onChainInfo?.freezeAuthority;

  if (heliusMint !== undefined) mintRevoked = heliusMint === null || heliusMint === "";
  if (heliusFreeze !== undefined) freezeRevoked = heliusFreeze === null || heliusFreeze === "";

  // Birdeye confirmation
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
  profile?: DexProfile,
  helius?: HeliusTokenMetadata,
  birdeye?: BirdeyeSecurity,
  solscan?: SolscanTokenMeta
): Game {
  const curated = curatedGameMap.get(pair.baseToken.address.toLowerCase());
  const name = curated?.name || pair.baseToken.name;
  const symbol = pair.baseToken.symbol;
  const overrideIcon = profile?.icon || pair.info?.imageUrl || curated?.thumbnail || "";
  const rawIcon = highResIcon(overrideIcon);
  const icon = rawIcon || tokenPlaceholder(symbol);
  const rawBanner = highResBanner(
    profile?.header || pair.info?.header || profile?.openGraph || curated?.banner || ""
  );
  const banner = rawBanner || icon;

  const website =
    curated?.website ||
    profile?.links?.find((l) => l.label?.toLowerCase() === "website")?.url ||
    pair.info?.websites?.[0]?.url ||
    pair.url;

  const xUrl =
    curated?.xUrl ||
    profile?.links?.find((l) => l.type === "twitter")?.url ||
    profile?.links?.find((l) => l.label?.toLowerCase() === "twitter")?.url ||
    pair.info?.socials?.find((s) => s.type === "twitter")?.url;

  const discordUrl =
    curated?.discordUrl ||
    profile?.links?.find((l) => l.type === "discord")?.url ||
    pair.info?.socials?.find((s) => s.type === "discord")?.url;

  const telegramUrl =
    curated?.telegramUrl ||
    profile?.links?.find((l) => l.type === "telegram")?.url ||
    pair.info?.socials?.find((s) => s.type === "telegram")?.url;

  const description =
    curated?.description || profile?.description || `${symbol} on ${pair.chainId}`;
  const tagline = curated?.tagline || description.split("\n")[0].slice(0, 80) || `${symbol} token`;

  const gamingText = normalizeText(description, name, symbol, website);
  const gamingKeywordMatch = isGamingText(gamingText);

  const { mintRevoked, freezeRevoked } = isAuthorityRevoked(helius, birdeye, solscan);

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

function hasAuthorityInfo(helius?: HeliusTokenMetadata): boolean {
  if (!helius) return false;
  const mint = helius.mintAuthority ?? helius.onChainInfo?.mintAuthority;
  const freeze = helius.freezeAuthority ?? helius.onChainInfo?.freezeAuthority;
  return mint !== undefined && freeze !== undefined;
}

async function buildGames(): Promise<Game[]> {
  const [profiles, whitelistedPairs] = await Promise.all([
    fetchDexScreenerProfiles(DEXSCREENER_PROFILE_LIMIT),
    fetchWhitelistedPairs(),
  ]);



  // Merge whitelisted pairs with profile-derived pairs, preferring whitelisted pairs when both exist.
  const pairMap = new Map<string, DexPair>();
  for (const pair of whitelistedPairs) {
    pairMap.set(pair.baseToken.address.toLowerCase(), pair);
  }

  const profileAddresses = profiles.map((p) => p.tokenAddress.toLowerCase());
  const profilePairs = await fetchDexScreenerPairs(profileAddresses);

  for (const pair of profilePairs) {
    const key = pair.baseToken.address.toLowerCase();
    if (!pairMap.has(key)) {
      pairMap.set(key, pair);
    }
  }

  const allPairs = Array.from(pairMap.values());

  // Filter to gaming-related tokens.
  const gamingPairs = allPairs.filter((pair) => isGamingPair(pair));
  const gamingProfiles = profiles.filter((profile) => {
    const pair = allPairs.find(
      (p) => p.baseToken.address.toLowerCase() === profile.tokenAddress.toLowerCase()
    );
    return isGamingProfile(profile, pair);
  });

  // Merge pairs with their profiles.
  const enriched = gamingPairs.map((pair) => {
    const profile =
      gamingProfiles.find(
        (p) => p.tokenAddress.toLowerCase() === pair.baseToken.address.toLowerCase()
      ) ||
      profiles.find(
        (p) => p.tokenAddress.toLowerCase() === pair.baseToken.address.toLowerCase()
      );
    return { pair, profile };
  });

  // Collect addresses for batch on-chain enrichment.
  const addresses = enriched.map(({ pair }) => pair.baseToken.address);

  // Primary: batched Helius metadata.
  const heliusMap = await fetchHeliusMetadata(addresses);

  // Fallback 1: Birdeye for tokens Helius couldn't cover.
  const birdeyeAddresses = addresses.filter(
    (addr) => !hasAuthorityInfo(heliusMap.get(addr.toLowerCase()))
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
    return !hasAuthorityInfo(heliusMap.get(key)) && !birdeyeMap.get(key);
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

  const games: Game[] = [];

  for (const { pair, profile } of enriched) {
    const key = pair.baseToken.address.toLowerCase();
    const helius = heliusMap.get(key);
    const birdeye = birdeyeMap.get(key);
    const solscan = solscanMap.get(key);
    const game = pairToGame(pair, profile, helius, birdeye, solscan);

    if (game.price > 0 || game.marketCap > 0 || isWhitelistedGame(pair.baseToken.address)) {
      games.push(game);
    }
  }

  // Dedupe by token mint, prefer entries with a real thumbnail.
  const byMint = new Map<string, Game>();
  for (const game of games) {
    const key = game.tokenMint || game.id;
    const existing = byMint.get(key);
    if (!existing || (existing.thumbnail?.startsWith("data:") && !game.thumbnail?.startsWith("data:"))) {
      byMint.set(key, game);
    }
  }

  return Array.from(byMint.values())
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
