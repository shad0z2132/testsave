"use client";

import { X } from "lucide-react";

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const wallets = [
  { id: "phantom", name: "Phantom", icon: "🦊" },
  { id: "solflare", name: "Solflare", icon: "🔥" },
  { id: "backpack", name: "Backpack", icon: "🎒" },
  { id: "walletconnect", name: "WalletConnect", icon: "🔗" },
];

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

        <div className="p-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => {
                // TODO: WEB3 - integrate real wallet adapter
                console.log(`Connect ${wallet.name}`);
                onOpenChange(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-white/[0.03]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-lg">
                {wallet.icon}
              </span>
              <span className="font-medium text-foreground">{wallet.name}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-border/60 px-4 py-3 text-center text-xs text-muted-foreground">
          New to Solana?{" "}
          <a href="#" className="text-primary hover:underline">
            Get a wallet
          </a>
        </div>
      </div>
    </div>
  );
}
