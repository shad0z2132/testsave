"use client";

import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DustParticles } from "@/components/DustParticles";
import { LeftSidebar } from "@/components/LeftSidebar";
import { SubmissionForm } from "@/components/SubmissionForm";
import { WalletModal } from "@/components/WalletModal";
import { CommandPalette } from "@/components/CommandPalette";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function SubmitPage() {
  const [walletOpen, setWalletOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Submit a Project · SavePoint</title>
        <meta
          name="description"
          content="Submit a Solana game to be listed on SavePoint."
        />
      </Head>

      <div className="relative min-h-screen bg-background bg-grid">
        <DustParticles />

        <div className="relative z-10">
          <CommandPalette
            open={commandOpen}
            onOpenChange={setCommandOpen}
            onSelectGame={() => {}}
            onTabChange={() => {}}
            onFilterChange={() => {}}
            games={[]}
          />

          <WalletModal open={walletOpen} onOpenChange={setWalletOpen} />

          <LeftSidebar
            activeTab="submit"
            activeFilter="All"
            onTabChange={() => {}}
            onFilterChange={() => {}}
            onConnect={() => setWalletOpen(true)}
          />

          <div className="lg:ml-56">
            <Header onConnect={() => setWalletOpen(true)} onSearchClick={() => setCommandOpen(true)} />

            <main className="mx-auto max-w-2xl px-4 pb-20 pt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href="/community"
                  className="mb-4 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-primary"
                >
                  <ArrowLeft size={14} />
                  Back to community
                </Link>

                <div className="mb-6">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Submit a project
                  </h1>
                  <p className="mt-1 text-sm text-foreground/60">
                    Paste a Solana DexScreener link and we&apos;ll pull the token details. All submissions are reviewed before listing.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm sm:p-6">
                  <SubmissionForm />
                </div>

                <p className="mt-4 text-center text-xs text-foreground/40">
                  Submissions are public and subject to admin review. No spam, please.
                </p>
              </motion.div>
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
