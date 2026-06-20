"use client";

import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Check, Circle, Clock, Flame, Rocket } from "lucide-react";

interface RoadmapSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RoadmapPhase {
  phase: string;
  title: string;
  status: "completed" | "in-progress" | "upcoming";
  items: string[];
}

const phases: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    title: "Launchpad",
    status: "completed",
    items: [
      "Solana game aggregator",
      "DexScreener live token feed",
      "Trending & featured games",
      "Real-time price & market data",
    ],
  },
  {
    phase: "Phase 2",
    title: "Discovery Engine",
    status: "in-progress",
    items: [
      "Advanced filters & search",
      "Saved watchlists",
      "Safety scoring v2",
      "Game detail analytics",
    ],
  },
  {
    phase: "Phase 3",
    title: "Trading Layer",
    status: "upcoming",
    items: [
      "Wallet connection",
      "In-app token swaps",
      "Portfolio tracking",
      "Price alerts & notifications",
    ],
  },
  {
    phase: "Phase 4",
    title: "Community DAO",
    status: "upcoming",
    items: [
      "User reviews & ratings",
      "Community voting",
      "Reward points & badges",
      "Governance token",
    ],
  },
];

const statusConfig = {
  completed: {
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_24px_rgba(16,185,129,0.08)]",
    dot: "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-400",
    badgeIcon: Check,
    itemIcon: Check,
    itemColor: "text-emerald-400",
    label: "Completed",
  },
  "in-progress": {
    border: "border-primary/30",
    glow: "shadow-[0_0_24px_rgba(255,42,140,0.08)]",
    dot: "bg-primary shadow-[0_0_12px_rgba(255,42,140,0.6)]",
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
    badgeIcon: Flame,
    itemIcon: Circle,
    itemColor: "text-primary",
    label: "In Progress",
  },
  upcoming: {
    border: "border-border/60",
    glow: "",
    dot: "bg-muted-foreground/40",
    badgeBg: "bg-secondary",
    badgeText: "text-muted-foreground",
    badgeIcon: Clock,
    itemIcon: Circle,
    itemColor: "text-muted-foreground",
    label: "Upcoming",
  },
};

export function RoadmapSheet({ open, onOpenChange }: RoadmapSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full border-border bg-card p-0 sm:max-w-lg overflow-y-auto">
        <div className="p-6">
          <SheetHeader className="p-0 mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              <Rocket size={14} />
              Building in public
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <SheetTitle className="text-2xl font-bold">Development Roadmap</SheetTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <SheetDescription className="text-sm text-muted-foreground">
                SavePoint is evolving from a game aggregator into a full-stack discovery and trading platform for Solana gaming.
              </SheetDescription>
            </motion.div>
          </SheetHeader>

          <div className="space-y-4">
            {phases.map((phase, index) => {
              const config = statusConfig[phase.status];
              const BadgeIcon = config.badgeIcon;
              const ItemIcon = config.itemIcon;

              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative overflow-hidden rounded-2xl border ${config.border} bg-card/30 p-5 backdrop-blur-sm transition-all hover:bg-card/50 ${config.glow}`}
                >
                  {/* Status dot */}
                  <div className={`absolute left-4 top-5 h-2.5 w-2.5 rounded-full ${config.dot}`} />

                  <div className="pl-6">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {phase.phase}
                        </p>
                        <h3 className="text-xl font-bold text-foreground">{phase.title}</h3>
                      </div>
                      <span
                        className={`mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${config.badgeBg} ${config.badgeText}`}
                      >
                        <BadgeIcon size={12} />
                        {config.label}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {phase.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-foreground/70">
                          <ItemIcon size={14} className={`mt-0.5 shrink-0 ${config.itemColor}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
