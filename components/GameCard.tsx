"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Game } from "@/types/game";
import { Badge } from "@/components/ui/badge";
import { SafetyBadge } from "./SafetyBadge";
import { useSavedGames } from "@/hooks/useSavedGames";
import { formatUsd, formatPercent, formatPrice } from "@/lib/format";
import { Save, TrendingUp, TrendingDown } from "lucide-react";

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  index?: number;
}

function Sparkline({ positive }: { positive: boolean }) {
  const points =
    "0,35 10,30 20,33 30,25 40,28 50,20 60,24 70,18 80,22 90,15 100,20";
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 h-20 w-full"
    >
      <defs>
        <linearGradient id={`spark-gradient-${positive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? "#00f0ff" : "#ff4444"} stopOpacity="0.35" />
          <stop offset="60%" stopColor={positive ? "#00f0ff" : "#ff4444"} stopOpacity="0.08" />
          <stop offset="100%" stopColor="#161618" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${points} V40 H0 Z`} fill={`url(#spark-gradient-${positive})`} />
      <path
        d={`M${points}`}
        fill="none"
        stroke={positive ? "#00f0ff" : "#ff4444"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GameCard({ game, onSelect, index = 0 }: GameCardProps) {
  const { isSaved, toggleSave, isConnected } = useSavedGames();
  const isPositive = game.priceChange24h >= 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(game.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      onClick={() => onSelect(game)}
      className="group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Glow layer */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-b from-primary/25 to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

      {/* Card */}
      <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#161618] transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-[0_0_24px_rgba(204, 255, 0, 0.1)]">
        {/* Image container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-t-xl">
          <Image
            src={game.thumbnail}
            alt={game.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Sparkline positive={isPositive} />

          {/* Live badge */}
          {game.status === "live" && (
            <Badge className="absolute right-2 top-2 gap-1 border-0 bg-black/60 px-1.5 py-0 text-[10px] text-emerald-300 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              LIVE
            </Badge>
          )}

          {/* Save button */}
          <button
            onClick={handleToggleSave}
            className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-black/50 text-white/80 backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/70 hover:text-primary active:scale-95"
            title={isConnected ? undefined : "Saved locally. Connect wallet to sync."}
          >
            <Save size={13} className={isSaved(game.id) ? "fill-primary text-primary" : ""} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold tracking-tight text-foreground transition-colors group-hover:text-white">
                {game.name}
              </h3>
              <p className="text-xs text-foreground/50">{game.tokenSymbol}</p>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 border-border/60 bg-secondary/50 px-1.5 py-0 text-[10px]"
            >
              {game.genre}
            </Badge>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">
                Price
              </p>
              <p className="font-mono text-sm font-bold text-foreground">{formatPrice(game.price)}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">
                24h
              </p>
              <p
                className={`flex items-center justify-end gap-0.5 font-mono text-xs font-semibold ${
                  isPositive ? "text-positive" : "text-negative"
                }`}
              >
                <ChangeIcon size={12} />
                {formatPercent(game.priceChange24h)}
              </p>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-[10px] text-foreground/50">
            <SafetyBadge score={game.safetyScore} breakdown={game.safetyBreakdown} size="sm" />
            <span className="font-mono uppercase tracking-wider">{formatUsd(game.marketCap)} MC</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
