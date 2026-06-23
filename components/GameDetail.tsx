"use client";

import Image from "next/image";
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
import { ExternalLink, Gamepad2, Save, BarChart3 } from "lucide-react";

interface GameDetailProps {
  game: Game | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent, gameId: string) => void;
}

export function GameDetail({ game, open, onOpenChange, isSaved, onToggleSave }: GameDetailProps) {
  if (!game) return null;

  const isPositive = game.priceChange24h >= 0;

  const stats = [
    { label: "Price", value: formatPrice(game.price) },
    { label: "24h Change", value: formatPercent(game.priceChange24h), positive: isPositive },
    { label: "Market Cap", value: formatUsd(game.marketCap) },
    { label: "24h Volume", value: formatUsd(game.volume24h) },
    { label: "Holders", value: formatNumber(game.holders) },
  ];

  const dexScreenerUrl = game.playUrl?.includes("dexscreener.com")
    ? game.playUrl
    : game.tokenMint
    ? `https://dexscreener.com/solana/${game.tokenMint}`
    : undefined;

  const links = [
    { label: "Website", url: game.website, icon: ExternalLink },
    { label: "X / Twitter", url: game.xUrl, icon: ExternalLink },
    { label: "Discord", url: game.discordUrl, icon: ExternalLink },
    { label: "Telegram", url: game.telegramUrl, icon: ExternalLink },
    { label: "Docs", url: game.docsUrl, icon: ExternalLink },
  ].filter((link) => link.url);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full border-border bg-card p-0 sm:max-w-md">
        <div className="relative aspect-[3/1] w-full overflow-hidden bg-black/40">
          <Image
            src={game.banner || game.thumbnail}
            alt={game.name}
            fill
            sizes="(max-width: 768px) 100vw, 448px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        </div>

        <div className="flex flex-col gap-4 p-5">
          <SheetHeader className="p-0">
            <div className="flex flex-wrap items-center gap-2">
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
              <SafetyBadge score={game.safetyScore} breakdown={game.safetyBreakdown} />
            </div>
            <SheetTitle className="text-2xl font-bold">{game.name}</SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              {game.tagline}
            </SheetDescription>
          </SheetHeader>

          <div className="flex items-center gap-2">
            <a
              href={game.playUrl || game.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Gamepad2 size={16} className="mr-2" />
              {game.playUrl?.includes("dexscreener.com") ? "DexScreener" : "Play Game"}
            </a>
            {dexScreenerUrl && game.tokenMint && (
              <a
                href={dexScreenerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <BarChart3 size={16} />
              </a>
            )}
            <Button
              variant="outline"
              onClick={(e) => onToggleSave?.(e, game.id)}
              className={`border-border transition-all hover:border-primary hover:scale-105 active:scale-95 ${
                isSaved ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Save size={16} className={isSaved ? "fill-primary" : ""} />
            </Button>
          </div>

          <Separator className="bg-border" />

          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-background p-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <p
                  className={`font-mono text-sm font-medium ${
                    "positive" in stat
                      ? stat.positive
                        ? "text-positive"
                        : "text-negative"
                      : "text-foreground"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <Separator className="bg-border" />

          <div>
            <h4 className="mb-2 text-sm font-medium">About</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {game.description}
            </p>
          </div>

          {links.length > 0 && (
            <>
              <Separator className="bg-border" />
              <div>
                <h4 className="mb-2 text-sm font-medium">Links</h4>
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
                        className="border-border text-xs text-muted-foreground hover:border-primary hover:text-primary"
                      >
                        <link.icon size={12} className="mr-1.5" />
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
              <Separator className="bg-border" />
              <div>
                <h4 className="mb-1 text-sm font-medium">Token Mint</h4>
                <p className="break-all font-mono text-xs text-muted-foreground">
                  {game.tokenMint}
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
