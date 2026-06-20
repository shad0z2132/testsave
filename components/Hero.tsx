"use client";

import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { formatUsd } from "@/lib/format";
import { games } from "@/data/games";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Gamepad2,
  Sparkles,
  TrendingUp,
  Users,
  Coins,
} from "lucide-react";

interface HeroProps {
  onExplore?: () => void;
}

export function Hero({ onExplore }: HeroProps) {
  const totalGames = games.length;
  const totalTokens = games.filter((g) => g.tokenMint).length;
  const totalVolume = games.reduce((acc, g) => acc + g.volume24h, 0);
  const topGainer = games.reduce((prev, current) =>
    prev.priceChange24h > current.priceChange24h ? prev : current
  );

  const stats = [
    { icon: Gamepad2, label: "Games", value: totalGames },
    { icon: Coins, label: "Tokens", value: totalTokens },
    { icon: TrendingUp, label: "24h Vol", value: formatUsd(totalVolume) },
    {
      icon: Users,
      label: "Top Gainer",
      value: `${topGainer.tokenSymbol} +${topGainer.priceChange24h.toFixed(1)}%`,
      highlight: true,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden pt-8 pb-2 sm:pt-12 sm:pb-4"
    >
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        {/* Logo badge */}
        <div className="glass mb-5 flex items-center gap-2 rounded-full px-3 py-1.5">
          <Logo size={20} />
          <span className="text-xs font-medium text-muted-foreground">SavePoint</span>
          <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,42,140,0.8)] animate-pulse-live" />
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Your checkpoint for{" "}
          <span className="text-gradient">Solana games</span>
        </h1>

        {/* Tagline */}
        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          Discover legitimate, playable web3 games. Track tokens, avoid rugs, and find your next obsession.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={onExplore}
            className="h-11 gap-2 bg-primary px-6 text-base font-semibold text-primary-foreground shadow-[0_0_0_0_rgba(255,42,140,0)] transition-all hover:bg-primary/90 hover:shadow-[0_0_28px_rgba(255,42,140,0.35)] active:scale-[0.98]"
          >
            <Sparkles size={16} />
            Explore games
            <ArrowRight size={16} />
          </Button>
          <Button
            variant="outline"
            className="h-11 gap-2 border-border bg-transparent px-6 text-base font-medium text-foreground transition-all hover:border-primary hover:text-primary hover:bg-white/[0.03] active:scale-[0.98]"
          >
            <Gamepad2 size={16} />
            Submit game
          </Button>
        </div>

        {/* Live stats */}
        <div className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="glass flex flex-col items-center gap-1 rounded-xl px-3 py-3 text-center transition-all hover:border-primary/30 hover:bg-white/[0.04] hover:scale-[1.02]"
            >
              <stat.icon
                size={16}
                className={stat.highlight ? "text-positive" : "text-primary"}
              />
              <p className="font-mono text-lg font-semibold text-foreground">
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
