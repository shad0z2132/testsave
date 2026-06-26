"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DustParticles } from "@/components/DustParticles";
import { LeftSidebar } from "@/components/LeftSidebar";
import { SubmissionForm } from "@/components/SubmissionForm";
import { CommandPalette } from "@/components/CommandPalette";
import { SEO } from "@/components/SEO";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function SubmitPage() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <>
      <SEO
        title="Submit a Project · SavePoint"
        description="Submit a Solana game or token to be listed on SavePoint. Community-reviewed and curated for legitimacy."
        path="/submit/"
      />

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

          <LeftSidebar
            activeTab="submit"
            activeFilter="All"
            onTabChange={() => {}}
            onFilterChange={() => {}}
            mobileOpen={mobileSidebarOpen}
            onMobileOpenChange={setMobileSidebarOpen}
          />

          <div className="flex min-h-screen flex-col lg:ml-56">
            <Header
              onSearchClick={() => setCommandOpen(true)}
              onMenuClick={() => setMobileSidebarOpen(true)}
            />

            <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-20 pt-6">
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

                <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-[0_0_40px_rgba(204, 255, 0, 0.06)] sm:p-6">
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
