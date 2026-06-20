"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Game } from "@/types/game";
import { GameCard } from "./GameCard";
import { GameListRow } from "./GameListRow";
import { GameCardSkeleton } from "./GameCardSkeleton";
import { GameListRowSkeleton } from "./GameListRowSkeleton";
import { LayoutGrid, List, Search } from "lucide-react";

interface GameFeedProps {
  games: Game[];
  savedGames: string[];
  onSelectGame: (game: Game) => void;
  onToggleSave: (e: React.MouseEvent, gameId: string) => void;
  title?: string;
  isLoading?: boolean;
  id?: string;
}

export function GameFeed({
  games,
  savedGames,
  onSelectGame,
  onToggleSave,
  title,
  isLoading = false,
  id,
}: GameFeedProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  const headerTitle = isLoading
    ? "Loading..."
    : title
    ? title
    : `${games.length} game${games.length !== 1 ? "s" : ""} found`;

  return (
    <div id={id} className="py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/70">
            {headerTitle}
          </h3>
          {!isLoading && games.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
              {games.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-white/[0.03] p-0.5">
          <button
            onClick={() => setView("grid")}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
              view === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-foreground/50 hover:text-foreground"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "text-foreground/50 hover:text-foreground"
            }`}
            aria-label="List view"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-white/[0.02] p-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <GameListRowSkeleton key={i} />
              ))}
            </div>
          )
        ) : games.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-xl border border-border/40 bg-white/[0.02] py-16 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.03]">
              <Search size={20} className="text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">No games found</p>
            <p className="text-xs text-muted-foreground">Try a different filter or search term.</p>
          </motion.div>
        ) : view === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          >
            {games.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                index={index}
                onSelect={onSelectGame}
                isSaved={savedGames.includes(game.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-1 rounded-xl border border-border/60 bg-white/[0.02] p-2"
          >
            {games.map((game, index) => (
              <GameListRow
                key={game.id}
                game={game}
                rank={index + 1}
                index={index}
                onSelect={onSelectGame}
                isSaved={savedGames.includes(game.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
