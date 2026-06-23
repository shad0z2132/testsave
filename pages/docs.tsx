"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Shield,
  Search,
  Filter,
  Database,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Users,
  Rocket,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

const sections = [
  { id: "overview", title: "Overview", icon: BookOpen },
  { id: "safety", title: "Safety Score", icon: Shield },
  { id: "curation", title: "Curation", icon: Filter },
  { id: "how-to", title: "How to Use", icon: Search },
  { id: "roadmap", title: "Roadmap", icon: Rocket },
  { id: "faq", title: "FAQ", icon: HelpCircle },
];

const safetyChecks = [
  { icon: Lock, label: "Mint authority revoked", desc: "No one can mint new tokens and inflate supply." },
  { icon: Lock, label: "Freeze authority revoked", desc: "No one can freeze user wallets." },
  { icon: Users, label: "Holder distribution", desc: "Top holders don't control too much supply." },
  { icon: Database, label: "Token age & liquidity", desc: "Older tokens with real liquidity are safer." },
  { icon: Globe, label: "Website & socials", desc: "Real projects have verifiable online presence." },
  { icon: CheckCircle2, label: "Curated game metadata", desc: "Whitelist games are manually reviewed." },
];

const roadmap = [
  { phase: "Phase 1", title: "Launchpad", status: "completed", items: ["Curated game directory", "Live DexScreener data", "Safety scoring engine"] },
  { phase: "Phase 2", title: "Discovery", status: "in-progress", items: ["Advanced filters", "Saved watchlists", "Expanded game library"] },
  { phase: "Phase 3", title: "Trading", status: "upcoming", items: ["Wallet connection", "Portfolio tracking", "Price alerts"] },
  { phase: "Phase 4", title: "Community", status: "upcoming", items: ["Game submissions", "Community voting", "Rewards"] },
];

const faqs = [
  {
    q: "How does SavePoint decide which games to list?",
    a: "We use a combination of manual curation and on-chain safety checks. Every listed game must pass our Safety Score threshold and have a real product, website, and social presence.",
  },
  {
    q: "Is the Safety Score financial advice?",
    a: "No. The Safety Score is an informational risk signal based on publicly available data. Always do your own research (DYOR) before investing.",
  },
  {
    q: "How can I submit a game?",
    a: "Game submissions are coming soon. For now, reach out to us on X @savepoint with a project suggestion.",
  },
  {
    q: "Where does the price data come from?",
    a: "Price, volume, and market cap data come from DexScreener. On-chain metadata comes from Helius, Birdeye, and Solscan.",
  },
];

export default function Docs() {
  return (
    <div className="relative min-h-screen bg-background bg-grid">
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
              <span className="text-base font-bold tracking-tight">SavePoint Docs</span>
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
                        className="group relative flex items-center gap-3 py-2 pl-4 text-sm text-foreground/60 transition-colors hover:text-foreground"
                      >
                        <section.icon size={16} className="text-muted-foreground group-hover:text-primary" />
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="space-y-20">
              {/* Hero */}
              <section id="overview" className="scroll-mt-28">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                  <BookOpen size={12} />
                  Documentation
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                  SavePoint
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  Your checkpoint for Solana games.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/60">
                  SavePoint is a curated discovery platform for Solana-based web3 games. We combine
                  manual curation with live market data and on-chain safety signals to help traders
                  and gamers find legitimate projects while filtering out rugs and vaporware.
                </p>
              </section>

              {/* Safety Score */}
              <section id="safety" className="scroll-mt-28">
                <SectionHeader icon={Shield} title="Safety Score" />
                <p className="mb-6 max-w-3xl text-sm leading-7 text-foreground/70">
                  Every listed game receives a Safety Score from 0 to 100. The score is computed
                  from transparent, verifiable on-chain and market signals. Games must score at
                  least 40 to appear on the platform.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {safetyChecks.map((check) => (
                    <div
                      key={check.label}
                      className="rounded-xl border border-border/40 bg-card/30 p-5 transition-all hover:border-primary/30 hover:bg-card/50"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <check.icon size={20} />
                      </div>
                      <h3 className="mb-1 font-bold text-foreground">{check.label}</h3>
                      <p className="text-sm leading-relaxed text-foreground/60">{check.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Curation */}
              <section id="curation" className="scroll-mt-28">
                <SectionHeader icon={Filter} title="Curation" />
                <p className="mb-6 max-w-3xl text-sm leading-7 text-foreground/70">
                  SavePoint does not rely on algorithmic discovery alone. Every game in our core
                  directory is manually reviewed against a vetting checklist before being added.
                </p>
                <div className="rounded-xl border border-border/40 bg-card/30 p-6">
                  <ul className="space-y-3">
                    {[
                      "Real playable product, demo, or beta",
                      "Active website and social presence",
                      "Solana-native token or integration",
                      "Real liquidity and holder activity",
                      "No honeypot or obvious rug signals",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-foreground/70">
                        <CheckCircle2 size={16} className="text-positive" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* How to use */}
              <section id="how-to" className="scroll-mt-28">
                <SectionHeader icon={Search} title="How to Use" />
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { step: "01", title: "Browse", desc: "Explore games by genre, status, or trending tab." },
                    { step: "02", title: "Inspect", desc: "Click any card to see live price, volume, and Safety Score breakdown." },
                    { step: "03", title: "Save", desc: "Save games to your personal watchlist for quick access." },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="rounded-xl border border-border/40 bg-card/30 p-5"
                    >
                      <span className="font-mono text-xs font-bold text-primary">{item.step}</span>
                      <h3 className="mt-2 font-bold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm text-foreground/60">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Roadmap */}
              <section id="roadmap" className="scroll-mt-28">
                <SectionHeader icon={Rocket} title="Roadmap" />
                <div className="space-y-4">
                  {roadmap.map((phase, index) => (
                    <motion.div
                      key={phase.phase}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`rounded-2xl border p-5 ${
                        phase.status === "completed"
                          ? "border-emerald-500/30 bg-emerald-950/10"
                          : phase.status === "in-progress"
                          ? "border-primary/30 bg-primary/10"
                          : "border-border/40 bg-white/[0.02]"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {phase.phase}
                          </p>
                          <h3 className="text-xl font-bold text-foreground">{phase.title}</h3>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            phase.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : phase.status === "in-progress"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {phase.status}
                        </span>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {phase.items.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-sm text-foreground/70">
                            <ChevronRight size={14} className="text-muted-foreground" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="scroll-mt-28">
                <SectionHeader icon={HelpCircle} title="FAQ" />
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div
                      key={faq.q}
                      className="rounded-xl border border-border/40 bg-card/30 p-5"
                    >
                      <h3 className="font-bold text-foreground">{faq.q}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/60">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Disclaimer */}
              <section className="rounded-xl border border-yellow-500/20 bg-yellow-950/10 p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="mt-0.5 text-yellow-400" />
                  <div>
                    <h3 className="font-bold text-foreground">Disclaimer</h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/60">
                      Projects listed on SavePoint are vetted and scored using publicly available
                      on-chain and market data. These scores are for informational purposes only
                      and do not constitute financial advice. The SavePoint team is not responsible
                      for the actions of third-party projects or tokens. Always do your own
                      research (DYOR) before investing, trading, or interacting with any token.
                    </p>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 border-b border-border/40 pb-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={18} />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
    </div>
  );
}
