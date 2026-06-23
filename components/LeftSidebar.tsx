"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import { RoadmapSheet } from "./RoadmapSheet";
import { Tooltip } from "@/components/ui/tooltip";
import { games } from "@/data/games";
import { Game } from "@/types/game";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
  Wallet,
  ChevronDown,
  X,
  Check,
} from "lucide-react";

interface LeftSidebarProps {
  activeTab: string;
  activeFilter: string;
  onTabChange: (tab: string) => void;
  onFilterChange: (filter: string) => void;
  onConnect: () => void;
  allGames?: Game[];
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

function SidebarButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  iconColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  count?: number;
  iconColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[14px] transition-all duration-200",
        active
          ? "bg-primary/15 font-medium text-foreground"
          : "text-foreground/70 hover:bg-white/[0.04] hover:text-foreground"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,42,140,0.8)]" />
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
        className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors hover:bg-white/[0.03] hover:text-foreground"
      >
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground/70">
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

export function LeftSidebar({
  activeTab,
  activeFilter,
  onTabChange,
  onFilterChange,
  onConnect,
  allGames = games,
}: LeftSidebarProps) {
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const getCount = (filter: string) => {
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

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-56 flex-col border-r border-border/40 bg-background/80 backdrop-blur-xl lg:flex">
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />

      {/* Logo */}
      <div className="flex h-12 items-center gap-2 border-b border-border/40 px-3">
        <div className="relative">
          <Logo size={24} />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(255,42,140,0.8)]" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight leading-none">SavePoint</span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-foreground/50">
            Solana Games
          </span>
        </div>
      </div>

      {/* Project tagline */}
      <div className="px-3 py-2.5">
        <p className="text-[11px] font-medium leading-relaxed text-foreground">
          Your checkpoint for safe Solana games.
        </p>
        <p className="mt-0.5 text-[10px] leading-relaxed text-primary/80">
          Play safe on Solana.
        </p>
      </div>

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
              onClick={() => {
                onTabChange("discover");
                onFilterChange("All");
              }}
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
            <SidebarButton
              key={item.id}
              active={activeTab === item.id && activeFilter === "All"}
              onClick={() => {
                onTabChange(item.id);
                onFilterChange("All");
              }}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </SidebarSection>

        <div className="my-2 h-px bg-border/40" />

        <SidebarSection title="Explore" defaultOpen>
          {trendingCategories.map((cat) => (
            <SidebarButton
              key={cat.id}
              active={activeFilter === cat.id}
              onClick={() => onFilterChange(cat.id)}
              icon={cat.icon}
              label={cat.label}
              count={getCount(cat.id)}
            />
          ))}
        </SidebarSection>

        <div className="my-2 h-px bg-border/40" />

        <SidebarSection title="Status" defaultOpen>
          {statuses.map((status) => (
            <SidebarButton
              key={status.id}
              active={activeFilter === status.id}
              onClick={() => onFilterChange(status.id)}
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
            <SidebarButton
              key={genre.id}
              active={activeFilter === genre.id}
              onClick={() => onFilterChange(genre.id)}
              icon={genre.icon}
              label={genre.label}
              count={getCount(genre.id)}
            />
          ))}
        </SidebarSection>
      </div>

      {/* Roadmap */}
      <button
        onClick={() => setRoadmapOpen(true)}
        className="mx-2 mb-2 w-[calc(100%-1rem)] rounded-lg border border-border/40 bg-white/[0.02] p-2.5 text-left transition-all hover:border-primary/30 hover:bg-white/[0.04]"
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket size={14} className="text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/80">
              Roadmap
            </span>
          </div>
          <span className="text-[9px] text-primary">View all</span>
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
      <div className="relative border-t border-border/40 bg-white/[0.02] p-2">
        <Tooltip content="Game submissions are coming soon." side="right">
          <button
            disabled
            className="group relative mb-1.5 flex w-full cursor-not-allowed items-center justify-center gap-1.5 overflow-hidden rounded-md bg-primary/50 py-2 text-xs font-semibold text-primary-foreground/70 transition-all active:scale-[0.98]"
          >
            <Plus size={14} />
            <span>Submit Game</span>
            <span className="ml-1 rounded-full bg-black/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground/80">
              Soon
            </span>
          </button>
        </Tooltip>
        <Tooltip content="Wallet connection is coming soon (Phase 3)." side="right">
          <button
            onClick={onConnect}
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border/60 bg-white/[0.03] py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary hover:bg-white/[0.06] hover:text-primary active:scale-[0.98]"
          >
            <Wallet size={14} />
            <span>Connect Wallet</span>
            <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
              Soon
            </span>
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
