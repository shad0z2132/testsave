"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { VoteButton } from "./VoteButton";
import { ExternalLink, Trophy } from "lucide-react";

export interface Submission {
  id: string;
  name: string;
  symbol: string;
  token_mint: string;
  dex_url: string;
  image_url?: string | null;
  website?: string | null;
  description?: string | null;
  status: "pending" | "approved" | "rejected";
  votes_count: number;
  created_at: string;
}

interface SubmissionCardProps {
  submission: Submission;
  index?: number;
  rank?: number;
  onVote?: (id: string) => void;
}

const rankStyles: Record<number, string> = {
  1: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
  2: "bg-slate-300/15 text-slate-300 border-slate-300/30",
  3: "bg-amber-600/15 text-amber-500 border-amber-500/30",
};

export function SubmissionCard({ submission, index = 0, rank, onVote }: SubmissionCardProps) {
  const displayUrl = submission.dex_url || submission.website || "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-xl border border-border/40 bg-card transition-all hover:border-lime/30 hover:shadow-[0_0_24px_rgba(204,255,0,0.12)]"
    >
      {/* Lime top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      {rank && rank <= 3 && (
        <div
          className={`absolute left-0 top-0 flex h-5 items-center gap-0.5 rounded-br-lg border px-1.5 text-[10px] font-bold uppercase tracking-wider ${rankStyles[rank]}`}
        >
          <Trophy size={10} />
          #{rank}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              {submission.image_url ? (
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border/40 bg-black ring-2 ring-transparent transition-all group-hover:ring-lime/20">
                  <Image
                    src={submission.image_url}
                    alt={submission.symbol}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/40 bg-lime/10 text-xs font-bold text-lime ring-2 ring-transparent transition-all group-hover:ring-lime/20">
                  {submission.symbol.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-white">
                  {submission.name}
                </h3>
                <p className="text-xs text-foreground/50">{submission.symbol}</p>
              </div>
            </div>

            {submission.description && (
              <p className="mt-2 line-clamp-2 text-sm text-foreground/60">
                {submission.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-foreground/50">
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-white/[0.03] px-2 py-1 text-lime transition-colors hover:bg-lime/10"
              >
                DexScreener <ExternalLink size={10} />
              </a>

              <span className="truncate font-mono text-[10px] text-foreground/40">
                {submission.token_mint}
              </span>
            </div>
          </div>

          <VoteButton
            submissionId={submission.id}
            votes={submission.votes_count}
            onVote={onVote}
          />
        </div>
      </div>
    </motion.div>
  );
}
