"use client";

import { useState, useEffect, useMemo } from "react";
import { Game } from "@/types/game";

export function useDexScreenerTrending() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const retry = () => setRetryKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;

    async function fetchGames() {
      try {
        setLoading(true);
        const res = await fetch("/api/games");
        if (!res.ok) throw new Error("Failed to fetch games");
        const data: Game[] = await res.json();
        if (!cancelled) {
          setGames(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchGames();
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  return { games, loading, error, retry };
}

export function useDexScreenerToken(tokenAddress: string | undefined) {
  const { games, loading, error } = useDexScreenerTrending();

  const liveGame = useMemo(() => {
    if (!tokenAddress) return null;
    return games.find(
      (g) => g.tokenMint?.toLowerCase() === tokenAddress.toLowerCase()
    ) || null;
  }, [games, tokenAddress]);

  return { liveGame, loading, error };
}
