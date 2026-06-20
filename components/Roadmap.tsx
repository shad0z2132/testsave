"use client";

import { motion } from "framer-motion";
import { Check, CircleDot, Clock, Rocket, Flame } from "lucide-react";

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
    icon: Check,
    label: "Completed",
    color: "text-positive",
    bg: "bg-positive/10",
    border: "border-positive/30",
    dot: "bg-positive",
  },
  "in-progress": {
    icon: Flame,
    label: "In Progress",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    dot: "bg-primary",
  },
  upcoming: {
    icon: Clock,
    label: "Upcoming",
    color: "text-foreground/60",
    bg: "bg-white/[0.03]",
    border: "border-border/40",
    dot: "bg-foreground/30",
  },
};

export function Roadmap() {
  return (
    <section className="relative py-14">
      {/* Top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Rocket size={14} />
            Building in public
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Development Roadmap
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/60">
            SavePoint is evolving from a game aggregator into a full-stack discovery and trading platform for Solana gaming.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40 sm:left-1/2 sm:-translate-x-px" />

          <div className="space-y-8">
            {phases.map((phase, index) => {
              const config = statusConfig[phase.status];
              const StatusIcon = config.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative flex flex-col gap-4 sm:flex-row ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Center dot */}
                  <div className="absolute left-4 top-6 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center sm:left-1/2">
                    <span
                      className={`h-3 w-3 rounded-full ${config.dot} shadow-[0_0_12px_currentColor]`}
                    />
                  </div>

                  {/* Spacer for desktop layout */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Card */}
                  <div className="pl-10 sm:w-1/2 sm:pl-0 sm:pr-0">
                    <div
                      className={`rounded-xl border ${config.border} ${config.bg} p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-white/[0.03]`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">
                            {phase.phase}
                          </p>
                          <h3 className="text-lg font-bold text-foreground">{phase.title}</h3>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${config.border} ${config.color}`}
                        >
                          <StatusIcon size={10} />
                          {config.label}
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {phase.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-foreground/70"
                          >
                            <CircleDot
                              size={10}
                              className={`mt-1 shrink-0 ${config.color}`}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
