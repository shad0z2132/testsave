"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const LOCAL_STORAGE_KEY = "savepoint-saved-games";

function loadLocalSaves(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveLocalSaves(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
}

export function useSavedGames() {
  const { publicKey, connected } = useWallet();
  const wallet = publicKey?.toBase58();

  const [savedIds, setSavedIds] = useState<string[]>(() => loadLocalSaves());
  const [loading, setLoading] = useState(false);
  const [syncedWallet, setSyncedWallet] = useState<string | undefined>();
  const syncInProgress = useRef(false);

  // Persist local saves whenever they change.
  useEffect(() => {
    saveLocalSaves(savedIds);
  }, [savedIds]);

  // Sync cloud saves when wallet connects, and merge with local.
  useEffect(() => {
    if (!connected || !wallet || syncInProgress.current) {
      return;
    }
    if (wallet === syncedWallet) {
      return;
    }

    async function sync() {
      const address = wallet;
      if (!address) return;
      syncInProgress.current = true;
      setLoading(true);
      try {
        const res = await fetch(`/api/saved-games?wallet=${encodeURIComponent(address)}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.details || body.error || `Failed to sync saves (${res.status})`);
        }
        const cloudIds: string[] = await res.json();
        const localIds = loadLocalSaves();

        // Union of local + cloud.
        const merged = Array.from(new Set([...localIds, ...cloudIds]));
        setSavedIds(merged);
        saveLocalSaves(merged);

        // Push any local-only saves to cloud.
        const localOnly = localIds.filter((id) => !cloudIds.includes(id));
        await Promise.all(
          localOnly.map(async (game_id) => {
            const postRes = await fetch("/api/saved-games", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ wallet: address, game_id }),
            });
            if (!postRes.ok) {
              const body = await postRes.json().catch(() => ({}));
              console.warn("[useSavedGames] failed to push save:", body.details || body.error);
            }
          })
        );

        setSyncedWallet(address);
      } catch (err) {
        console.error("[useSavedGames] sync error:", err);
      } finally {
        setLoading(false);
        syncInProgress.current = false;
      }
    }

    sync();
  }, [connected, wallet, syncedWallet]);

  const toggleSave = useCallback(
    async (gameId: string) => {
      const isSaving = !savedIds.includes(gameId);
      setSavedIds((prev) =>
        isSaving ? [...prev, gameId] : prev.filter((id) => id !== gameId)
      );

      if (connected && wallet) {
        try {
          const res = await fetch("/api/saved-games", {
            method: isSaving ? "POST" : "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wallet, game_id: gameId }),
          });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            console.error("[useSavedGames] toggle error:", body.details || body.error || res.status);
          }
        } catch (err) {
          console.error("[useSavedGames] toggle network error:", err);
        }
      }

      return isSaving;
    },
    [savedIds, connected, wallet]
  );

  const isSaved = useCallback(
    (gameId: string) => savedIds.includes(gameId),
    [savedIds]
  );

  return {
    savedIds,
    isSaved,
    toggleSave,
    loading,
    isConnected: connected,
  };
}
