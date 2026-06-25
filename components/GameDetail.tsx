"use client";

import Image from "next/image";
import { useState } from "react";
import { Game } from "@/types/game";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatNumber, formatUsd, formatPercent, formatPrice } from "@/lib/format";
import { SafetyBadge } from "./SafetyBadge";
import { useSavedGames } from "@/hooks/useSavedGames";
import {
  ExternalLink,
  Gamepad2,
  Save,
  BarChart3,
  Copy,
  Check,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GameDetailProps {
  game: Game | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StatCard({
  label,
  value,
  positive,
  icon: Icon,
}: {
  label: string;
  value: string;
  positive?: boolean;
  icon: React.ElementType;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-black/40 p-3 transition-all hover:border-lime/30 hover:shadow-[0_0_20px_rgba(204,255,0,0.08)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground/40">
        <Icon size={10} className="text-lime/70" />
        {label}
      </div>
      <p
        className={cn(
          "font-mono text-sm font-semibold",
          positive === true && "text-positive",
          positive === false && "text-negative",
          positive === undefined && "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function GameDetail({ game, open, onOpenChange }: GameDetailProps) {
  const { isSaved, toggleSave } = useSavedGames();
  const [copied, setCopied] = useState(false);

  if (!game) return null;

  const isPositive = game.priceChange24h >= 0;
  const saved = isSaved(game.id);

  const dexScreenerUrl = game.playUrl?.includes("dexscreener.com")
    ? game.playUrl
    : game.tokenMint
    ? `https://dexscreener.com/solana/${game.tokenMint}`
    : undefined;

  const primaryAction = game.playUrl?.includes("dexscreener.com")
    ? { label: "DexScreener", url: game.playUrl, icon: BarChart3 }
    : game.website
    ? { label: "Play Game", url: game.website, icon: Gamepad2 }
    : { label: "DexScreener", url: dexScreenerUrl, icon: BarChart3 };

  const links = [
    { label: "Website", url: game.website, icon: ExternalLink },
    { label: "X", url: game.xUrl, icon: ExternalLink },
    { label: "Discord", url: game.discordUrl, icon: ExternalLink },
    { label: "Telegram", url: game.telegramUrl, icon: ExternalLink },
    { label: "Docs", url: game.docsUrl, icon: ExternalLink },
  ].filter((link) => link.url && link.url !== primaryAction.url);

  const handleCopyMint = async () => {
    if (!game.tokenMint) return;
    try {
      await navigator.clipboard.writeText(game.tokenMint);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-l border-lime/20 bg-[#050505] p-0 shadow-[0_0_60px_rgba(204,255,0,0.08)] sm:max-w-md"
      >
        {/* Banner */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
          <Image
            src={game.banner || game.thumbnail}
            alt={game.name}
            fill
            sizes="(max-width: 768px) 100vw, 448px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(204,255,0,0.12),transparent_60%)]" />

          {/* Floating thumbnail */}
          <div className="absolute -bottom-8 left-5 h-20 w-20 overflow-hidden rounded-2xl border-2 border-lime/30 shadow-[0_0_30px_rgba(204,255,0,0.25)]">
            <Image
              src={game.thumbnail}
              alt={game.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 px-5 pb-8 pt-10">
          <SheetHeader className="p-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-lime/30 bg-lime/10 text-lime"
              >
                {game.genre}
              </Badge>
              <Badge
                variant="outline"
                className="border-white/[0.08] bg-white/[0.04] capitalize text-foreground/80"
              >
                {game.status}
              </Badge>
              <SafetyBadge score={game.safetyScore} breakdown={game.safetyBreakdown} />
            </div>

            <SheetTitle className="text-3xl font-bold tracking-tight text-white">
              {game.name}
            </SheetTitle>
            <SheetDescription className="text-sm leading-relaxed text-foreground/60">
              {game.tagline}
            </SheetDescription>
          </SheetHeader>

          {/* Tags */}
          {game.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-foreground/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center gap-2">
            {primaryAction.url ? (
              <a
                href={primaryAction.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-lime py-2.5 text-sm font-bold text-black shadow-[0_0_24px_rgba(204,255,0,0.25)] transition-all hover:bg-lime/90 hover:shadow-[0_0_32px_rgba(204,255,0,0.4)] active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                <primaryAction.icon size={16} className="mr-2" />
                {primaryAction.label}
              </a>
            ) : (
              <button
                disabled
                className="flex flex-1 items-center justify-center rounded-xl bg-white/[0.05] py-2.5 text-sm font-bold text-foreground/40"
              >
                No link available
              </button>
            )}

            {dexScreenerUrl && !game.playUrl?.includes("dexscreener.com") && (
              <a
                href={dexScreenerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] text-foreground/70 transition-all hover:border-lime/50 hover:bg-lime/10 hover:text-lime hover:shadow-[0_0_16px_rgba(204,255,0,0.15)]"
                aria-label="DexScreener"
              >
                <BarChart3 size={17} />
              </a>
            )}

            <Button
              variant="outline"
              onClick={() => toggleSave(game.id)}
              className={cn(
                "size-10 rounded-xl border-white/[0.12] bg-white/[0.04] p-0 transition-all hover:scale-105 hover:border-lime/50 hover:bg-lime/10 hover:text-lime active:scale-95",
                saved ? "text-lime" : "text-foreground/70"
              )}
              aria-label={saved ? "Unsave game" : "Save game"}
            >
              <Save size={17} className={cn(saved && "fill-lime")} />
            </Button>
          </div>

          <Separator className="bg-white/[0.08]" />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Price" value={formatPrice(game.price)} icon={DollarSign} />
            <StatCard
              label="24h Change"
              value={formatPercent(game.priceChange24h)}
              positive={isPositive}
              icon={Activity}
            />
            <StatCard label="Market Cap" value={formatUsd(game.marketCap)} icon={TrendingUp} />
            <StatCard label="24h Volume" value={formatUsd(game.volume24h)} icon={BarChart3} />
            <StatCard label="Holders" value={formatNumber(game.holders)} icon={Users} />
          </div>

          <Separator className="bg-white/[0.08]" />

          {/* About */}
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground/70">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              About
            </h4>
            <p className="text-sm leading-relaxed text-foreground/70">
              {game.description}
            </p>
          </div>

          {links.length > 0 && (
            <>
              <Separator className="bg-white/[0.08]" />
              <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                  Links
                </h4>
                <div className="flex flex-wrap gap-2">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-white/[0.12] bg-white/[0.04] text-xs text-foreground/70 transition-all hover:border-lime/50 hover:bg-lime/10 hover:text-lime"
                      >
                        <link.icon size={11} className="mr-1.5" />
                        {link.label}
                      </Button>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {game.tokenMint && (
            <>
              <Separator className="bg-white/[0.08]" />
              <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                  Token Mint
                </h4>
                <button
                  onClick={handleCopyMint}
                  className="group flex w-full items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2 transition-all hover:border-lime/30"
                >
                  <p className="break-all font-mono text-[11px] text-foreground/60">
                    {game.tokenMint}
                  </p>
                  {copied ? (
                    <Check size={14} className="shrink-0 text-lime" />
                  ) : (
                    <Copy size={14} className="shrink-0 text-foreground/40 transition-colors group-hover:text-lime" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
