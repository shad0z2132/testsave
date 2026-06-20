"use client";

import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { games } from "@/data/games";
import {
  ArrowUp,
  Gamepad2,
  Coins,
  TrendingUp,
  Users,
  X,
  MessageCircle,
  Send,
  Globe,
} from "lucide-react";

export function Footer() {
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

  const links = {
    Platform: [
      { label: "Discover", href: "#" },
      { label: "Trending", href: "#" },
      { label: "New Games", href: "#" },
      { label: "Saved", href: "#" },
    ],
    Resources: [
      { label: "Whitepaper", href: "/whitepaper" },
      { label: "Submit Game", href: "#" },
      { label: "API", href: "#" },
      { label: "Docs", href: "#" },
      { label: "Brand Kit", href: "#" },
    ],
    Legal: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
  };

  const socials = [
    { icon: X, href: "https://x.com/savepoint", label: "X" },
    { icon: MessageCircle, href: "#", label: "Discord" },
    { icon: Send, href: "#", label: "Telegram" },
    { icon: Globe, href: "#", label: "Website" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-border/40 bg-background">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Top section */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <Logo size={28} />
              <span className="text-lg font-bold tracking-tight">SavePoint</span>
            </div>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground/60">
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
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-secondary text-foreground/60 transition-all hover:border-primary hover:text-primary hover:shadow-[0_0_12px_rgba(255,42,140,0.2)]"
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground/80">
                {title}
              </h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-foreground/50 transition-colors hover:text-primary"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="mt-10 grid grid-cols-2 gap-3 rounded-xl border border-border/40 bg-card/50 p-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
          ))}
        </div>

        <Separator className="my-6 bg-border/40" />

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-foreground/40">
            © {new Date().getFullYear()} SavePoint. All rights reserved. Not financial advice.
          </p>

          <div className="flex items-center gap-3">
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-border/60 bg-secondary text-xs text-foreground/70 hover:border-primary hover:text-primary"
            >
              <ArrowUp size={12} />
              Back to top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
