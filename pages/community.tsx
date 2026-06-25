"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DustParticles } from "@/components/DustParticles";
import { LeftSidebar } from "@/components/LeftSidebar";
import { SubmissionCard, Submission } from "@/components/SubmissionCard";
import { WalletModal } from "@/components/WalletModal";
import { CommandPalette } from "@/components/CommandPalette";
import { Plus, ArrowRight, RefreshCw, Loader2, Trophy, Clock, BarChart3, Inbox } from "lucide-react";

type SortMode = "top" | "newest";

export default function CommunityPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortMode>("top");
  const [walletOpen, setWalletOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/submissions");
      if (!res.ok) throw new Error("Failed to load submissions");
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Data fetching on mount is idiomatic; the rule flags the synchronous setState inside fetchSubmissions.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleVote = useCallback(() => {
    // Refresh list to keep counts in sync across sessions.
    fetchSubmissions();
  }, [fetchSubmissions]);

  const sortedSubmissions = useMemo(() => {
    const sorted = [...submissions];
    if (sortBy === "top") {
      sorted.sort((a, b) => b.votes_count - a.votes_count);
    } else {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return sorted;
  }, [submissions, sortBy]);

  const stats = useMemo(() => {
    return {
      total: submissions.length,
      pending: submissions.filter((s) => s.status === "pending").length,
      votes: submissions.reduce((acc, s) => acc + s.votes_count, 0),
    };
  }, [submissions]);

  return (
    <>
      <Head>
        <title>Community · SavePoint</title>
        <meta
          name="description"
          content="Vote on upcoming Solana game listings on SavePoint."
        />
      </Head>

      <div className="relative min-h-screen bg-background bg-grid">
        <DustParticles />

        <div className="relative z-10">
          <CommandPalette
            open={commandOpen}
            onOpenChange={setCommandOpen}
            onSelectGame={() => {}}
            onTabChange={() => {}}
            onFilterChange={() => {}}
            games={[]}
          />

          <WalletModal open={walletOpen} onOpenChange={setWalletOpen} />

          <LeftSidebar
            activeTab="community"
            activeFilter="All"
            onTabChange={() => {}}
            onFilterChange={() => {}}
            onConnect={() => setWalletOpen(true)}
            mobileOpen={mobileSidebarOpen}
            onMobileOpenChange={setMobileSidebarOpen}
          />

          <div className="flex min-h-screen flex-col lg:ml-56">
            <Header
              onConnect={() => setWalletOpen(true)}
              onSearchClick={() => setCommandOpen(true)}
              onMenuClick={() => setMobileSidebarOpen(true)}
            />

            <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-20 pt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 rounded-2xl border border-border/40 bg-card p-5 shadow-[0_0_40px_rgba(255,42,140,0.05)] sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Community submissions
                      </h1>
                      <p className="mt-1 max-w-xl text-sm text-foreground/60">
                        Vote on projects the community wants to see listed. Top-voted submissions are reviewed by the SavePoint team.
                      </p>
                    </div>

                    <Link
                      href="/submit"
                      className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-primary bg-card px-4 py-2 text-sm font-medium text-primary transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_24px_rgba(255,42,140,0.45)]"
                    >
                      <Plus size={16} />
                      Submit a project
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border/40 pt-5">
                    <div className="rounded-xl border border-border/40 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-foreground/50">
                        <Inbox size={12} /> Submissions
                      </div>
                      <p className="mt-1 font-mono text-lg font-bold text-foreground">{stats.total}</p>
                    </div>
                    <div className="rounded-xl border border-border/40 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-foreground/50">
                        <Clock size={12} /> Pending
                      </div>
                      <p className="mt-1 font-mono text-lg font-bold text-foreground">{stats.pending}</p>
                    </div>
                    <div className="rounded-xl border border-border/40 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-foreground/50">
                        <BarChart3 size={12} /> Total votes
                      </div>
                      <p className="mt-1 font-mono text-lg font-bold text-foreground">{stats.votes.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="inline-flex rounded-full border border-border/40 bg-card p-1">
                    <button
                      onClick={() => setSortBy("top")}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        sortBy === "top"
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      <Trophy size={12} />
                      Top voted
                    </button>
                    <button
                      onClick={() => setSortBy("newest")}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        sortBy === "newest"
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      <Clock size={12} />
                      Newest
                    </button>
                  </div>

                  <span className="text-xs text-foreground/40">
                    {sortedSubmissions.length} project{sortedSubmissions.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {loading ? (
                  <div className="flex h-64 items-center justify-center text-foreground/50">
                    <Loader2 size={24} className="mr-2 animate-spin" />
                    Loading submissions...
                  </div>
                ) : error ? (
                  <div className="rounded-2xl border border-negative/30 bg-negative/10 p-8 text-center">
                    <p className="text-sm text-negative">{error}</p>
                    <button
                      onClick={fetchSubmissions}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <RefreshCw size={14} />
                      Try again
                    </button>
                  </div>
                ) : sortedSubmissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-card p-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Inbox size={28} className="text-primary" />
                    </div>
                    <p className="mt-4 text-foreground/60">No submissions yet.</p>
                    <Link
                      href="/submit"
                      className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Be the first to submit a project <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedSubmissions.map((submission, index) => (
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        index={index}
                        rank={sortBy === "top" ? index + 1 : undefined}
                        onVote={handleVote}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
