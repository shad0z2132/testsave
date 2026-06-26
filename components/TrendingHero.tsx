import Image from "next/image";
import { Game } from "@/types/game";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { formatPercent, formatPrice, formatUsd, formatNumber } from "@/lib/format";
import { SafetyBadge } from "./SafetyBadge";
import { Flame, TrendingUp, ExternalLink, Gamepad2, BarChart3 } from "lucide-react";

interface TrendingHeroProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

const rankStyles = [
  {
    // #1
    badge: "bg-lime text-black",
    glow: "shadow-[0_0_40px_rgba(204,255,0,0.18)]",
    ring: "ring-lime/30",
  },
  {
    // #2
    badge: "bg-cyan-400 text-black",
    glow: "shadow-[0_0_30px_rgba(34,211,238,0.12)]",
    ring: "ring-cyan-400/30",
  },
  {
    // #3
    badge: "bg-lime/80 text-black",
    glow: "shadow-[0_0_30px_rgba(204,255,0,0.12)]",
    ring: "ring-lime/30",
  },
];

function PodiumCard({
  game,
  rank,
  onSelect,
  featured = false,
}: {
  game: Game;
  rank: number;
  onSelect: (game: Game) => void;
  featured?: boolean;
}) {
  const style = rankStyles[rank - 1];
  const isPositive = game.priceChange24h >= 0;

  return (
    <div
      onClick={() => onSelect(game)}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0a0a] transition-all duration-300 hover:-translate-y-1 hover:border-lime/40 hover:shadow-[0_0_32px_rgba(204,255,0,0.15)] ${style.glow} ${
        featured ? "col-span-2 row-span-2" : ""
      }`}
    >
      {/* Lime top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
      {/* Rank badge */}
      <div
        className={`absolute left-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${style.badge} ${style.ring} ring-2`}
      >
        {rank}
      </div>

      {/* Image */}
      <div className="relative aspect-[3/1] w-full overflow-hidden">
        <Image
          src={game.banner || game.thumbnail}
          alt={game.name}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 50vw, 40vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
      </div>

      {/* Content */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 ${featured ? "sm:p-5" : ""}`}>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
            {game.genre}
          </Badge>
          <SafetyBadge score={game.safetyScore} breakdown={game.safetyBreakdown} />
        </div>

        <h3 className={`font-bold tracking-tight text-foreground transition-colors group-hover:text-white ${featured ? "text-xl sm:text-2xl" : "text-base"}`}>
          {game.name}
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{game.tokenSymbol}</p>

        <div className={`mt-3 grid ${featured ? "grid-cols-2 gap-3 sm:grid-cols-4" : "grid-cols-2 gap-2"}`}>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Price</p>
            <p className="font-mono text-sm font-medium">{formatPrice(game.price)}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">24h</p>
            <p className={`font-mono text-sm font-medium ${isPositive ? "text-positive" : "text-negative"}`}>
              {formatPercent(game.priceChange24h)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Vol 24h</p>
            <p className="font-mono text-sm font-medium">{formatUsd(game.volume24h)}</p>
          </div>
          {featured && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Holders</p>
              <p className="font-mono text-sm font-medium">{formatNumber(game.holders)}</p>
            </div>
          )}
        </div>

        {featured && (
          <div className="mt-4 flex items-center gap-2">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(game);
              }}
            >
              <Gamepad2 size={14} className="mr-1.5" />
              View Game
            </Button>
            <a
              href={game.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export function TrendingHero({ games, onSelectGame }: TrendingHeroProps) {
  const topThree = games.slice(0, 3);

  if (topThree.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0a0a0a] p-8 text-center">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime/10 mx-auto">
          <BarChart3 size={28} className="text-lime" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">No trending projects</h3>
        <p className="mt-1 max-w-md mx-auto text-sm text-foreground/60">
          None of the listed games have meaningful 24h trading volume right now. Check back later or browse the full directory.
        </p>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative py-6 sm:py-8">
        {/* Section header with small logo */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative">
            <Logo size={28} />
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
              <Flame size={8} fill="currentColor" />
            </span>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight sm:text-xl">
              Trending Now
              <Flame size={16} className="text-primary" />
            </h2>
            <p className="text-xs text-muted-foreground">
              The hottest Solana games by 24h volume and momentum.
            </p>
          </div>
        </div>

        {/* Podium */}
        {topThree.length === 1 && (
          <div className="grid grid-cols-1">
            <PodiumCard game={topThree[0]} rank={1} onSelect={onSelectGame} featured />
          </div>
        )}

        {topThree.length === 2 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PodiumCard game={topThree[0]} rank={1} onSelect={onSelectGame} featured />
            <PodiumCard game={topThree[1]} rank={2} onSelect={onSelectGame} />
          </div>
        )}

        {topThree.length >= 3 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {/* #1 takes 3/5 */}
            <div className="lg:col-span-3">
              <PodiumCard game={topThree[0]} rank={1} onSelect={onSelectGame} featured />
            </div>
            {/* #2 and #3 stacked in 2/5 */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 lg:col-span-2">
              <PodiumCard game={topThree[1]} rank={2} onSelect={onSelectGame} />
              <PodiumCard game={topThree[2]} rank={3} onSelect={onSelectGame} />
            </div>
          </div>
        )}

        {/* Mini momentum strip */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp size={12} className="text-positive" />
          <span>Top gainer:</span>
          <span className="font-medium text-foreground">
            {topThree.reduce((prev, current) =>
              prev.priceChange24h > current.priceChange24h ? prev : current
            ).name}
          </span>
          <span className="text-positive">
            +
            {topThree
              .reduce((prev, current) => (prev.priceChange24h > current.priceChange24h ? prev : current))
              .priceChange24h.toFixed(1)}
            %
          </span>
        </div>
      </div>
    </section>
  );
}
