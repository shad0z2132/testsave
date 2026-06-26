"use client";

import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { games as staticGames } from "@/data/games";
import { Game } from "@/types/game";
import {
  ArrowUp,
  Gamepad2,
  Coins,
  TrendingUp,
  Users,
  X,
  ArrowRight,
  Sparkles,
  Heart,
} from "lucide-react";

interface FooterProps {
  games?: Game[];
}

export function Footer({ games = staticGames }: FooterProps) {
  const totalGames = games.length;
  const totalTokens = games.filter((g) => g.tokenMint).length;
  const totalVolume = games.reduce((acc, g) => acc + g.volume24h, 0);
  const totalHolders = games.reduce((acc, g) => acc + g.holders, 0);

  const stats = [
    { icon: Gamepad2, label: "Games", value: totalGames },
    { icon: Coins, label: "Tokens", value: totalTokens },
    { icon: TrendingUp, label: "24h Vol", value: `$${(totalVolume / 1e6).toFixed(2)}M` },
    { icon: Users, label: "Holders", value: `${(totalHolders / 1000).toFixed(1)}K` },
  ];

  const links: Record<string, { label: string; href: string; soon?: boolean }[]> = {
    Platform: [
      { label: "Discover", href: "/" },
      { label: "Trending", href: "/" },
      { label: "New Games", href: "/" },
      { label: "Saved", href: "/" },
    ],
    Resources: [
      { label: "Docs", href: "/docs" },
      { label: "Community", href: "/community" },
      { label: "Submit Game", href: "/submit" },
    ],
    Legal: [
      { label: "Privacy", href: "#", soon: true },
      { label: "Terms", href: "#", soon: true },
    ],
  };

  const socials = [
    { icon: X, href: "https://x.com/savepointsol", label: "X" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-border/40 bg-[#050505]">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/[0.03] to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        {/* Newsletter / CTA */}
        <div className="mb-10 rounded-2xl border border-border/40 bg-gradient-to-br from-primary/10 via-card/50 to-card/50 p-5 shadow-[0_0_40px_rgba(204, 255, 0, 0.06)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                <Sparkles size={10} />
                Stay in the loop
              </div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Get the latest Solana game drops
              </h3>
              <p className="mt-1 max-w-md text-sm text-foreground/60">
                Weekly digests of trending tokens, new listings, and safety updates.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full gap-2 sm:w-auto"
            >
              <input
                type="email"
                placeholder="you@example.com"
                className="h-10 flex-1 rounded-lg border border-border/60 bg-white/[0.03] px-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary/50 sm:w-56"
              />
              <Button
                type="submit"
                size="sm"
                className="h-10 gap-1 rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground shadow-[0_0_16px_rgba(204, 255, 0, 0.25)] transition-all hover:shadow-[0_0_24px_rgba(204, 255, 0, 0.4)] hover:bg-primary/90"
              >
                Subscribe
                <ArrowRight size={12} />
              </Button>
            </form>
          </div>
        </div>

        {/* Top section */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <Logo size={22} />
                <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(204, 255, 0, 0.9)]" />
              </div>
              <span className="text-lg font-bold tracking-tight">SavePoint</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/60">
              Your checkpoint for Solana games. Discover, track, and analyze the hottest web3 gaming tokens.
            </p>

            {/* Socials */}
            <div className="mt-4 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group flex h-10 items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 text-sm font-semibold text-lime transition-all hover:scale-105 hover:border-lime hover:bg-lime hover:text-black hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                >
                  <social.icon size={16} className="transition-transform group-hover:scale-110" />
                  <span>Follow us on X</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground/80">
                <span className="h-1 w-1 rounded-full bg-primary/70" />
                {title}
              </h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label} className="flex items-center gap-2">
                    <a
                      href={item.href}
                      className={`group relative text-sm transition-colors ${
                        item.soon
                          ? "cursor-default text-foreground/30"
                          : "text-foreground/50 hover:text-primary"
                      }`}
                      onClick={item.soon ? (e) => e.preventDefault() : undefined}
                    >
                      {item.label}
                      {!item.soon && (
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
                      )}
                    </a>
                    {item.soon && (
                      <span className="rounded-full border border-border/40 bg-white/[0.03] px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-foreground/40">
                        Soon
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-xl border border-border/40 bg-card p-3 transition-all hover:border-primary/30 hover:shadow-[0_0_20px_rgba(204, 255, 0, 0.08)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <stat.icon size={16} />
                </div>
                <div>
                  <p className="font-mono text-lg font-bold leading-none text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-foreground/50">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6 bg-border/40" />

        {/* Disclaimer */}
        <div className="mb-6 rounded-xl border border-border/40 bg-white/[0.02] p-4">
          <p className="text-[11px] leading-relaxed text-foreground/40">
            Projects listed on SavePoint are vetted and scored using publicly available on-chain and market data.
            These scores are for informational purposes only and do not constitute financial advice.
            The SavePoint team is not responsible for the actions of third-party projects or tokens.
            Always do your own research (DYOR) before investing, trading, or interacting with any token.
          </p>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-xs text-foreground/40">
              © {new Date().getFullYear()} SavePoint. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-[10px] text-foreground/30">
              Built with <Heart size={10} className="fill-lime text-lime" /> for the Solana community.
            </p>
          </div>

          <Button
            onClick={scrollToTop}
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-full border-border/60 bg-white/[0.03] px-4 text-xs text-foreground/70 transition-all hover:scale-105 hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_16px_rgba(204, 255, 0, 0.2)]"
          >
            <ArrowUp size={12} />
            Back to top
          </Button>
        </div>
      </div>
    </footer>
  );
}
