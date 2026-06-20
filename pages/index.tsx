"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { games, getTrendingGames } from "@/data/games";
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

  const { games: dexGames, loading: dexLoading } = useDexScreenerTrending(12);

  const allGames = useMemo(() => {
    const seen = new Set<string>();
    const merged: Game[] = [];
    for (const g of [...dexGames, ...games]) {
      if (!seen.has(g.id)) {
        seen.add(g.id);
        merged.push(g);
      }
    }
    return merged;
  }, [dexGames]);

  const kintara = useMemo(() => allGames.find((g) => g.id === "1"), [allGames]);
  const trendingGames = useMemo(
    () => (dexGames.length > 0 ? dexGames : getTrendingGames()),
    [dexGames]
  );
  const featuredGame = kintara || trendingGames[0] || allGames[0];

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
    <div className="relative min-h-screen bg-background">
      {/* Background effects */}
      <DustParticles />
      <div className="pointer-events-none fixed inset-0 z-0 bg-noise" />

      <div className="relative z-10">
        <CommandPalette
          open={commandOpen}
          onOpenChange={setCommandOpen}
          onSelectGame={handleSelectGame}
          onTabChange={setActiveTab}
          onFilterChange={setActiveFilter}
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

        <div className="lg:ml-56">
          <Header
            onConnect={() => setWalletOpen(true)}
            onSearchClick={() => setCommandOpen(true)}
          />
          <StatsTicker />

          <main className="mx-auto max-w-6xl px-4 pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${activeFilter}-${searchQuery}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {activeTab === "discover" && activeFilter === "All" && !searchQuery && (
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

          <Footer />
        </div>
      </div>

      <GameDetail game={selectedGame} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
