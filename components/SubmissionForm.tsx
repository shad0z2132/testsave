"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isDexScreenerUrl, VALIDATION_LIMITS } from "@/lib/validation";
import { Loader2, Send, CheckCircle, ArrowRight } from "lucide-react";

interface SubmissionFormProps {
  onSuccess?: () => void;
}

export function SubmissionForm({ onSuccess }: SubmissionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [dexUrl, setDexUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dexUrl.trim()) {
      setError("Please paste a DexScreener link.");
      return;
    }

    if (!isDexScreenerUrl(dexUrl)) {
      setError("Only Solana DexScreener links are accepted.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dex_url: dexUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit project");
      }

      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-card p-8 text-center shadow-[0_0_40px_rgba(204, 255, 0, 0.08)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle size={32} className="text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">Submission received</h3>
        <p className="mt-2 max-w-sm text-sm text-foreground/60">
          Thanks for submitting. The project is now pending community voting and admin review.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setDexUrl("");
          }}
          className="mt-6 gap-2 rounded-full border border-primary bg-card px-5 text-primary transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_24px_rgba(204, 255, 0, 0.45)]"
        >
          Submit another
          <ArrowRight size={14} />
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-foreground/70">
          DexScreener link *
        </label>
        <Input
          value={dexUrl}
          onChange={(e) => {
            setDexUrl(e.target.value);
            setError(null);
          }}
          placeholder="https://dexscreener.com/solana/..."
          maxLength={VALIDATION_LIMITS.url.max}
          className="border-border/60 bg-white/[0.03] text-foreground placeholder:text-foreground/30"
        />
        <p className="mt-1.5 text-xs text-foreground/40">
          Paste a DexScreener link for the Solana token. We&apos;ll pull the name, symbol, and token info automatically.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-negative/30 bg-negative/10 px-3 py-2 text-sm text-negative">
          {error}
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="group w-full gap-2 rounded-full border border-primary bg-card px-5 text-primary transition-all duration-300 hover:scale-[1.02] hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_24px_rgba(204, 255, 0, 0.45)] disabled:opacity-70 sm:w-auto sm:px-8"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Send size={16} />
              Submit project
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
