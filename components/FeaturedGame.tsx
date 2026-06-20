"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Game } from "@/types/game";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatUsd,
  formatPercent,
  formatPrice,
  formatNumber,
} from "@/lib/format";
import {
  ExternalLink,
  Flame,
  Gamepad2,
  Save,
  Trophy,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
} from "lucide-react";

interface FeaturedGameProps {
  game: Game;
  onSelect: (game: Game) => void;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent, gameId: string) => void;
}

function PriceSparkline({ positive }: { positive: boolean }) {
  const points =
    "0,42 12,36 24,40 36,30 48,34 60,24 72,28 84,18 96,22 108,14 120,20";
  return (
    <svg
      viewBox="0 0 120 45"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 h-24 w-full opacity-40"
    >
      <defs>
        <linearGradient
          id={`featured-spark-gradient-${positive}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor={positive ? "#00f0ff" : "#ff4444"}
            stopOpacity="0.7"
          />
          <stop
            offset="100%"
            stopColor={positive ? "#00f0ff" : "#ff4444"}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <path d={`M${points} V45 H0 Z`} fill={`url(#featured-spark-gradient-${positive})`} />
      <path
        d={`M${points}`}
        fill="none"
        stroke={positive ? "#00f0ff" : "#ff4444"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SafetyRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "#34d399" : score >= 60 ? "#facc15" : "#f87171";

  return (
    <div className="relative flex h-11 w-11 items-center justify-center">
      <svg className="h-full w-full -rotate-90">
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="4"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-foreground">{score}</span>
    </div>
  );
}

export function FeaturedGame({
  game,
  onSelect,
  isSaved,
  onToggleSave,
}: FeaturedGameProps) {
  const isPositive = game.priceChange24h >= 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="py-5"
    >
      {/* Section header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-yellow-400/10">
            <Trophy size={14} className="text-yellow-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Featured #1
          </span>
          <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,42,140,0.8)] animate-pulse-live" />
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          <Flame size={12} className="animate-pulse" />
          HOT
        </div>
      </div>

      {/* Main card */}
      <div
        onClick={() => onSelect(game)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_60px_rgba(255,42,140,0.12)]"
      >
        {/* Top gradient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Banner */}
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <Image
            src={game.banner || game.thumbnail}
            alt={game.name}
            fill
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
          <PriceSparkline positive={isPositive} />

          {/* Fade sparkline into content */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card via-card/60 to-transparent" />

          {/* Rank badge */}
          <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-base font-black text-black shadow-[0_0_24px_rgba(255,211,0,0.4)] ring-4 ring-yellow-400/20">
            1
          </div>
        </div>

        {/* Content */}
        <div className="relative -mt-12 p-5 sm:-mt-14">
          {/* Token logo */}
          <div className="absolute -top-9 left-5 z-10 h-16 w-16 overflow-hidden rounded-2xl border-2 border-card bg-card shadow-[0_0_24px_rgba(0,0,0,0.4)] sm:-top-11 sm:h-20 sm:w-20">
            <Image
              src={game.thumbnail}
              alt={game.tokenSymbol}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>

          {/* Top row: title, price, safety */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 pl-[5.5rem] sm:pl-[6.5rem]">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/10 text-primary"
                >
                  {game.genre}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-border bg-secondary capitalize text-secondary-foreground"
                >
                  {game.status}
                </Badge>
                {game.tokenMint && (
                  <Badge
                    variant="outline"
                    className="border-border bg-white/[0.03] text-muted-foreground"
                  >
                    {game.tokenSymbol}
                  </Badge>
                )}
              </div>

              <h2 className="text-3xl font-bold tracking-tight transition-colors group-hover:text-white sm:text-4xl">
                {game.name}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{game.tagline}</p>
            </div>

            {/* Price block */}
            <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-black/20 p-3 transition-colors group-hover:border-primary/20 group-hover:bg-white/[0.02]">
              <SafetyRing score={game.safetyScore} />
              <div className="text-right">
                <p className="font-mono text-2xl font-bold text-foreground">
                  {formatPrice(game.price)}
                </p>
                <div
                  className={`flex items-center justify-end gap-1 font-mono text-sm font-medium ${
                    isPositive ? "text-positive" : "text-negative"
                  }`}
                >
                  <ChangeIcon size={14} />
                  {formatPercent(game.priceChange24h)}
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-5 flex items-center gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(game);
              }}
              className="bg-primary text-primary-foreground shadow-[0_0_0_0_rgba(255,42,140,0)] transition-all hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(255,42,140,0.35)] active:scale-[0.98]"
            >
              <Gamepad2 size={16} className="mr-1.5" />
              View Game
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => onToggleSave?.(e, game.id)}
              className={`border-border transition-all hover:border-primary hover:scale-105 active:scale-95 ${
                isSaved ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Save size={16} className={isSaved ? "fill-primary" : ""} />
            </Button>
            <a
              href={game.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary hover:scale-105 active:scale-95"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-px border-t border-border/40 bg-border/30 sm:grid-cols-4">
          {[
            { label: "Market Cap", value: formatUsd(game.marketCap), icon: BarChart3 },
            { label: "24h Volume", value: formatUsd(game.volume24h), icon: BarChart3 },
            { label: "Holders", value: formatNumber(game.holders), icon: Users },
            {
              label: "Safety Score",
              value: `${game.safetyScore}/100`,
              icon: Trophy,
              color:
                game.safetyScore >= 80
                  ? "text-emerald-400"
                  : game.safetyScore >= 60
                  ? "text-yellow-400"
                  : "text-red-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group/stat flex items-center justify-between bg-black/20 px-4 py-3 transition-colors hover:bg-white/[0.03]"
            >
              <div>
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <stat.icon size={10} />
                  {stat.label}
                </p>
                <p
                  className={`font-mono text-sm font-semibold transition-colors group-hover/stat:text-foreground ${
                    stat.color || "text-foreground"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
