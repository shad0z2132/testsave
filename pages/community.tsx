"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Plus, RefreshCw, Loader2 } from "lucide-react";

export default function CommunityPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletOpen, setWalletOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

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
          />

          <div className="lg:ml-56">
            <Header onConnect={() => setWalletOpen(true)} onSearchClick={() => setCommandOpen(true)} />

            <main className="mx-auto max-w-4xl px-4 pb-20 pt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      Community submissions
                    </h1>
                    <p className="mt-1 text-sm text-foreground/60">
                      Vote on projects the community wants to see listed. Top-voted submissions are reviewed by the SavePoint team.
                    </p>
                  </div>

                  <Link
                    href="/submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-card px-4 py-2 text-sm font-medium text-primary transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                  >
                    <Plus size={16} />
                    Submit a project
                  </Link>
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
                ) : submissions.length === 0 ? (
                  <div className="rounded-2xl border border-border/40 bg-card/40 p-12 text-center">
                    <p className="text-foreground/60">No pending submissions yet.</p>
                    <Link
                      href="/submit"
                      className="mt-4 inline-block text-sm text-primary hover:underline"
                    >
                      Be the first to submit a project
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission, index) => (
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        index={index}
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
