"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Game } from "@/types/game";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatPercent, formatUsd, formatNumber } from "@/lib/format";
import { Save, TrendingUp, TrendingDown } from "lucide-react";
import { SafetyBadge } from "./SafetyBadge";
import { useSavedGames } from "@/hooks/useSavedGames";

interface GameListRowProps {
  game: Game;
  rank: number;
  onSelect: (game: Game) => void;
  index?: number;
}

const rankStyles: Record<number, string> = {
  1: "bg-yellow-400/20 text-yellow-400",
  2: "bg-slate-300/20 text-slate-300",
  3: "bg-amber-600/20 text-amber-500",
};

export function GameListRow({ game, rank, onSelect, index = 0 }: GameListRowProps) {
  const { isSaved, toggleSave } = useSavedGames();

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(game.id);
  };
  const isPositive = game.priceChange24h >= 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.02 }}
      onClick={() => onSelect(game)}
      className="group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-all hover:border-primary/30 hover:bg-white/[0.03]"
    >
      {/* Rank */}
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[10px] font-bold ${
          rankStyles[rank] || "bg-white/[0.05] text-foreground/50"
        }`}
      >
        {rank}
      </span>

      {/* Thumbnail */}
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md ring-1 ring-white/[0.06]">
        <Image
          src={game.thumbnail}
          alt={game.name}
          fill
          sizes="36px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Name + meta */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate font-medium text-foreground transition-colors group-hover:text-white">
            {game.name}
          </h4>
          <span className="font-mono text-xs text-foreground/50">{game.tokenSymbol}</span>
          {game.status === "live" && (
            <Badge className="gap-1 border-0 bg-emerald-500/15 px-1 py-0 text-[9px] text-emerald-400">
              <span className="relative flex h-1 w-1">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1 w-1 rounded-full bg-emerald-400" />
              </span>
              LIVE
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-foreground/50">
          <span className="uppercase tracking-wider">{game.genre}</span>
          <span>·</span>
          <SafetyBadge score={game.safetyScore} breakdown={game.safetyBreakdown} size="sm" />
        </div>
      </div>

      {/* Data columns */}
      <div className="hidden sm:flex sm:w-20 sm:flex-col sm:items-end">
        <span className="text-[10px] uppercase tracking-wider text-foreground/50">Price</span>
        <span className="font-mono text-xs font-semibold text-foreground">{formatPrice(game.price)}</span>
      </div>

      <div className="hidden sm:flex sm:w-20 sm:flex-col sm:items-end">
        <span className="text-[10px] uppercase tracking-wider text-foreground/50">24h</span>
        <span className={`flex items-center justify-end gap-0.5 font-mono text-xs font-semibold ${isPositive ? "text-positive" : "text-negative"}`}>
          <ChangeIcon size={10} />
          {formatPercent(game.priceChange24h)}
        </span>
      </div>

      <div className="hidden md:flex md:w-24 md:flex-col md:items-end">
        <span className="text-[10px] uppercase tracking-wider text-foreground/50">MCAP</span>
        <span className="font-mono text-xs font-semibold text-foreground">{formatUsd(game.marketCap)}</span>
      </div>

      <div className="hidden lg:flex lg:w-24 lg:flex-col lg:items-end">
        <span className="text-[10px] uppercase tracking-wider text-foreground/50">VOL</span>
        <span className="font-mono text-xs font-semibold text-foreground">{formatUsd(game.volume24h)}</span>
      </div>

      <div className="hidden lg:flex lg:w-20 lg:flex-col lg:items-end">
        <span className="text-[10px] uppercase tracking-wider text-foreground/50">HLD</span>
        <span className="font-mono text-xs font-semibold text-foreground">{formatNumber(game.holders)}</span>
      </div>

      {/* Save */}
      <button
        onClick={handleToggleSave}
        className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-foreground/50 transition-all hover:bg-white/[0.05] hover:text-primary active:scale-95"
      >
        <Save size={14} className={isSaved(game.id) ? "fill-primary text-primary" : ""} />
      </button>
    </motion.div>
  );
}
