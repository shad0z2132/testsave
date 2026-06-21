"use client";

import { useState, useEffect, useMemo } from "react";
import { Game } from "@/types/game";

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
  info?: {
    imageUrl?: string;
    header?: string;
    websites?: { url: string; label?: string }[];
    socials?: { type: string; url: string }[];
  };
}

// Known Solana gaming token addresses. These are always treated as games and
// fetched directly so they always appear on the platform.
const WHITELISTED_TOKEN_ADDRESSES = [
  "Tqj8yFmagrg7oorpQkVGYR52r96RFTamvWfth9bpump", // kintara
  "2pL9J9mTD9RAGS9jnNeB2kKR62ar8pnQAV2sMgyrpump", // wasabicraft
  "GENEtH5amGSi8kHAtQoezp1XEXwZJ8vcuePYnXdKrMYz", // genopets
  "DFL1zNkaGPWm1BqAVqRjCZvHmwTFrEaJtbzJWgseoNJh", // defi land
  "3dgCCb15HMQSA4Pn3Tfii5vRk7aRqTH95LJjxzsG2Mug", // honeyland
  "H53UGEyBrB9easo9ego8yYk7o4Zq1G5cCtkxD3E3hZav", // mixmob
];

function inferGenre(text: string): { genre: string; tags: string[] } {
  const t = text.toLowerCase();
  const tags = new Set<string>(["Trending"]);

  if (t.includes("rpg") || t.includes("mmo") || t.includes("quest") || t.includes("dungeon")) {
    tags.add("RPG");
    return { genre: "RPG", tags: Array.from(tags) };
  }
  if (t.includes("strategy") || t.includes("battle") || t.includes("war") || t.includes("empire") || t.includes("kingdom")) {
    tags.add("Strategy");
    return { genre: "Strategy", tags: Array.from(tags) };
  }
  if (t.includes("action") || t.includes("shooter") || t.includes("fight")) {
    tags.add("Action");
    return { genre: "Action", tags: Array.from(tags) };
  }
  if (t.includes("arcade") || t.includes("runner") || t.includes("platform")) {
    tags.add("Arcade");
    return { genre: "Arcade", tags: Array.from(tags) };
  }
  if (t.includes("sim") || t.includes("craft") || t.includes("city") || t.includes("colony") || t.includes("world")) {
    tags.add("Simulation");
    return { genre: "Simulation", tags: Array.from(tags) };
  }
  if (t.includes("idle") || t.includes("tap") || t.includes("farm")) {
    tags.add("Idle");
    return { genre: "Idle", tags: Array.from(tags) };
  }
  if (t.includes("sport") || t.includes("race") || t.includes("car")) {
    tags.add("Sports");
    return { genre: "Arcade", tags: Array.from(tags) };
  }

  tags.add("Meme");
  return { genre: "Meme", tags: Array.from(tags) };
}

function highResIcon(url: string): string {
  if (!url) return url;
  return url.replace(/width=\d+&height=\d+/, "width=256&height=256");
}

function highResBanner(url: string): string {
  if (!url) return url;
  return url.replace(/width=\d+&height=\d+/, "width=600&height=200");
}

// Generate a branded placeholder icon when DexScreener has no image for a token.
function tokenPlaceholder(symbol: string): string {
  const clean = symbol.replace(/^\$/, "").slice(0, 3).toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="#161618" />
      <rect x="16" y="16" width="224" height="224" rx="48" fill="none" stroke="#ff2a8c" stroke-width="6" />
      <text x="128" y="148" font-family="ui-sans-serif, system-ui, sans-serif" font-size="72" font-weight="700" fill="#ff2a8c" text-anchor="middle">${clean}</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function pairToGame(
  pair: DexPair,
  profile?: DexProfile,
  logoOverrides: Record<string, string> = {}
): Game {
  const name = pair.baseToken.name;
  const symbol = pair.baseToken.symbol;
  const override = logoOverrides[pair.baseToken.address.toLowerCase()];
  const rawIcon = highResIcon(profile?.icon || pair.info?.imageUrl || override || "");
  const icon = rawIcon || tokenPlaceholder(symbol);
  const rawBanner = highResBanner(profile?.header || pair.info?.header || profile?.openGraph || override || "");
  const banner = rawBanner || icon;

  const website =
    profile?.links?.find((l) => l.label?.toLowerCase() === "website")?.url ||
    pair.info?.websites?.[0]?.url ||
    pair.url;
  const xUrl =
    profile?.links?.find((l) => l.type === "twitter")?.url ||
    pair.info?.socials?.find((s) => s.type === "twitter")?.url;
  const discordUrl =
    profile?.links?.find((l) => l.type === "discord")?.url ||
    pair.info?.socials?.find((s) => s.type === "discord")?.url;
  const telegramUrl =
    profile?.links?.find((l) => l.type === "telegram")?.url ||
    pair.info?.socials?.find((s) => s.type === "telegram")?.url;

  const description = profile?.description || `${symbol} on ${pair.chainId}`;
  const tagline = description.split("\n")[0].slice(0, 80) || `${symbol} token`;
  const { genre, tags } = inferGenre(`${description} ${name} ${symbol} ${website}`);

  return {
    id: `dex-${pair.baseToken.address}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description,
    tagline,
    genre,
    status: "live",
    tokenSymbol: symbol.startsWith("$") ? symbol : `$${symbol}`,
    tokenMint: pair.baseToken.address,
    price: parseFloat(pair.priceUsd),
    priceChange24h: pair.priceChange?.h24 ?? 0,
    marketCap: pair.marketCap,
    volume24h: pair.volume?.h24 ?? 0,
    holders: Math.floor((pair.liquidity?.usd ?? 0) / 10),
    safetyScore: 55,
    thumbnail: icon,
    banner,
    website,
    xUrl,
    discordUrl,
    telegramUrl,
    playUrl: pair.url,
    tags,
    trending: true,
  };
}

function profileToGame(
  profile: DexProfile,
  pair?: DexPair,
  logoOverrides: Record<string, string> = {}
): Game {
  return pairToGame(
    pair || ({
      chainId: profile.chainId,
      url: profile.url,
      baseToken: { address: profile.tokenAddress, name: profile.tokenAddress.slice(0, 8), symbol: "$TOKEN" },
      priceUsd: "0",
      priceChange: { h24: 0 },
      volume: { h24: 0 },
      marketCap: 0,
    } as DexPair),
    profile,
    logoOverrides
  );
}

export function useDexScreenerTrending(limit = 50) {
  const [profiles, setProfiles] = useState<DexProfile[]>([]);
  const [pairs, setPairs] = useState<DexPair[]>([]);
  const [featuredPairs, setFeaturedPairs] = useState<DexPair[]>([]);
  const [logoOverrides, setLogoOverrides] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);

        // Fetch pairs for whitelisted gaming tokens so known games always show.
        const whitelistedRes = await Promise.all(
          WHITELISTED_TOKEN_ADDRESSES.map((addr) =>
            fetch(`https://api.dexscreener.com/tokens/v1/solana/${addr}`).then((r) =>
              r.ok ? (r.json() as Promise<DexPair[]>) : Promise.resolve([])
            )
          )
        );
        const whitelistedPairs = whitelistedRes
          .flat()
          .filter((p): p is DexPair => !!p);
        if (!cancelled) setFeaturedPairs(whitelistedPairs);

        // Fetch fallback logos from CoinGecko for whitelisted gaming tokens.
        const logoMap: Record<string, string> = {};
        await Promise.all(
          WHITELISTED_TOKEN_ADDRESSES.map(async (addr) => {
            try {
              const res = await fetch(
                `https://api.coingecko.com/api/v3/coins/solana/contract/${addr}`,
                { signal: AbortSignal.timeout(5000) }
              );
              if (!res.ok) return;
              const data = await res.json();
              if (data.image?.large) {
                logoMap[addr.toLowerCase()] = data.image.large;
              }
            } catch {
              // Ignore individual CoinGecko failures.
            }
          })
        );
        if (!cancelled) setLogoOverrides(logoMap);

        // Fetch latest token profiles
        const res = await fetch("https://api.dexscreener.com/token-profiles/latest/v1");
        if (!res.ok) throw new Error("Failed to fetch token profiles");
        const data: DexProfile[] = await res.json();
        const solanaProfiles = data
          .filter((p) => p.chainId === "solana")
          .slice(0, limit);

        if (cancelled) return;
        setProfiles(solanaProfiles);

        // Batch pair requests to stay safely under URL length limits.
        const BATCH_SIZE = 30;
        const addresses = solanaProfiles.map((p) => p.tokenAddress);
        let pairData: DexPair[] = [];
        for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
          const batch = addresses.slice(i, i + BATCH_SIZE).join(",");
          if (!batch) continue;
          const pairRes = await fetch(
            `https://api.dexscreener.com/tokens/v1/solana/${batch}`
          );
          if (!pairRes.ok) throw new Error("Failed to fetch token pairs");
          const batchPairs: DexPair[] = await pairRes.json();
          pairData.push(...batchPairs);
        }

        if (cancelled) return;
        setPairs([...whitelistedPairs, ...pairData]);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const games = useMemo(() => {
    const featuredGames = featuredPairs
      .filter(isGamingPair)
      .map((pair) => {
        const profile = profiles.find(
          (p) =>
            p.tokenAddress.toLowerCase() === pair.baseToken.address.toLowerCase()
        );
        return pairToGame(pair, profile, logoOverrides);
      });

    const profileGames = profiles
      .filter((profile) => isGamingProfile(profile, pairs))
      .map((profile) => {
        const pair = pairs.find(
          (p) => p.baseToken.address.toLowerCase() === profile.tokenAddress.toLowerCase()
        );
        return profileToGame(profile, pair, logoOverrides);
      });

    const merged = [...featuredGames, ...profileGames]
      .filter((g) => g.price > 0 || g.marketCap > 0)
      .filter(
        (g) => !isBlockedToken(g.name, g.tokenSymbol, g.tokenMint || "")
      );

    // Dedupe by token mint/id; prefer entries with a real thumbnail.
    const byKey = new Map<string, Game>();
    for (const game of merged) {
      const key = game.tokenMint || game.id;
      const existing = byKey.get(key);
      if (!existing || (existing.thumbnail?.startsWith("data:") && !game.thumbnail?.startsWith("data:"))) {
        byKey.set(key, game);
      }
    }

    return Array.from(byKey.values());
  }, [profiles, pairs, featuredPairs, logoOverrides]);

  return { games, loading, error };
}

/**
 * Fetch live pair data for a single token address.
 * Useful for pinning a featured project (e.g. Kintara) to real DexScreener data.
 */
export function useDexScreenerToken(tokenAddress: string | undefined, refreshInterval = 30000) {
  const [pair, setPair] = useState<DexPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenAddress) return;
    let cancelled = false;

    async function fetchToken() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.dexscreener.com/tokens/v1/solana/${tokenAddress}`
        );
        if (!res.ok) throw new Error("Failed to fetch token data");
        const data: DexPair[] = await res.json();
        const bestPair = data.sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))[0];

        if (!cancelled) {
          setPair(bestPair || null);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchToken();
    const interval = setInterval(fetchToken, refreshInterval);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [tokenAddress, refreshInterval]);

  const liveGame = useMemo(() => {
    if (!pair) return null;
    return pairToGame(pair);
  }, [pair]);

  return { pair, liveGame, loading, error };
}

// Tokens that should never be treated as games regardless of description keywords.
const BLOCKED_SYMBOLS = new Set(["nudaeng", "ballsack", "ballsack coin"]);

// Strict gaming keywords. Avoid generic terms like "play", "world", or "nft"
// that let meme tokens slip through.
const GAMING_KEYWORDS = [
  "game", "games", "gaming", "gamer", "gamers",
  "play-to-earn", "p2e", "p2w", "play2earn",
  "mmo", "mmorpg", "rpg", "roleplay", "role-playing",
  "metaverse", "virtual world",
  "craft", "crafting",
  "runner", "racing",
  "battle", "battler", "arena",
  "quest", "dungeon", "raid", "roguelike",
  "strategy", "tactics",
  "simulator", "simulation",
  "shooter", "fps", "action",
  "card game", "trading card",
  "mobil game", "mobile gaming",
  "idle game", "idle rpg",
];

function normalizeText(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function isBlockedToken(name: string, symbol: string, address: string): boolean {
  const text = normalizeText(name, symbol, address);
  return BLOCKED_SYMBOLS.has(symbol.toLowerCase()) ||
    BLOCKED_SYMBOLS.has(name.toLowerCase()) ||
    Array.from(BLOCKED_SYMBOLS).some((term) => text.includes(term));
}

function isWhitelistedGame(address: string): boolean {
  return WHITELISTED_TOKEN_ADDRESSES.some(
    (a) => a.toLowerCase() === address.toLowerCase()
  );
}

function isGamingText(text: string): boolean {
  const lower = text.toLowerCase();
  return GAMING_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

function isGamingProfile(profile: DexProfile, pairs: DexPair[]): boolean {
  if (isWhitelistedGame(profile.tokenAddress)) return true;

  const pair = pairs.find(
    (p) => p.baseToken.address.toLowerCase() === profile.tokenAddress.toLowerCase()
  );

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

  if (
    isBlockedToken(
      pair.baseToken.name,
      pair.baseToken.symbol,
      pair.baseToken.address
    )
  ) {
    return false;
  }

  const text = normalizeText(
    pair.baseToken.name,
    pair.baseToken.symbol,
    pair.info?.websites?.map((w) => w.url).join(" ")
  );

  return isGamingText(text);
}
