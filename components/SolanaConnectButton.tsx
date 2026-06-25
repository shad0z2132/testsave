"use client";

import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

interface SolanaConnectButtonProps {
  className?: string;
}

export function SolanaConnectButton({ className }: SolanaConnectButtonProps) {
  return <WalletMultiButton className={className} />;
}
