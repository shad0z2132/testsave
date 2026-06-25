import Link from "next/link";
import { Logo } from "./Logo";
import { Search, Command, Menu } from "lucide-react";
import { SolanaConnectButton } from "./SolanaConnectButton";

interface HeaderProps {
  onSearchClick: () => void;
  onMenuClick?: () => void;
}

export function Header({ onSearchClick, onMenuClick }: HeaderProps) {
  return (
    <header className="group/header sticky top-0 z-40 w-full">
      {/* Animated gradient border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-60" />

      <div className="relative border-b border-border/40 bg-background/60 backdrop-blur-xl transition-colors duration-300 hover:bg-background/75">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onMenuClick}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-white/[0.03] text-muted-foreground transition-all hover:scale-105 hover:border-primary hover:text-primary hover:shadow-[0_0_16px_rgba(255,42,140,0.2)]"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            {/* Logo - only on mobile where sidebar is hidden */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative">
                <Logo size={28} />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,42,140,0.8)]" />
              </div>
              <span className="text-lg font-bold tracking-tight">SavePoint</span>
            </Link>
          </div>

          {/* Desktop search trigger */}
          <button
            onClick={onSearchClick}
            className="hidden items-center gap-2 rounded-full border border-border/60 bg-white/[0.03] px-4 py-1.5 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:bg-white/[0.06] hover:text-foreground lg:flex"
          >
            <Search size={14} />
            <span className="text-muted-foreground/80">Search games...</span>
            <span className="ml-2 flex items-center gap-0.5 rounded border border-border/50 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              <Command size={10} />
              K
            </span>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/docs"
              className="hidden rounded-full border border-border/60 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-foreground/70 transition-all hover:border-primary/40 hover:bg-white/[0.06] hover:text-primary sm:flex"
            >
              Docs
            </Link>
            <Link
              href="/community"
              className="hidden rounded-full border border-border/60 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-foreground/70 transition-all hover:border-primary/40 hover:bg-white/[0.06] hover:text-primary sm:flex"
            >
              Community
            </Link>
            <button
              onClick={onSearchClick}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-white/[0.03] text-muted-foreground transition-all hover:scale-105 hover:border-primary hover:text-primary hover:shadow-[0_0_16px_rgba(255,42,140,0.2)] lg:hidden"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
            <SolanaConnectButton className="hidden !h-8 sm:flex" />
          </div>
        </div>
      </div>
    </header>
  );
}
