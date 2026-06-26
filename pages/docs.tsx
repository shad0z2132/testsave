"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { RoadmapPhases } from "@/components/RoadmapPhases";
import { SEO } from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  Save,
  MousePointerClick,
  Menu,
  Calendar,
  Terminal,
  Vote,
  Plus,
} from "lucide-react";

const sections = [
  { id: "overview", title: "Overview", icon: BookOpen },
  { id: "safety", title: "Safety Score", icon: Shield },
  { id: "curation", title: "Curation", icon: Filter },
  { id: "community", title: "Community", icon: Users },
  { id: "how-to", title: "How to Use", icon: MousePointerClick },
  { id: "roadmap", title: "Roadmap", icon: Rocket },
  { id: "faq", title: "FAQ", icon: HelpCircle },
];

const quickLinks = [
  { id: "safety", title: "Safety Score", desc: "How we score project safety", icon: Shield },
  { id: "curation", title: "Curation", desc: "How games are reviewed", icon: Filter },
  { id: "community", title: "Community", desc: "Submit and vote on games", icon: Users },
  { id: "faq", title: "FAQ", desc: "Common questions", icon: HelpCircle },
];

const safetyChecks = [
  { icon: Lock, label: "Mint authority revoked", desc: "No one can mint new tokens and inflate supply." },
  { icon: Lock, label: "Freeze authority revoked", desc: "No one can freeze user wallets." },
  { icon: Users, label: "Holder distribution", desc: "Top holders don't control too much supply." },
  { icon: Database, label: "Token age & liquidity", desc: "Older tokens with real liquidity are safer." },
  { icon: Globe, label: "Website & socials", desc: "Real projects have verifiable online presence." },
  { icon: CheckCircle2, label: "Curated game metadata", desc: "Whitelist games are manually reviewed." },
];

const sectionContent: Record<string, string> = {
  overview: "curated discovery platform solana web3 games manual review safety score",
  safety: "safety score 0 to 100 mint freeze authority holder distribution liquidity website socials",
  curation: "manual review vetting checklist playable product website social presence solana token liquidity",
  community: "submit dexscreener link vote hourly admin review pending submissions",
  "how-to": "browse inspect save games genre status trending watchlist search filter",
  roadmap: "launchpad discovery trading community wallet portfolio alerts rewards",
  faq: "list safety score financial advice submit game price data dexscreener helius birdeye solscan",
};

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
    a: "Paste a Solana DexScreener link on the Submit page. We pull the token name, symbol, and mint automatically. The community votes on submissions, and the most popular ones are reviewed by the SavePoint team before listing.",
  },
  {
    q: "Where does the price data come from?",
    a: "Price, volume, and market cap data come from DexScreener. On-chain metadata comes from Helius, Birdeye, and Solscan.",
  },
  {
    q: "How often can I vote on community submissions?",
    a: "You can vote once per hour per submission. This cooldown keeps voting fair and prevents botting.",
  },
];

export default function Docs() {
  const [search, setSearch] = useState("");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const filteredSections = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return sections.map((s) => s.id);
    return sections
      .filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          sectionContent[s.id]?.toLowerCase().includes(query)
      )
      .map((s) => s.id);
  }, [search]);

  const lastUpdated = "June 25, 2026";

  return (
    <>
      <SEO
        title="Docs · SavePoint"
        description="Learn how SavePoint scores project safety, curates games, and builds the Solana gaming directory."
        path="/docs/"
      />
      <div className="relative min-h-screen bg-background bg-grid">
        <div className="relative z-10 flex min-h-screen flex-col">
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

        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 lg:py-16">
          {/* Hero */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0a0a0a] p-8 text-center shadow-[0_0_60px_rgba(204,255,0,0.06)] sm:p-12"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-lime">
                <Sparkles size={12} />
                Documentation
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Your checkpoint for <span className="text-primary">Solana games</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Learn how SavePoint curates, scores, and surfaces safe web3 gaming tokens — so you
                can play and invest with confidence.
              </p>

              {/* Docs search */}
              <div className="mx-auto mt-8 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search docs..."
                    className="h-11 w-full rounded-xl border border-white/[0.12] bg-black pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-lime/50 focus:bg-white/[0.04]"
                  />
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-foreground/40">
                <Calendar size={12} />
                Last updated {lastUpdated}
              </div>
            </motion.div>
          </section>

          {/* Quick links grid */}
          <section className="mb-20">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0a0a] p-5 transition-all hover:-translate-y-0.5 hover:border-lime/40 hover:shadow-[0_0_24px_rgba(204,255,0,0.08)]"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10 text-lime transition-colors group-hover:bg-lime group-hover:text-black">
                    <link.icon size={20} />
                  </div>
                  <h3 className="font-bold text-foreground">{link.title}</h3>
                  <p className="mt-1 text-sm text-foreground/60">{link.desc}</p>
                </motion.a>
              ))}
            </div>
          </section>

          <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
            {/* Mobile TOC dropdown */}
            <div className="mb-6 lg:hidden">
              <button
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.12] bg-[#0a0a0a] p-3 text-sm font-medium text-foreground transition-colors hover:border-lime/40"
              >
                <span className="flex items-center gap-2">
                  <Menu size={16} className="text-muted-foreground" />
                  On this page
                </span>
                <ChevronRight
                  size={14}
                  className={`text-muted-foreground transition-transform ${mobileTocOpen ? "rotate-90" : ""}`}
                />
              </button>
              <AnimatePresence>
                {mobileTocOpen && (
                  <motion.nav
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="relative mt-2 overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0a0a] p-2">
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                      {sections
                        .filter((s) => filteredSections.includes(s.id))
                        .map((section) => (
                          <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={() => setMobileTocOpen(false)}
                            className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/60 transition-colors hover:bg-white/[0.03] hover:text-lime"
                          >
                            <section.icon size={16} className="text-muted-foreground group-hover:text-lime" />
                            {section.title}
                          </a>
                        ))}
                    </div>
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="relative overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0a0a] p-4 shadow-[0_0_24px_rgba(204,255,0,0.04)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-lime/70" />
                    On this page
                  </p>
                  <nav className="space-y-1">
                    {sections
                      .filter((s) => filteredSections.includes(s.id))
                      .map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/60 transition-colors hover:bg-white/[0.03] hover:text-lime"
                        >
                          <section.icon size={16} className="text-muted-foreground group-hover:text-lime" />
                          {section.title}
                        </a>
                      ))}
                  </nav>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0a0a] p-4">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Useful links
                  </p>
                  <div className="space-y-1">
                    <Link href="/community" className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground/60 transition-colors hover:bg-white/[0.03] hover:text-lime">
                      <Vote size={14} />
                      Community voting
                    </Link>
                    <Link href="/submit" className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground/60 transition-colors hover:bg-white/[0.03] hover:text-lime">
                      <Plus size={14} />
                      Submit a game
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="space-y-24">
              {/* Overview */}
              <section id="overview" className="scroll-mt-28">
                <SectionHeader icon={BookOpen} title="What is SavePoint?" />
                <div className="max-w-3xl space-y-4 text-sm leading-7 text-foreground/70">
                  <p>
                    SavePoint is a curated discovery platform for Solana-based web3 games. We combine
                    manual review with live market data and on-chain safety signals to help traders
                    and gamers find legitimate projects while filtering out rugs and vaporware.
                  </p>
                  <p>
                    Every game on SavePoint gets a transparent <strong>Safety Score</strong> based on
                    real data. No hype, no paid placements — just signals you can verify yourself.
                  </p>
                </div>
              </section>

              {/* Safety Score */}
              <section id="safety" className="scroll-mt-28">
                <SectionHeader icon={Shield} title="Safety Score" />
                <p className="mb-6 max-w-3xl text-sm leading-7 text-foreground/70">
                  Every listed game receives a Safety Score from <strong>0 to 100</strong>. The score
                  is computed from transparent, verifiable on-chain and market signals. Games must
                  score at least <strong>40</strong> to appear on the platform.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {safetyChecks.map((check) => (
                    <div
                      key={check.label}
                      className="group relative overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0a0a] p-5 transition-all hover:-translate-y-0.5 hover:border-lime/30 hover:shadow-[0_0_20px_rgba(204,255,0,0.06)]"
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10 text-lime transition-colors group-hover:bg-lime group-hover:text-black">
                        <check.icon size={20} />
                      </div>
                      <h3 className="font-bold text-foreground">{check.label}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/60">{check.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Curation */}
              <section id="curation" className="scroll-mt-28">
                <SectionHeader icon={Filter} title="How Games Are Curated" />
                <p className="mb-6 max-w-3xl text-sm leading-7 text-foreground/70">
                  SavePoint does not rely on algorithmic discovery alone. Every game in our core
                  directory is manually reviewed against a vetting checklist before being added.
                </p>
                <div className="relative overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0a0a] p-6 shadow-[0_0_20px_rgba(204,255,0,0.04)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                  <ul className="space-y-4">
                    {[
                      "Real playable product, demo, or beta",
                      "Active website and social presence",
                      "Solana-native token or integration",
                      "Real liquidity and holder activity",
                      "No honeypot or obvious rug signals",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-foreground/70">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lime" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Community */}
              <section id="community" className="scroll-mt-28">
                <SectionHeader icon={Users} title="Community Submissions" />
                <p className="mb-6 max-w-3xl text-sm leading-7 text-foreground/70">
                  Anyone can submit a Solana game token and vote on which projects deserve a listing.
                  Submissions with the most community support are reviewed by the SavePoint team.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: "Submit a game",
                      desc: "Paste a DexScreener link. We pull the token name, symbol, and metadata automatically.",
                      icon: Plus,
                    },
                    {
                      title: "Vote hourly",
                      desc: "Cast one vote per submission every hour. Help the best projects rise to the top.",
                      icon: Vote,
                    },
                    {
                      title: "Admin review",
                      desc: "Top-voted submissions enter a review queue before being added to the curated directory.",
                      icon: Shield,
                    },
                    {
                      title: "Earn rewards",
                      desc: "Future contributor rewards will recognize accurate voters and successful submitters.",
                      icon: Sparkles,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="group relative overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0a0a] p-5 transition-all hover:-translate-y-0.5 hover:border-lime/30 hover:shadow-[0_0_20px_rgba(204,255,0,0.06)]"
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10 text-lime transition-colors group-hover:bg-lime group-hover:text-black">
                        <item.icon size={20} />
                      </div>
                      <h3 className="font-bold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/60">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="relative mt-6 overflow-hidden rounded-xl border border-white/[0.12] bg-black p-4 font-mono text-xs text-foreground/70">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                  <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-foreground/40">
                    <Terminal size={12} />
                    Submit endpoint
                  </div>
                  <p className="text-lime">POST /api/submissions</p>
                  <p className="mt-1 text-foreground/50">{`{ "dex_url": "https://dexscreener.com/solana/..." }`}</p>
                </div>
              </section>

              {/* How to use */}
              <section id="how-to" className="scroll-mt-28">
                <SectionHeader icon={MousePointerClick} title="How to Use SavePoint" />
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { step: "01", title: "Browse", desc: "Explore games by genre, status, or trending tab.", icon: Search },
                    { step: "02", title: "Inspect", desc: "Click any card to see live price, volume, and Safety Score breakdown.", icon: Shield },
                    { step: "03", title: "Save", desc: "Save games to your personal watchlist for quick access.", icon: Save },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="group relative overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0a0a] p-6 transition-all hover:-translate-y-0.5 hover:border-lime/30 hover:shadow-[0_0_20px_rgba(204,255,0,0.06)]"
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                      <span className="absolute right-4 top-4 font-mono text-2xl font-bold text-foreground/10">
                        {item.step}
                      </span>
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-lime/10 text-lime transition-colors group-hover:bg-lime group-hover:text-black">
                        <item.icon size={22} />
                      </div>
                      <h3 className="font-bold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/60">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Roadmap */}
              <section id="roadmap" className="scroll-mt-28">
                <SectionHeader icon={Rocket} title="Roadmap" />
                <RoadmapPhases revealedCount={1} />
              </section>

              {/* FAQ */}
              <section id="faq" className="scroll-mt-28">
                <SectionHeader icon={HelpCircle} title="Frequently Asked Questions" />
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={faq.q}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0a0a] p-5 transition-all hover:-translate-y-0.5 hover:border-lime/30 hover:shadow-[0_0_20px_rgba(204,255,0,0.06)]"
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                      <h3 className="font-bold text-foreground">{faq.q}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/60">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Disclaimer */}
              <section className="relative overflow-hidden rounded-2xl border border-lime/20 bg-[#0a0a0a] p-6">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lime/10">
                    <AlertTriangle size={20} className="text-lime" />
                  </div>
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

              {/* CTA */}
              <section className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0a0a0a] p-8 text-center shadow-[0_0_40px_rgba(204,255,0,0.06)]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                <h2 className="text-2xl font-bold text-foreground">Ready to explore?</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-foreground/60">
                  Start browsing curated Solana games with real safety scores and live market data.
                </p>
                <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-2.5 text-sm font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_24px_rgba(204,255,0,0.4)]"
                  >
                    Launch SavePoint
                    <ChevronRight size={16} />
                  </Link>
                  <Link
                    href="/submit"
                    className="inline-flex items-center gap-2 rounded-full border border-lime bg-[#0a0a0a] px-6 py-2.5 text-sm font-bold text-lime transition-all hover:scale-105 hover:bg-lime hover:text-black"
                  >
                    Submit a Game
                    <Plus size={16} />
                  </Link>
                </div>
              </section>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
    </>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3 border-b border-white/[0.08] pb-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10 text-lime">
        <Icon size={20} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
    </div>
  );
}
