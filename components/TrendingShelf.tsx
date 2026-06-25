"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Game } from "@/types/game";
import { Badge } from "@/components/ui/badge";
import { Logo } from "./Logo";
import { SafetyBadge } from "./SafetyBadge";
import { formatPrice, formatPercent, formatUsd } from "@/lib/format";
import { Flame, ChevronRight, ChevronLeft, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface TrendingShelfProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
  onSeeAll?: () => void;
  startIndex?: number;
}

const rankBadgeStyles: Record<number, string> = {
  1: "bg-yellow-400 text-black ring-2 ring-yellow-400/40 shadow-[0_0_16px_rgba(255,211,0,0.45)]",
  2: "bg-slate-200 text-black ring-2 ring-slate-200/40 shadow-[0_0_12px_rgba(226,232,240,0.25)]",
  3: "bg-amber-500 text-white ring-2 ring-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]",
};

function MiniSparkline({ positive }: { positive: boolean }) {
  const points = "0,18 10,14 20,16 30,10 40,12 50,6 60,8 70,4 80,6 90,2 100,4";
  return (
    <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="h-10 w-full opacity-50">
      <defs>
        <linearGradient id={`mini-spark-${positive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? "#00f0ff" : "#ff4444"} stopOpacity="0.25" />
          <stop offset="60%" stopColor={positive ? "#00f0ff" : "#ff4444"} stopOpacity="0.05" />
          <stop offset="100%" stopColor="#161618" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${points} V20 H0 Z`} fill={`url(#mini-spark-${positive})`} />
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

function TrendingShelfCard({
  game,
  rank,
  onSelect,
}: {
  game: Game;
  rank: number;
  onSelect: (game: Game) => void;
}) {
  const isPositive = game.priceChange24h >= 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
  const rankStyle =
    rankBadgeStyles[rank] || "bg-primary text-primary-foreground ring-2 ring-primary/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: rank * 0.05 }}
      onClick={() => onSelect(game)}
      className="group relative w-[190px] shrink-0 cursor-pointer snap-start sm:w-[240px]"
    >
      <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#161618] shadow-[0_0_0_0_rgba(204, 255, 0, 0)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_32px_rgba(204, 255, 0, 0.18)]">
        {/* Top gradient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={game.thumbnail}
            alt={game.name}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <MiniSparkline positive={isPositive} />

          {/* Rank badge */}
          <div
            className={`absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${rankStyle}`}
          >
            {rank <= 3 ? (
              <Flame size={14} fill="currentColor" />
            ) : (
              rank
            )}
          </div>

          {/* Live badge */}
          {game.status === "live" && (
            <Badge className="absolute right-2 top-2 gap-1 border-0 bg-black/60 px-1.5 py-0 text-[9px] text-emerald-300 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              LIVE
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h4 className="truncate font-semibold tracking-tight text-foreground transition-colors group-hover:text-white">
            {game.name}
          </h4>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {game.tokenSymbol}
            </p>
            <SafetyBadge score={game.safetyScore} breakdown={game.safetyBreakdown} size="sm" />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <p className="font-mono text-sm font-bold text-foreground">
              {formatPrice(game.price)}
            </p>
            <div
              className={`flex items-center gap-0.5 font-mono text-xs font-semibold ${
                isPositive ? "text-positive" : "text-negative"
              }`}
            >
              <ChangeIcon size={12} />
              {formatPercent(game.priceChange24h)}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                MCAP
              </p>
              <p className="font-mono text-[10px] font-semibold text-foreground">
                {formatUsd(game.marketCap)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                VOL 24H
              </p>
              <p className="font-mono text-[10px] font-semibold text-primary">
                {formatUsd(game.volume24h)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TrendingShelf({
  games,
  onSelectGame,
  onSeeAll,
  startIndex = 1,
}: TrendingShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const visibleGames = games.slice(startIndex > 0 ? startIndex : 0);

  if (visibleGames.length === 0) {
    return (
      <section className="py-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative">
            <Logo size={24} />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[7px] font-bold text-primary-foreground">
              <Flame size={6} fill="currentColor" />
            </span>
          </div>
          <div>
            <h2 className="flex items-center gap-1.5 text-base font-bold tracking-tight sm:text-lg">
              Trending
              <Flame size={14} className="text-primary" />
            </h2>
            <p className="text-xs text-muted-foreground">Games heating up by 24h volume.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/40 bg-card p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <BarChart3 size={28} className="text-primary" />
          </div>
          <p className="mt-4 text-sm text-foreground/60">No trending projects with volume right now.</p>
        </div>
      </section>
    );
  }

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -240 : 240;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="relative py-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Logo size={24} />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[7px] font-bold text-primary-foreground">
              <Flame size={6} fill="currentColor" />
            </span>
          </div>
          <div>
            <h2 className="flex items-center gap-1.5 text-base font-bold tracking-tight sm:text-lg">
              Trending
              <Flame size={14} className="text-primary" />
            </h2>
            <p className="text-xs text-muted-foreground">Games heating up by 24h volume.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            <button
              onClick={() => scroll("left")}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-white/[0.03] text-muted-foreground transition-all hover:border-primary hover:text-primary"
              aria-label="Scroll left"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-white/[0.03] text-muted-foreground transition-all hover:border-primary hover:text-primary"
              aria-label="Scroll right"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              See all
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal scroll shelf */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide scroll-smooth snap-x snap-mandatory"
        >
          {visibleGames.map((game, index) => (
            <TrendingShelfCard
              key={game.id}
              game={game}
              rank={startIndex + index}
              onSelect={onSelectGame}
            />
          ))}
        </div>


      </div>
    </section>
  );
}
