"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Target,
  Lightbulb,
  Layers,
  Coins,
  Map,
  Shield,
  Users,
  Globe,
  Search,
  Filter,
  TrendingUp,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  MessageSquare,
  Vote,
  Award,
  Zap,
  Check,
  Flame,
  Clock,
  Circle,
  CircleDot,
} from "lucide-react";

const sections = [
  { id: "abstract", title: "Abstract", icon: BookOpen },
  { id: "problem", title: "The Problem", icon: Target },
  { id: "solution", title: "Solution", icon: Lightbulb },
  { id: "platform", title: "Architecture", icon: Layers },
  { id: "tokenomics", title: "Tokenomics", icon: Coins },
  { id: "roadmap", title: "Roadmap", icon: Map },
  { id: "safety", title: "Safety", icon: Shield },
  { id: "community", title: "Community", icon: Users },
  { id: "conclusion", title: "Conclusion", icon: Globe },
];

const problems = [
  {
    icon: Search,
    title: "Information Overload",
    desc: "Dozens of gaming tokens launch daily. Most have no real product.",
  },
  {
    icon: AlertTriangle,
    title: "Weak Trust Signals",
    desc: "Hype replaces verification. Teams, contracts, and demos go unchecked.",
  },
  {
    icon: Layers,
    title: "Fragmented Research",
    desc: "Game data is split across DexScreener, Twitter, Discord, and docs.",
  },
  {
    icon: TrendingUp,
    title: "Poor Discoverability",
    desc: "Quality indie games drown in well-funded marketing noise.",
  },
];

const pillars = [
  {
    icon: Filter,
    title: "Curate",
    desc: "Every listing is verified for website, socials, and playable progress.",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: TrendingUp,
    title: "Inform",
    desc: "Live price, volume, market cap, and holder data from DexScreener.",
    color: "from-cyan-500/20 to-cyan-500/5",
  },
  {
    icon: Zap,
    title: "Empower",
    desc: "Save, track, and eventually trade gaming tokens in one interface.",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
];

const tokenomics = [
  { label: "Community & Rewards", value: 40, color: "bg-primary" },
  { label: "Liquidity & Market Making", value: 20, color: "bg-cyan-400" },
  { label: "Team & Advisors", value: 20, color: "bg-emerald-400" },
  { label: "Ecosystem Grants", value: 15, color: "bg-amber-400" },
  { label: "Treasury & Operations", value: 5, color: "bg-muted-foreground" },
];

const roadmap = [
  {
    phase: "Phase 1",
    title: "Launchpad",
    status: "completed",
    items: ["Solana game aggregator", "DexScreener live token feed", "Trending & featured games", "Real-time price & market data"],
  },
  {
    phase: "Phase 2",
    title: "Discovery Engine",
    status: "in-progress",
    items: ["Advanced filters & search", "Saved watchlists", "Safety scoring v2", "Game detail analytics"],
  },
  {
    phase: "Phase 3",
    title: "Trading Layer",
    status: "upcoming",
    items: ["Wallet connection", "In-app token swaps", "Portfolio tracking", "Price alerts & notifications"],
  },
  {
    phase: "Phase 4",
    title: "Community DAO",
    status: "upcoming",
    items: ["User reviews & ratings", "Community voting", "Reward points & badges", "Governance token"],
  },
];

const safetyMetrics = [
  { icon: Users, label: "Identity", desc: "Public team & verified socials" },
  { icon: Lock, label: "Contract", desc: "Verified mint & liquidity checks" },
  { icon: CheckCircle2, label: "Product", desc: "Playable build or demo" },
  { icon: MessageSquare, label: "Community", desc: "Organic engagement" },
];

const governanceItems = [
  { icon: Vote, title: "Listing Standards", desc: "Vote on verification rules" },
  { icon: Award, title: "Featured Slots", desc: "Decide promotional placements" },
  { icon: Coins, title: "Reward Allocation", desc: "Reward curators & contributors" },
  { icon: Layers, title: "Fee Structure", desc: "Set platform & treasury fees" },
];

export default function Whitepaper() {
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 z-0 bg-noise" />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to SavePoint</span>
            </Link>

            <div className="flex items-center gap-2">
              <Logo size={26} />
              <span className="text-base font-bold tracking-tight">SavePoint Whitepaper</span>
            </div>

            <div className="w-20 sm:w-32" />
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Contents
                  </p>
                  <nav className="border-l border-border/40">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={`group relative flex items-center gap-3 py-2 pl-4 text-sm transition-colors ${
                          activeSection === section.id
                            ? "text-primary"
                            : "text-foreground/60 hover:text-foreground"
                        }`}
                      >
                        {activeSection === section.id && (
                          <motion.span
                            layoutId="activeWhitepaperSection"
                            className="absolute left-[-1px] top-0 h-full w-[2px] bg-primary"
                          />
                        )}
                        <section.icon size={16} />
                        <span className="font-medium">{section.title}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main>
              {/* Hero */}
              <div className="mb-12 border-b border-border/40 pb-12">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                  <BookOpen size={12} />
                  v1.0 · June 2026
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                  SavePoint
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  Your checkpoint for Solana games.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                  Play safe on Solana.
                </div>
                <p className="mt-6 max-w-3xl text-sm leading-relaxed text-foreground/60">
                  A curated discovery layer that helps traders and gamers find legitimate
                  Solana games while filtering out rugs, vaporware, and marketing noise.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <HeroStat value="100+" label="Games tracked" />
                  <HeroStat value="Live" label="Market data" />
                  <HeroStat value="4" label="Phases" />
                  <HeroStat value="Solana" label="Ecosystem" />
                </div>
              </div>

              {/* Mobile TOC */}
              <div className="mb-12 rounded-xl border border-border/40 bg-card/30 p-4 lg:hidden">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Jump to section
                </p>
                <nav className="grid grid-cols-2 gap-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-foreground/70 transition-colors hover:bg-white/[0.03] hover:text-foreground"
                    >
                      <section.icon size={14} />
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="space-y-20">
                {/* Abstract */}
                <section id="abstract" className="scroll-mt-28">
                  <SectionHeader icon={BookOpen} title="Abstract" number="01" />
                  <div className="max-w-3xl space-y-4 text-sm leading-7 text-foreground/70">
                    <p>
                      Gaming and blockchain can redefine ownership and player economies. But
                      today, most users face a chaotic mix of anonymous teams, unfinished
                      products, and tokens with more marketing than substance.
                    </p>
                    <p>
                      SavePoint fixes this by combining curated game profiles, live market
                      data, and community-verified safety signals into one clean interface.
                    </p>
                  </div>
                </section>

                {/* Problem */}
                <section id="problem" className="scroll-mt-28">
                  <SectionHeader icon={Target} title="The Problem" number="02" />
                  <p className="mb-6 max-w-3xl text-sm leading-7 text-foreground/70">
                    Web3 gaming discovery is broken. Existing tools are either pure token
                    trackers with no gameplay context, or static directories without market
                    data or trust signals.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {problems.map((problem) => (
                      <div
                        key={problem.title}
                        className="rounded-xl border border-border/40 bg-card/30 p-5 transition-all hover:border-primary/30 hover:bg-card/50"
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <problem.icon size={20} />
                        </div>
                        <h3 className="mb-1 font-bold text-foreground">{problem.title}</h3>
                        <p className="text-sm leading-relaxed text-foreground/60">
                          {problem.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Solution */}
                <section id="solution" className="scroll-mt-28">
                  <SectionHeader icon={Lightbulb} title="The SavePoint Solution" number="03" />
                  <p className="mb-6 max-w-3xl text-sm leading-7 text-foreground/70">
                    SavePoint consolidates research into one checkpoint. Three pillars drive
                    the experience:
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    {pillars.map((pillar) => (
                      <div
                        key={pillar.title}
                        className={`relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br ${pillar.color} p-5`}
                      >
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-black/20 text-primary">
                          <pillar.icon size={22} />
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-foreground">
                          {pillar.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground/70">
                          {pillar.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Architecture */}
                <section id="platform" className="scroll-mt-28">
                  <SectionHeader icon={Layers} title="Platform Architecture" number="04" />
                  <p className="mb-6 max-w-3xl text-sm leading-7 text-foreground/70">
                    SavePoint merges a curated dataset with live DexScreener market data,
                    then presents it through a fast, responsive interface.
                  </p>

                  <div className="rounded-xl border border-border/40 bg-card/30 p-6">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                      <ArchitectureBox
                        icon={Database}
                        title="Curated Dataset"
                        desc="Verified game profiles, media, links"
                      />
                      <ArrowRight className="hidden text-primary/40 md:block" size={24} />
                      <div className="flex rotate-90 md:rotate-0">
                        <ArrowRight className="text-primary/40 md:hidden" size={24} />
                      </div>
                      <ArchitectureBox
                        icon={Layers}
                        title="DexScreener API"
                        desc="Live price, volume, market cap"
                      />
                      <ArrowRight className="hidden text-primary/40 md:block" size={24} />
                      <div className="flex rotate-90 md:rotate-0">
                        <ArrowRight className="text-primary/40 md:hidden" size={24} />
                      </div>
                      <ArchitectureBox
                        icon={Globe}
                        title="SavePoint App"
                        desc="Search, filters, watchlist, detail"
                      />
                    </div>
                  </div>
                </section>

                {/* Tokenomics */}
                <section id="tokenomics" className="scroll-mt-28">
                  <SectionHeader icon={Coins} title="Tokenomics" number="05" />
                  <p className="mb-6 max-w-3xl text-sm leading-7 text-foreground/70">
                    A proposed community-first token model. Allocation and utility are
                    subject to governance before any launch.
                  </p>

                  <div className="rounded-xl border border-border/40 bg-card/30 p-6">
                    <div className="space-y-4">
                      {tokenomics.map((item) => (
                        <div key={item.label}>
                          <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="text-foreground/80">{item.label}</span>
                            <span className="font-bold text-foreground">{item.value}%</span>
                          </div>
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.value}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full ${item.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/40 pt-6 sm:grid-cols-4">
                      <UtilityItem label="Governance" />
                      <UtilityItem label="Featured slots" />
                      <UtilityItem label="Premium data" />
                      <UtilityItem label="Fee sharing" />
                    </div>
                  </div>
                </section>

                {/* Roadmap */}
                <section id="roadmap" className="scroll-mt-28">
                  <SectionHeader icon={Map} title="Development Roadmap" number="06" />
                  <p className="mb-8 max-w-3xl text-sm leading-7 text-foreground/70">
                    SavePoint is evolving from a game aggregator into a full-stack discovery
                    and trading platform for Solana gaming.
                  </p>

                  <div className="space-y-4">
                    {roadmap.map((phase, index) => (
                      <RoadmapCard key={phase.phase} phase={phase} index={index} />
                    ))}
                  </div>
                </section>

                {/* Safety */}
                <section id="safety" className="scroll-mt-28">
                  <SectionHeader icon={Shield} title="Safety & Trust" number="07" />
                  <p className="mb-6 max-w-3xl text-sm leading-7 text-foreground/70">
                    Each game gets a safety score based on four transparent criteria. Scores
                    are filters, not investment advice.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {safetyMetrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="flex items-start gap-4 rounded-xl border border-border/40 bg-card/30 p-5"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <metric.icon size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{metric.label}</h3>
                          <p className="text-sm text-foreground/60">{metric.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Community */}
                <section id="community" className="scroll-mt-28">
                  <SectionHeader icon={Users} title="Community & Governance" number="08" />
                  <p className="mb-6 max-w-3xl text-sm leading-7 text-foreground/70">
                    SavePoint will progressively decentralize. Token holders and active
                    contributors vote on key platform decisions.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {governanceItems.map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center gap-4 rounded-xl border border-border/40 bg-card/30 p-4 transition-all hover:border-primary/30"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{item.title}</h3>
                          <p className="text-sm text-foreground/60">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Conclusion */}
                <section id="conclusion" className="scroll-mt-28">
                  <SectionHeader icon={Globe} title="Conclusion" number="09" />
                  <div className="max-w-3xl space-y-4 text-sm leading-7 text-foreground/70">
                    <p>
                      SavePoint aims to become the default discovery layer for Solana
                      gaming — where legitimate projects gain visibility, traders get
                      reliable signals, and gamers find their next on-chain experience.
                    </p>
                    <p>
                      By combining curation, live data, and community governance, SavePoint
                      solves the core problem holding back web3 gaming: trust.
                    </p>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_24px_rgba(255,42,140,0.35)]"
                    >
                      Explore SavePoint
                    </Link>
                    <a
                      href="https://x.com/savepoint"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary"
                    >
                      Follow on X
                    </a>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  number,
}: {
  icon: React.ElementType;
  title: string;
  number: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3 border-b border-border/40 pb-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Section {number}
        </p>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
      </div>
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/30 p-4 text-center lg:text-left">
      <p className="text-xl font-bold text-primary sm:text-2xl">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ArchitectureBox({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="w-full rounded-xl border border-border/40 bg-card/50 p-4 text-center md:w-52">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary md:mx-0 md:mb-3">
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="text-xs text-foreground/60">{desc}</p>
    </div>
  );
}

function UtilityItem({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-secondary/50 px-3 py-2 text-center">
      <p className="text-xs font-medium text-foreground/80">{label}</p>
    </div>
  );
}

function RoadmapCard({
  phase,
  index,
}: {
  phase: { phase: string; title: string; status: string; items: string[] };
  index: number;
}) {
  const upcomingStyles = {
    border: "border-border/60",
    glow: "",
    dot: "bg-muted-foreground/40",
    badgeBg: "bg-secondary",
    badgeText: "text-muted-foreground",
    badgeIcon: Clock,
    itemIcon: Circle,
    itemColor: "text-muted-foreground",
    label: "Upcoming",
  };

  const styles =
    {
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
      upcoming: upcomingStyles,
    }[phase.status] || upcomingStyles;

  const BadgeIcon = styles.badgeIcon;
  const ItemIcon = styles.itemIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-2xl border ${styles.border} bg-card/30 p-5 backdrop-blur-sm transition-all hover:bg-card/50 ${styles.glow}`}
    >
      {/* Status dot */}
      <div className={`absolute left-4 top-5 h-2.5 w-2.5 rounded-full ${styles.dot}`} />

      <div className="pl-6">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {phase.phase}
            </p>
            <h3 className="text-xl font-bold text-foreground">{phase.title}</h3>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${styles.badgeBg} ${styles.badgeText}`}
          >
            <BadgeIcon size={12} />
            {styles.label}
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {phase.items.map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-sm text-foreground/70">
              <ItemIcon size={14} className={`shrink-0 ${styles.itemColor}`} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
