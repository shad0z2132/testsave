import "@/styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import type { AppProps } from "next/app";
import { Inter, Roboto, JetBrains_Mono } from "next/font/google";
import { useState, useSyncExternalStore } from "react";
import { SolanaWalletProvider } from "@/components/WalletProvider";
import { Preloader } from "@/components/Preloader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-family-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-family-body",
  display: "swap",
  weight: ["400", "500", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  const [showPreloader, setShowPreloader] = useState(true);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <div className={`${inter.variable} ${roboto.variable} ${jetbrains.variable}`}>
      {mounted && (
        <Preloader
          duration={3500}
          isLoading={showPreloader}
          onComplete={() => setShowPreloader(false)}
        />
      )}
      <SolanaWalletProvider>
        <Component {...pageProps} />
      </SolanaWalletProvider>
    </div>
  );
}
