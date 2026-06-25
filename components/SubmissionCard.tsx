"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { VoteButton } from "./VoteButton";
import { ExternalLink } from "lucide-react";

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
  onVote?: (id: string) => void;
}

export function SubmissionCard({ submission, index = 0, onVote }: SubmissionCardProps) {
  const displayUrl = submission.dex_url || submission.website || "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/60"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              {submission.image_url ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/40 bg-black">
                  <Image
                    src={submission.image_url}
                    alt={submission.symbol}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-primary/10 text-xs font-bold text-primary">
                  {submission.symbol.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <h3 className="text-base font-semibold text-foreground">{submission.name}</h3>
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
                className="inline-flex items-center gap-1 text-primary transition-colors hover:underline"
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
