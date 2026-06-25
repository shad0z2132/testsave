"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowBigUp, Loader2 } from "lucide-react";

interface VoteButtonProps {
  submissionId: string;
  votes: number;
  onVote?: (id: string) => void;
}

const COOLDOWN_SECONDS = 60 * 60;

function getVoteKey(id: string) {
  return `savepoint_vote_${id}`;
}

function formatCooldown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function getInitialCooldown(submissionId: string): number {
  if (typeof window === "undefined") return 0;
  const lastVoted = localStorage.getItem(getVoteKey(submissionId));
  if (!lastVoted) return 0;

  const elapsed = Date.now() - parseInt(lastVoted, 10);
  const remainingMs = COOLDOWN_SECONDS * 1000 - elapsed;
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
}

export function VoteButton({ submissionId, votes, onVote }: VoteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(() => getInitialCooldown(submissionId));
  const [voteDelta, setVoteDelta] = useState(0);

  // Tick down the cooldown timer.
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const handleVote = useCallback(async () => {
    if (cooldown > 0 || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id: submissionId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429 && data.secondsRemaining) {
          setCooldown(data.secondsRemaining);
          localStorage.setItem(getVoteKey(submissionId), Date.now().toString());
          throw new Error(`Vote again in ${formatCooldown(data.secondsRemaining)}`);
        }
        throw new Error(data.error || "Failed to vote");
      }

      localStorage.setItem(getVoteKey(submissionId), Date.now().toString());
      setCooldown(COOLDOWN_SECONDS);
      setVoteDelta((prev) => prev + 1);
      onVote?.(submissionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to vote");
    } finally {
      setIsLoading(false);
    }
  }, [submissionId, cooldown, isLoading, onVote]);

  const displayVotes = votes + voteDelta;

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleVote}
        disabled={isLoading || cooldown > 0}
        className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl border transition-all ${
          cooldown > 0
            ? "cursor-not-allowed border-border/40 bg-white/[0.02] text-foreground/40"
            : "border-primary/30 bg-primary/10 text-primary hover:scale-105 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(255,42,140,0.3)]"
        }`}
        aria-label="Upvote"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ArrowBigUp size={20} />
        )}
      </button>

      <span className="font-mono text-xs font-semibold text-foreground">
        {displayVotes.toLocaleString()}
      </span>

      {cooldown > 0 && (
        <span className="text-[9px] text-foreground/40">{formatCooldown(cooldown)}</span>
      )}

      {error && !cooldown && (
        <span className="max-w-[8rem] text-center text-[9px] text-negative">{error}</span>
      )}
    </div>
  );
}
