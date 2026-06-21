import { games } from "@/data/games";
import { formatUsd } from "@/lib/format";
import { TrendingUp, Gamepad2, Coins, Users, Activity, Shield } from "lucide-react";

export function StatsTicker() {
  const totalGames = games.length;
  const totalTokens = games.filter((g) => g.tokenMint).length;
  const totalVolume = games.reduce((acc, g) => acc + g.volume24h, 0);
  const totalHolders = games.reduce((acc, g) => acc + g.holders, 0);
  const avgSafety = Math.round(games.reduce((acc, g) => acc + g.safetyScore, 0) / games.length);
  const topGainer = games.reduce((prev, current) =>
    prev.priceChange24h > current.priceChange24h ? prev : current
  );

  const stats = [
    { icon: Gamepad2, label: "GAMES", value: totalGames },
    { icon: Coins, label: "TOKENS", value: totalTokens },
    { icon: Activity, label: "24H VOL", value: formatUsd(totalVolume) },
    { icon: Users, label: "HOLDERS", value: formatUsd(totalHolders) },
    { icon: Shield, label: "AVG SAFETY", value: avgSafety },
    { icon: TrendingUp, label: "TOP GAINER", value: `${topGainer.tokenSymbol} +${topGainer.priceChange24h.toFixed(1)}%` },
  ];

  const LiveBadge = (
    <div className="mr-2 flex shrink-0 items-center gap-1.5 rounded-full border border-positive/20 bg-positive/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-positive sm:mr-3 sm:px-2.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
      </span>
      LIVE
    </div>
  );

  const StatItems = ({ withDividers = true }: { withDividers?: boolean }) => (
    <>
      {stats.map((stat, index) => (
        <div key={`${stat.label}-${index}`} className="flex shrink-0 items-center">
          <div className="flex items-center gap-1 rounded-md px-1.5 py-1 transition-all hover:bg-white/[0.04] hover:scale-[1.02] sm:gap-1.5 sm:px-2.5">
            <stat.icon size={12} className="text-muted-foreground" />
            <span className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:inline">
              {stat.label}
            </span>
            <span className="font-mono text-[11px] font-semibold text-foreground sm:text-xs">
              {stat.value}
            </span>
          </div>
          {withDividers && index < stats.length - 1 && (
            <span className="mx-0.5 h-3 w-px bg-border/40 sm:mx-1" />
          )}
        </div>
      ))}
    </>
  );

  return (
    <div className="relative border-b border-border/40 bg-background/40 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-positive/30 to-transparent" />

      {/* Desktop: horizontal scroll with labels */}
      <div className="relative mx-auto hidden max-w-7xl items-center overflow-x-auto px-4 py-2 scrollbar-hide sm:flex">
        {LiveBadge}
        <StatItems />
      </div>

      {/* Mobile: auto-scrolling marquee */}
      <div className="relative mx-auto flex max-w-7xl items-center overflow-hidden px-4 py-2 sm:hidden">
        {LiveBadge}
        <div className="group flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center group-hover:[animation-play-state:paused]">
            <StatItems withDividers={false} />
          </div>
          <div className="animate-marquee flex shrink-0 items-center group-hover:[animation-play-state:paused]">
            <StatItems withDividers={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
