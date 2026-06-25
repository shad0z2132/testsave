"use client";

import { motion } from "framer-motion";
import { Check, Circle, Clock, Flame, HelpCircle } from "lucide-react";

export interface RoadmapPhase {
  phase: string;
  title: string;
  status: "completed" | "in-progress" | "upcoming";
  items: string[];
}

export const roadmapPhases: RoadmapPhase[] = [
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

const hiddenPhaseConfig = {
  border: "border-white/[0.12]",
  glow: "",
  dot: "bg-muted-foreground/30",
  badgeBg: "bg-white/[0.03]",
  badgeText: "text-muted-foreground",
  badgeIcon: HelpCircle,
  itemIcon: Circle,
  itemColor: "text-muted-foreground",
  label: "???",
};

const statusConfig = {
  completed: {
    border: "border-lime/30",
    glow: "shadow-[0_0_24px_rgba(204,255,0,0.08)]",
    dot: "bg-lime shadow-[0_0_12px_rgba(204,255,0,0.6)]",
    badgeBg: "bg-lime/10",
    badgeText: "text-lime",
    badgeIcon: Check,
    itemIcon: Check,
    itemColor: "text-lime",
    label: "Completed",
  },
  "in-progress": {
    border: "border-cyan-400/30",
    glow: "shadow-[0_0_24px_rgba(34,211,238,0.08)]",
    dot: "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]",
    badgeBg: "bg-cyan-400/10",
    badgeText: "text-cyan-400",
    badgeIcon: Flame,
    itemIcon: Circle,
    itemColor: "text-cyan-400",
    label: "In Progress",
  },
  upcoming: {
    border: "border-white/[0.12]",
    glow: "",
    dot: "bg-muted-foreground/40",
    badgeBg: "bg-white/[0.03]",
    badgeText: "text-muted-foreground",
    badgeIcon: Clock,
    itemIcon: Circle,
    itemColor: "text-muted-foreground",
    label: "Upcoming",
  },
};

interface RoadmapPhasesProps {
  revealedCount?: number;
  animate?: boolean;
}

export function RoadmapPhases({ revealedCount = 1, animate = true }: RoadmapPhasesProps) {
  return (
    <div className="space-y-4">
      {roadmapPhases.map((phase, index) => {
        const isRevealed = index < revealedCount;
        const config = isRevealed ? statusConfig[phase.status] : hiddenPhaseConfig;
        const BadgeIcon = config.badgeIcon;
        const ItemIcon = config.itemIcon;

        const card = (
          <div
            className={`relative overflow-hidden rounded-2xl border ${config.border} ${isRevealed ? "bg-[#0a0a0a]" : "bg-black/20"} p-5 backdrop-blur-sm transition-all hover:bg-[#0a0a0a]/80 ${config.glow}`}
          >
            {/* Lime/cyan top accent line for revealed phases */}
            {isRevealed && (
              <div
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${phase.status === "completed" ? "via-lime/50" : "via-cyan-400/50"} to-transparent`}
              />
            )}

            {/* Status dot */}
            <div className={`absolute left-4 top-5 h-2.5 w-2.5 rounded-full ${config.dot}`} />

            <div className={`pl-6 ${isRevealed ? "" : "blur-[5px] select-none"}`}>
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

            {!isRevealed && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/10 backdrop-blur-[1px]">
                <HelpCircle size={32} className="text-lime drop-shadow-[0_0_12px_rgba(204,255,0,0.5)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/80">
                  Coming soon
                </span>
              </div>
            )}
          </div>
        );

        if (!animate) {
          return <div key={phase.phase}>{card}</div>;
        }

        return (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {card}
          </motion.div>
        );
      })}
    </div>
  );
}
