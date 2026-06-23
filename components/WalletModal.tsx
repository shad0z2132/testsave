"use client";

import { X, Wallet, Clock } from "lucide-react";

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-border/60 bg-[#0f0f11] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <h3 className="text-base font-semibold text-foreground">Connect wallet</h3>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wallet size={28} />
          </div>
          <h4 className="mt-4 text-lg font-semibold text-foreground">Wallets coming soon</h4>
          <p className="mt-2 max-w-[16rem] text-sm text-muted-foreground">
            Wallet connection, portfolio tracking, and in-app swaps are on the roadmap.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Clock size={12} />
            Phase 3
          </div>
        </div>

        <div className="border-t border-border/60 px-4 py-3 text-center">
          <button
            onClick={() => onOpenChange(false)}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
