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

const FEATURED_PAIR_ADDRESSES = [
  "bgk8umqrdg3qxql32jjbc89u41n3gschhzamwdpjt4b9",
  "3jtcvdjp9cszn9mjgxwlw37m48aubsry5es6wfcznqlm",
  "frxrs52rlf45nywimjeoquh4g7crry7ny13fxn6t4dd",
  "25axhwudq3jy7seaisoeum9ljfpvzdrhey2b2c7ogngk",
  "acvda6hu6zcqdu7rabhu5t8vhh5hwufjgh6rxya8wgq",
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

function pairToGame(pair: DexPair, profile?: DexProfile): Game {
  const name = pair.baseToken.name;
  const symbol = pair.baseToken.symbol;
  const icon = highResIcon(profile?.icon || pair.info?.imageUrl || "");
  const banner = highResBanner(profile?.header || pair.info?.header || profile?.openGraph || "");

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

function profileToGame(profile: DexProfile, pair?: DexPair): Game {
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
    profile
  );
}

export function useDexScreenerTrending(limit = 12) {
  const [profiles, setProfiles] = useState<DexProfile[]>([]);
  const [pairs, setPairs] = useState<DexPair[]>([]);
  const [featuredPairs, setFeaturedPairs] = useState<DexPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);

        // Fetch featured pairs in parallel
        const featuredRes = await Promise.all(
          FEATURED_PAIR_ADDRESSES.map((addr) =>
            fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${addr}`).then((r) =>
              r.ok ? (r.json() as Promise<{ pairs?: DexPair[] }>) : Promise.resolve({ pairs: [] })
            )
          )
        );
        const featured = featuredRes
          .flatMap((r) => r.pairs || [])
          .filter((p): p is DexPair => !!p);
        if (!cancelled) setFeaturedPairs(featured);

        // Fetch latest token profiles
        const res = await fetch("https://api.dexscreener.com/token-profiles/latest/v1");
        if (!res.ok) throw new Error("Failed to fetch token profiles");
        const data: DexProfile[] = await res.json();
        const solanaProfiles = data
          .filter((p) => p.chainId === "solana")
          .filter(
            (p) =>
              !featured.some(
                (fp) => fp.baseToken.address.toLowerCase() === p.tokenAddress.toLowerCase()
              )
          )
          .slice(0, limit);

        if (cancelled) return;
        setProfiles(solanaProfiles);

        const addresses = solanaProfiles.map((p) => p.tokenAddress).join(",");
        let pairData: DexPair[] = [];
        if (addresses) {
          const pairRes = await fetch(
            `https://api.dexscreener.com/tokens/v1/solana/${addresses}`
          );
          if (!pairRes.ok) throw new Error("Failed to fetch token pairs");
          pairData = await pairRes.json();
        }

        if (cancelled) return;
        setPairs([...featured, ...pairData]);
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
    const featuredGames = featuredPairs.map((pair) => pairToGame(pair));

    const profileGames = profiles
      .filter((profile) => isGamingProfile(profile, pairs))
      .map((profile) => {
        const pair = pairs.find(
          (p) => p.baseToken.address.toLowerCase() === profile.tokenAddress.toLowerCase()
        );
        return profileToGame(profile, pair);
      });

    return [...featuredGames, ...profileGames].filter(
      (g) => g.price > 0 || g.marketCap > 0
    );
  }, [profiles, pairs, featuredPairs]);

  return { games, loading, error };
}

const GAMING_KEYWORDS = [
  "game", "games", "gaming", "play", "p2e", "mmo", "rpg", "metaverse",
  "craft", "city", "runner", "battle", "arena", "nft", "verse", "world",
  "saga", "quest", "dungeon", "kingdom", "empire", "colony", "sim", "simulator",
];

function isGamingProfile(profile: DexProfile, pairs: DexPair[]): boolean {
  const pair = pairs.find(
    (p) => p.baseToken.address.toLowerCase() === profile.tokenAddress.toLowerCase()
  );
  const text = [
    profile.description || "",
    pair?.baseToken?.name || "",
    pair?.baseToken?.symbol || "",
    profile.links?.map((l) => `${l.label || ""} ${l.url}`).join(" ") || "",
    pair?.info?.websites?.map((w) => w.url).join(" ") || "",
  ]
    .join(" ")
    .toLowerCase();
  return GAMING_KEYWORDS.some((kw) => text.includes(kw));
}
