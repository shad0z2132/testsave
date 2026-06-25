"use client";

import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, Loader2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

function shortenAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

interface WalletButtonContentProps {
  className?: string;
}

function WalletButtonContent({ className }: WalletButtonContentProps) {
  const { publicKey, connected, connecting, disconnect, disconnecting } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  const isBusy = connecting || disconnecting;
  const address = publicKey?.toBase58();

  return (
    <button
      onClick={handleClick}
      disabled={isBusy}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border font-semibold tracking-wide transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100",
        connected
          ? "border-lime/30 bg-lime/10 px-3 py-0 text-lime hover:border-lime hover:bg-lime hover:text-black hover:shadow-lime-glow"
          : "border-lime bg-lime/15 px-4 py-0 text-lime hover:scale-105 hover:bg-lime hover:text-black hover:shadow-[0_0_28px_rgba(204,255,0,0.45)]",
        className
      )}
    >
      {/* Animated gradient sheen */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {isBusy ? (
        <Loader2 size={14} className="animate-spin" />
      ) : connected ? (
        <LogOut size={14} />
      ) : (
        <Wallet size={14} />
      )}

      <span className="whitespace-nowrap text-xs">
        {isBusy
          ? "Loading..."
          : connected && address
          ? shortenAddress(address)
          : "Connect Wallet"}
      </span>
    </button>
  );
}

const WalletButtonNoSSR = dynamic(() => Promise.resolve(WalletButtonContent), {
  ssr: false,
});

interface SolanaConnectButtonProps {
  className?: string;
}

export function SolanaConnectButton({ className }: SolanaConnectButtonProps) {
  return <WalletButtonNoSSR className={className} />;
}
