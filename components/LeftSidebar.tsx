"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Logo } from "./Logo";
import { RoadmapSheet } from "./RoadmapSheet";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { games } from "@/data/games";
import { Game } from "@/types/game";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSavedGames } from "@/hooks/useSavedGames";
import {
  Compass,
  Flame,
  Sparkles,
  Bookmark,
  TrendingUp,
  Zap,
  Sunrise,
  Radio,
  BarChart3,
  Gamepad2,
  Swords,
  Car,
  Puzzle,
  Sprout,
  Clock,
  Rocket,
  CircleDot,
  Plus,
  ChevronDown,
  X,
  Check,
  BookOpen,
  Users,
} from "lucide-react";

interface LeftSidebarProps {
  activeTab: string;
  activeFilter: string;
  onTabChange: (tab: string) => void;
  onFilterChange: (filter: string) => void;
  allGames?: Game[];
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

const navItems = [
  { id: "discover", label: "Discover", icon: Compass },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "new", label: "New", icon: Sparkles },
  { id: "saved", label: "Saved", icon: Bookmark },
];

const trendingCategories = [
  { id: "Movers", label: "Movers", icon: TrendingUp },
  { id: "Mayhem", label: "Mayhem", icon: Zap },
  { id: "New", label: "New", icon: Sunrise },
  { id: "Live", label: "Live", icon: Radio },
  { id: "Market Cap", label: "Market Cap", icon: BarChart3 },
];

const statuses = [
  { id: "Live", label: "Live", icon: CircleDot, color: "text-emerald-400" },
  { id: "Beta", label: "Beta", icon: Rocket, color: "text-primary" },
  { id: "Upcoming", label: "Upcoming", icon: Clock, color: "text-positive" },
];

const genres = [
  { id: "RPG", label: "RPG", icon: Gamepad2 },
  { id: "Strategy", label: "Strategy", icon: Swords },
  { id: "Action", label: "Action", icon: Zap },
  { id: "Arcade", label: "Arcade", icon: Car },
  { id: "Simulation", label: "Simulation", icon: Puzzle },
  { id: "Idle", label: "Idle", icon: Sprout },
];

const roadmap = [
  { phase: "P1", title: "Launchpad", status: "completed" as const, icon: Check },
  { phase: "P2", title: "Discovery", status: "in-progress" as const, icon: Flame },
  { phase: "P3", title: "Trading", status: "upcoming" as const, icon: Clock },
  { phase: "P4", title: "Community", status: "upcoming" as const, icon: Clock },
];

const roadmapStatus = {
  completed: { color: "text-positive", bg: "bg-positive/10", border: "border-positive/30", dot: "bg-positive" },
  "in-progress": { color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", dot: "bg-primary" },
  upcoming: { color: "text-foreground/50", bg: "bg-white/[0.03]", border: "border-border/40", dot: "bg-foreground/30" },
};

function SidebarItem({
  active,
  onClick,
  href,
  icon: Icon,
  label,
  count,
  iconColor,
}: {
  active?: boolean;
  onClick?: () => void;
  href?: string;
  icon: React.ElementType;
  label: string;
  count?: number;
  iconColor?: string;
}) {
  const content = (
    <>
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_rgba(255,42,140,0.9)]" />
      )}
      <Icon
        size={16}
        className={cn(
          "transition-colors",
          active ? "text-primary" : iconColor || "text-muted-foreground group-hover:text-foreground"
        )}
      />
      <span className="relative z-10 flex-1">{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "font-mono text-[11px] tabular-nums",
            active ? "text-primary/90" : "text-foreground/50"
          )}
        >
          {count}
        </span>
      )}
    </>
  );

  const className = cn(
    "group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[14px] transition-all duration-200",
    active
      ? "bg-primary/15 font-medium text-foreground shadow-[0_0_16px_rgba(255,42,140,0.12)]"
      : "text-foreground/70 hover:bg-white/[0.05] hover:text-foreground"
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function SidebarSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors hover:bg-white/[0.03]"
      >
        <h3 className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/60">
          <span className="h-1 w-1 rounded-full bg-primary/70 group-hover:bg-primary" />
          {title}
        </h3>
        <ChevronDown
          size={10}
          className={cn(
            "text-foreground/50 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col gap-0.5 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SidebarContentProps {
  activeTab: string;
  activeFilter: string;
  onTabChange: (tab: string) => void;
  onFilterChange: (filter: string) => void;
  allGames?: Game[];
  isMobile?: boolean;
  onNavigate?: () => void;
}

function SidebarContent({
  activeTab,
  activeFilter,
  onTabChange,
  onFilterChange,
  allGames = games,
  isMobile,
  onNavigate,
}: SidebarContentProps) {
  const router = useRouter();
  const isHome = router.pathname === "/";
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const { savedIds } = useSavedGames();

  const getCount = (filter: string) => {
    if (filter === "Saved") return savedIds.length;
    if (filter === "All") return allGames.length;
    const lower = filter.toLowerCase();
    return allGames.filter(
      (g) =>
        g.genre.toLowerCase() === lower ||
        g.status.toLowerCase() === lower ||
        g.tags.some((tag) => tag.toLowerCase() === lower)
    ).length;
  };

  const activeSection =
    activeFilter !== "All" ? activeFilter : activeTab !== "discover" ? activeTab : null;

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    onFilterChange("All");
    onNavigate?.();
  };

  const handleFilterClick = (filter: string) => {
    onFilterChange(filter);
    onNavigate?.();
  };

  return (
    <>
      {!isMobile && (
        <>
          {/* Logo */}
          <Link
            href="/"
            className="flex h-14 items-center gap-2.5 border-b border-border/40 px-3 transition-colors hover:opacity-90"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Logo size={22} />
              <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,42,140,0.9)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight leading-none">SavePoint</span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-foreground/50">
                Solana Games
              </span>
            </div>
          </Link>

          {/* Project tagline */}
          <div className="px-3 py-3">
            <div className="rounded-lg border border-border/40 bg-white/[0.03] p-2.5">
              <p className="text-[11px] font-medium leading-relaxed text-foreground">
                Your checkpoint for safe Solana games.
              </p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-primary/80">
                Play safe on Solana.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Active filter chip */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-2 mt-2"
          >
            <button
              onClick={() => handleTabClick("discover")}
              className="flex w-full items-center justify-between rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-left text-xs font-medium text-primary transition-all hover:border-primary/30 hover:bg-primary/15"
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(255,42,140,0.8)]" />
                {activeSection}
              </span>
              <X size={10} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-hide">
        <SidebarSection title="Platform" defaultOpen>
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              active={isHome && activeTab === item.id && activeFilter === "All"}
              onClick={
                isHome
                  ? () => handleTabClick(item.id)
                  : undefined
              }
              href={
                !isHome
                  ? item.id === "discover"
                    ? "/"
                    : `/?tab=${item.id}`
                  : undefined
              }
              icon={item.icon}
              label={item.label}
            />
          ))}
        </SidebarSection>

        <div className="my-2 h-px bg-border/40" />

        <SidebarSection title="Explore" defaultOpen>
          {trendingCategories.map((cat) => (
            <SidebarItem
              key={cat.id}
              active={activeFilter === cat.id}
              onClick={() => handleFilterClick(cat.id)}
              icon={cat.icon}
              label={cat.label}
              count={getCount(cat.id)}
            />
          ))}
        </SidebarSection>

        <div className="my-2 h-px bg-border/40" />

        <SidebarSection title="Status" defaultOpen>
          {statuses.map((status) => (
            <SidebarItem
              key={status.id}
              active={activeFilter === status.id}
              onClick={() => handleFilterClick(status.id)}
              icon={status.icon}
              label={status.label}
              count={getCount(status.id)}
              iconColor={status.color}
            />
          ))}
        </SidebarSection>

        <div className="my-2 h-px bg-border/40" />

        <SidebarSection title="Genres" defaultOpen>
          {genres.map((genre) => (
            <SidebarItem
              key={genre.id}
              active={activeFilter === genre.id}
              onClick={() => handleFilterClick(genre.id)}
              icon={genre.icon}
              label={genre.label}
              count={getCount(genre.id)}
            />
          ))}
        </SidebarSection>

        <div className="my-2 h-px bg-border/40" />

        <SidebarSection title="Resources" defaultOpen>
          <Link
            href="/docs"
            onClick={onNavigate}
            className="group relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[14px] text-foreground/70 transition-all duration-200 hover:bg-white/[0.04] hover:text-foreground"
          >
            <BookOpen size={16} className="text-muted-foreground transition-colors group-hover:text-foreground" />
            <span>Docs</span>
          </Link>
          <Link
            href="/community"
            onClick={onNavigate}
            className="group relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[14px] text-foreground/70 transition-all duration-200 hover:bg-white/[0.04] hover:text-foreground"
          >
            <Users size={16} className="text-muted-foreground transition-colors group-hover:text-foreground" />
            <span>Community</span>
          </Link>
          <Link
            href="/submit"
            onClick={onNavigate}
            className="group relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[14px] text-foreground/70 transition-all duration-200 hover:bg-white/[0.04] hover:text-foreground"
          >
            <Plus size={16} className="text-muted-foreground transition-colors group-hover:text-foreground" />
            <span>Submit Game</span>
          </Link>
        </SidebarSection>
      </div>

      {/* Roadmap */}
      <button
        onClick={() => setRoadmapOpen(true)}
        className="group mx-2 mb-2 w-[calc(100%-1rem)] rounded-xl border border-border/40 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-2.5 text-left transition-all hover:border-primary/30 hover:shadow-[0_0_20px_rgba(255,42,140,0.1)]"
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Rocket size={13} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/90">
              Roadmap
            </span>
          </div>
          <span className="text-[9px] font-medium text-primary transition-colors group-hover:text-primary-foreground">
            View all
          </span>
        </div>
        <div className="space-y-1.5">
          {roadmap.map((item) => {
            const config = roadmapStatus[item.status];
            const Icon = item.icon;
            return (
              <div
                key={item.phase}
                className={`flex items-center justify-between rounded-md border ${config.border} ${config.bg} px-2 py-1.5`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${config.dot} shadow-[0_0_6px_currentColor]`} />
                  <span className="text-xs font-medium text-foreground">{item.title}</span>
                </div>
                <Icon size={11} className={config.color} />
              </div>
            );
          })}
        </div>
      </button>

      <RoadmapSheet open={roadmapOpen} onOpenChange={setRoadmapOpen} />

      {/* Bottom actions */}
      <div className="relative border-t border-border/40 bg-white/[0.02] p-2.5">
        <Link
          href="/submit"
          onClick={onNavigate}
          className="group relative mb-2 flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-[0_0_16px_rgba(255,42,140,0.25)] transition-all hover:shadow-[0_0_24px_rgba(255,42,140,0.4)] hover:bg-primary/90 active:scale-[0.98]"
        >
          <Plus size={15} />
          <span>Submit Game</span>
        </Link>
        <WalletMultiButton className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-white/[0.03] py-2 text-xs font-medium text-foreground transition-all hover:!border-primary hover:!bg-white/[0.06] hover:!text-primary active:scale-[0.98] wallet-adapter-button-trigger" />
      </div>
    </>
  );
}

export function LeftSidebar(props: LeftSidebarProps) {
  const { mobileOpen, onMobileOpenChange } = props;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-56 flex-col border-r border-border/40 bg-[#050505]/95 backdrop-blur-xl lg:flex">
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-primary/20 via-border/30 to-transparent" />
        <SidebarContent {...props} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[280px] border-r border-border/40 bg-[#050505] p-0 sm:w-[300px]"
        >
          <SheetHeader className="border-b border-border/40 px-3 py-3">
            <SheetTitle className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <Logo size={20} />
                <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,42,140,0.9)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight leading-none">SavePoint</span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-foreground/50">
                  Solana Games
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="flex h-[calc(100%-4rem)] flex-col overflow-hidden">
            <SidebarContent
              {...props}
              isMobile
              onNavigate={() => onMobileOpenChange?.(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
