import { games as staticGames } from "@/data/games";
import { formatUsd } from "@/lib/format";
import { TrendingUp, Gamepad2, Coins, Users, Activity, Shield } from "lucide-react";
import { Game } from "@/types/game";

interface StatsTickerProps {
  games?: Game[];
}

export function StatsTicker({ games = staticGames }: StatsTickerProps) {
  const totalGames = games.length;
  const totalTokens = games.filter((g) => g.tokenMint).length;
  const totalVolume = games.reduce((acc, g) => acc + g.volume24h, 0);
  const totalHolders = games.reduce((acc, g) => acc + g.holders, 0);
  const avgSafety = games.length > 0
    ? Math.round(games.reduce((acc, g) => acc + g.safetyScore, 0) / games.length)
    : 0;
  const topGainer = games.length > 0
    ? games.reduce((prev, current) =>
        prev.priceChange24h > current.priceChange24h ? prev : current
      )
    : null;

  const stats = [
    { icon: Gamepad2, label: "GAMES", value: totalGames },
    { icon: Coins, label: "TOKENS", value: totalTokens },
    { icon: Activity, label: "24H VOL", value: formatUsd(totalVolume) },
    { icon: Users, label: "HOLDERS", value: formatUsd(totalHolders) },
    { icon: Shield, label: "AVG SAFETY", value: avgSafety },
    topGainer
      ? {
          icon: TrendingUp,
          label: "TOP GAINER",
          value: `${topGainer.tokenSymbol} +${topGainer.priceChange24h.toFixed(1)}%`,
        }
      : null,
  ].filter(Boolean) as { icon: typeof Gamepad2; label: string; value: string | number }[];

  return (
    <div className="relative hidden border-b border-border/40 bg-background/50 backdrop-blur-md sm:block">
      {/* Top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-positive/30 to-transparent" />
      {/* Subtle ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-primary/[0.02]" />
      {/* Bottom inner shadow for depth */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

      <div className="relative mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-2.5 scrollbar-hide">
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-positive/20 bg-positive/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-positive shadow-[0_0_12px_rgba(52,211,153,0.12)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-positive shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </span>
          LIVE
        </div>

        {stats.map((stat, index) => (
          <div key={stat.label} className="flex shrink-0 items-center">
            <div className="group flex items-center gap-1.5 rounded-md px-2 py-1 transition-all hover:bg-white/[0.04]">
              <stat.icon size={14} className="text-muted-foreground transition-colors group-hover:text-foreground" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
              <span className="font-mono text-xs font-semibold text-foreground">
                {stat.value}
              </span>
            </div>
            {index < stats.length - 1 && (
              <span className="mx-2 h-4 w-px bg-gradient-to-b from-transparent via-border/60 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
