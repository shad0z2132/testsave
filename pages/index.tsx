"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { useDexScreenerTrending } from "@/hooks/useDexScreener";
import { Header } from "@/components/Header";
import { StatsTicker } from "@/components/StatsTicker";
import { FilterTabs } from "@/components/FilterTabs";
import { Footer } from "@/components/Footer";
import { DustParticles } from "@/components/DustParticles";
import { FeaturedGame } from "@/components/FeaturedGame";
import { GameFeed } from "@/components/GameFeed";
import { GameDetail } from "@/components/GameDetail";
import { TrendingHero } from "@/components/TrendingHero";
import { TrendingShelf } from "@/components/TrendingShelf";
import { LeftSidebar } from "@/components/LeftSidebar";
import { CommandPalette } from "@/components/CommandPalette";
import { WalletModal } from "@/components/WalletModal";
import { Game } from "@/types/game";
import { Search } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("discover");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [savedGames, setSavedGames] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("savepoint-saved-games");
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  // Persist saved games
  useEffect(() => {
    localStorage.setItem("savepoint-saved-games", JSON.stringify(savedGames));
  }, [savedGames]);

  // Sync tab/filter from URL query when navigating from another page.
  const router = useRouter();
  useEffect(() => {
    const tab = typeof router.query.tab === "string" ? router.query.tab : undefined;
    const filter = typeof router.query.filter === "string" ? router.query.filter : undefined;

    if (tab && ["discover", "trending", "new", "saved"].includes(tab)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tab);
    }
    if (filter) {
      setActiveFilter(filter);
    }
  }, [router.query.tab, router.query.filter]);

  const { games: dexGames, loading: dexLoading, error: dexError, retry: retryDex } = useDexScreenerTrending();

  // Score projects by activity, size, and momentum to surface the most relevant ones.
  const scoreGame = useCallback((game: Game): number => {
    const volumeScore = Math.log10(game.volume24h + 1);
    const mcapScore = Math.log10(game.marketCap + 1);
    const holderScore = Math.log10(game.holders + 1);
    const momentumScore = Math.min(Math.max(game.priceChange24h, 0), 100) / 100;

    return volumeScore * 0.35 + mcapScore * 0.25 + holderScore * 0.2 + momentumScore * 0.2;
  }, []);

  const sortedGames = useMemo(() => {
    return [...dexGames].sort((a, b) => scoreGame(b) - scoreGame(a));
  }, [dexGames, scoreGame]);

  const allGames = useMemo(() => sortedGames, [sortedGames]);

  // Trending section should only surface projects with real 24h volume and momentum.
  const TRENDING_MIN_VOLUME = 500;
  const trendingGames = useMemo(() => {
    const withVolume = sortedGames.filter((g) => g.volume24h >= TRENDING_MIN_VOLUME);
    // Sort by a simple momentum score: volume * (1 + max(priceChange, 0)/100).
    return [...withVolume].sort(
      (a, b) =>
        b.volume24h * (1 + Math.max(b.priceChange24h, 0) / 100) -
        a.volume24h * (1 + Math.max(a.priceChange24h, 0) / 100)
    );
  }, [sortedGames]);

  const featuredGame = sortedGames[0] || null;

  const filteredGames = useMemo(() => {
    let result = [...allGames];

    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(query) ||
          g.tokenSymbol.toLowerCase().includes(query) ||
          g.genre.toLowerCase().includes(query) ||
          g.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tab filtering
    if (activeTab === "trending") {
      result = result.filter((g) => g.trending);
    } else if (activeTab === "new") {
      result = result.filter((g) => g.status === "alpha" || g.status === "beta");
    } else if (activeTab === "saved") {
      result = result.filter((g) => savedGames.includes(g.id));
    }

    // Genre/status filtering
    if (activeFilter !== "All") {
      const filter = activeFilter.toLowerCase();
      result = result.filter(
        (g) =>
          g.genre.toLowerCase() === filter ||
          g.status.toLowerCase() === filter ||
          g.tags.some((tag) => tag.toLowerCase() === filter)
      );
    }

    return result;
  }, [activeTab, activeFilter, searchQuery, savedGames, allGames]);

  const showTrendingHero =
    activeTab === "trending" && activeFilter === "All" && !searchQuery;

  const feedGames = useMemo(() => {
    if (showTrendingHero) {
      // Skip the top 3 already shown in the hero
      const heroIds = new Set(trendingGames.slice(0, 3).map((g) => g.id));
      return filteredGames.filter((g) => !heroIds.has(g.id));
    }
    return filteredGames;
  }, [showTrendingHero, trendingGames, filteredGames]);

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    setDetailOpen(true);
  };

  const handleToggleSave = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    setSavedGames((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  return (
    <div className="relative min-h-screen bg-background bg-grid">
      {/* Background effects */}
      <DustParticles />

      <div className="relative z-10">
        <CommandPalette
          open={commandOpen}
          onOpenChange={setCommandOpen}
          onSelectGame={handleSelectGame}
          onTabChange={setActiveTab}
          onFilterChange={setActiveFilter}
          games={allGames}
        />

        <WalletModal open={walletOpen} onOpenChange={setWalletOpen} />

        <LeftSidebar
          activeTab={activeTab}
          activeFilter={activeFilter}
          onTabChange={setActiveTab}
          onFilterChange={setActiveFilter}
          onConnect={() => setWalletOpen(true)}
          allGames={allGames}
        />

        <div className="flex min-h-screen flex-col lg:ml-56">
          <Header
            onConnect={() => setWalletOpen(true)}
            onSearchClick={() => setCommandOpen(true)}
          />
          <StatsTicker games={allGames} />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${activeFilter}-${searchQuery}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {activeTab === "discover" && activeFilter === "All" && !searchQuery && featuredGame && (
                  <>
                    <FeaturedGame
                      game={featuredGame}
                      onSelect={handleSelectGame}
                      isSaved={savedGames.includes(featuredGame.id)}
                      onToggleSave={handleToggleSave}
                    />

                    {/* Slogan */}
                    <div className="my-6 flex items-center gap-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                      <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-primary">
                        Play safe on Solana.
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    <TrendingShelf
                      games={trendingGames}
                      onSelectGame={handleSelectGame}
                      onSeeAll={() => setActiveTab("trending")}
                      startIndex={1}
                    />
                  </>
                )}

                {showTrendingHero && (
                  <TrendingHero games={trendingGames} onSelectGame={handleSelectGame} />
                )}

                {/* Search bar */}
                <div className="pt-6">
                  <div className="glass relative rounded-xl transition-colors focus-within:border-primary/50 focus-within:bg-white/[0.04]">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search games, tokens, genres..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-11 w-full rounded-xl bg-transparent pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                  </div>
                </div>

                <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

                <GameFeed
                  games={feedGames}
                  savedGames={savedGames}
                  onSelectGame={handleSelectGame}
                  onToggleSave={handleToggleSave}
                  isLoading={dexLoading}
                  error={dexError}
                  onRetry={retryDex}
                  title={
                    showTrendingHero
                      ? "More trending"
                      : activeFilter !== "All"
                      ? activeFilter
                      : activeTab === "saved"
                      ? "Saved games"
                      : activeTab === "new"
                      ? "New games"
                      : activeTab === "trending"
                      ? "All trending"
                      : undefined
                  }
                />
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer games={allGames} />
        </div>
      </div>

      <GameDetail
        game={selectedGame}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        isSaved={selectedGame ? savedGames.includes(selectedGame.id) : false}
        onToggleSave={handleToggleSave}
      />
    </div>
  );
}
