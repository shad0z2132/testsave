"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DustParticles } from "@/components/DustParticles";
import { LeftSidebar } from "@/components/LeftSidebar";
import { SubmissionCard, Submission } from "@/components/SubmissionCard";
import { SubmissionForm } from "@/components/SubmissionForm";
import { CommandPalette } from "@/components/CommandPalette";
import { CommunityChat } from "@/components/CommunityChat";
import { SEO } from "@/components/SEO";
import { ArrowRight, RefreshCw, Loader2, Trophy, Clock, BarChart3, Inbox } from "lucide-react";

type SortMode = "top" | "newest";

export default function CommunityPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortMode>("top");
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
      <SEO
        title="Community · SavePoint"
        description="Vote on upcoming Solana game listings, submit projects, and chat with the SavePoint community."
        path="/community/"
      />

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

          <LeftSidebar
            activeTab="community"
            activeFilter="All"
            onTabChange={() => {}}
            onFilterChange={() => {}}
            mobileOpen={mobileSidebarOpen}
            onMobileOpenChange={setMobileSidebarOpen}
          />

          <div className="flex min-h-screen flex-col lg:ml-56">
            <Header
              onSearchClick={() => setCommandOpen(true)}
              onMenuClick={() => setMobileSidebarOpen(true)}
            />

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-20 pt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0a0a0a] p-5 shadow-[0_0_40px_rgba(204,255,0,0.05)] sm:p-6">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      Community submissions
                    </h1>
                    <p className="mt-1 max-w-xl text-sm text-foreground/60">
                      Vote on projects the community wants to see listed. Top-voted submissions are reviewed by the SavePoint team.
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.08] pt-5">
                    <div className="rounded-xl border border-white/[0.12] bg-black p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-foreground/50">
                        <Inbox size={12} /> Submissions
                      </div>
                      <p className="mt-1 font-mono text-lg font-bold text-foreground">{stats.total}</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.12] bg-black p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-foreground/50">
                        <Clock size={12} /> Pending
                      </div>
                      <p className="mt-1 font-mono text-lg font-bold text-foreground">{stats.pending}</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.12] bg-black p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-foreground/50">
                        <BarChart3 size={12} /> Total votes
                      </div>
                      <p className="mt-1 font-mono text-lg font-bold text-foreground">{stats.votes.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                  <div className="flex flex-col lg:col-span-7 xl:col-span-8">
                    {/* Inline submission form */}
                    <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0a0a0a] p-5 shadow-[0_0_40px_rgba(204,255,0,0.05)] sm:p-6">
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                      <div className="mb-4">
                        <h2 className="text-lg font-bold tracking-tight text-foreground">
                          Submit a project
                        </h2>
                        <p className="text-sm text-foreground/60">
                          Paste a Solana DexScreener link and the community will vote on it.
                        </p>
                      </div>
                      <SubmissionForm onSuccess={fetchSubmissions} />
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                      <div className="inline-flex rounded-full border border-white/[0.12] bg-[#0a0a0a] p-1">
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
                      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0a0a0a] p-12 text-center">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime/10">
                          <Inbox size={28} className="text-lime" />
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
                  </div>

                  <div className="lg:col-span-5 xl:col-span-4">
                    <div className="lg:sticky lg:top-6">
                      <CommunityChat />
                    </div>
                  </div>
                </div>
              </motion.div>
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
