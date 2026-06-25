"use client";

import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Submission } from "@/components/SubmissionCard";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Lock,
  LogOut,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

export default function AdminSubmissionsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/submissions");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
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
    if (authenticated) {
      // Data fetching on auth change is idiomatic; the rule flags the synchronous setState inside fetchSubmissions.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchSubmissions();
    }
  }, [authenticated, fetchSubmissions]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) throw new Error("Invalid password");
      setAuthenticated(true);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setPassword("");
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Admin · SavePoint</title>
        </Head>
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm rounded-2xl border border-border/40 bg-card/50 p-6"
          >
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Lock size={24} />
              </div>
              <h1 className="mt-4 text-lg font-semibold text-foreground">Admin access</h1>
              <p className="text-sm text-foreground/60">Enter the admin password to review submissions.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border-border/60 bg-white/[0.03] text-foreground"
              />

              {loginError && (
                <p className="text-sm text-negative">{loginError}</p>
              )}

              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-full border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {loginLoading ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : null}
                Unlock
              </Button>
            </form>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Review Submissions · SavePoint Admin</title>
      </Head>
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Review submissions
              </h1>
              <p className="text-sm text-foreground/60">
                Approve or reject community submissions. Approved projects still need to be added to the curated game list manually.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchSubmissions}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/60 bg-white/[0.03] px-3 text-xs text-foreground/70 transition-colors hover:text-foreground"
              >
                <RefreshCw size={12} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-negative/30 bg-negative/10 px-3 text-xs text-negative transition-colors hover:bg-negative/20"
              >
                <LogOut size={12} />
                Logout
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-foreground/50">
              <Loader2 size={24} className="mr-2 animate-spin" />
              Loading...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-negative/30 bg-negative/10 p-8 text-center text-negative">
              {error}
            </div>
          ) : submissions.length === 0 ? (
            <div className="rounded-2xl border border-border/40 bg-card/40 p-12 text-center text-foreground/60">
              No submissions yet.
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="rounded-xl border border-border/40 bg-card/40 p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground">{submission.name}</h3>
                        <span className="text-xs text-foreground/50">({submission.symbol})</span>
                        <StatusBadge status={submission.status} />
                      </div>

                      <p className="mt-2 text-sm text-foreground/70">{submission.description}</p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <a
                          href={submission.dex_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-white/[0.03] px-2 py-1 text-foreground/70 transition-colors hover:text-primary"
                        >
                          DexScreener <ExternalLink size={10} />
                        </a>
                        {submission.website && submission.website !== submission.dex_url && (
                          <a
                            href={submission.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-white/[0.03] px-2 py-1 text-foreground/70 transition-colors hover:text-primary"
                          >
                            Website <ExternalLink size={10} />
                          </a>
                        )}
                      </div>

                      {submission.token_mint && (
                        <p className="mt-3 truncate font-mono text-[10px] text-foreground/40">
                          {submission.token_mint}
                        </p>
                      )}

                      <p className="mt-2 text-[10px] text-foreground/40">
                        Votes: {submission.votes_count} · Submitted: {new Date(submission.created_at).toLocaleString()}
                      </p>
                    </div>

                    {submission.status === "pending" && (
                      <div className="flex items-center gap-2 lg:flex-col">
                        <Button
                          onClick={() => updateStatus(submission.id, "approved")}
                          disabled={updatingId === submission.id}
                          className="rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                        >
                          {updatingId === submission.id ? (
                            <Loader2 size={14} className="mr-1 animate-spin" />
                          ) : (
                            <CheckCircle size={14} className="mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => updateStatus(submission.id, "rejected")}
                          disabled={updatingId === submission.id}
                          className="rounded-full border border-negative/30 bg-negative/10 text-negative hover:bg-negative hover:text-white"
                        >
                          <XCircle size={14} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: Submission["status"] }) {
  const config = {
    pending: "border-primary/30 bg-primary/10 text-primary",
    approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    rejected: "border-negative/30 bg-negative/10 text-negative",
  };

  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config[status]}`}>
      {status}
    </span>
  );
}
