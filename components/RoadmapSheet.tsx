"use client";

import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Rocket } from "lucide-react";
import { RoadmapPhases } from "./RoadmapPhases";

interface RoadmapSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoadmapSheet({ open, onOpenChange }: RoadmapSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full border-border bg-card p-0 sm:max-w-lg overflow-y-auto">
        <div className="p-6">
          <SheetHeader className="p-0 mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              <Rocket size={14} />
              Building in public
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <SheetTitle className="text-2xl font-bold">Development Roadmap</SheetTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <SheetDescription className="text-sm text-muted-foreground">
                SavePoint is evolving from a game aggregator into a full-stack discovery and trading platform for Solana gaming.
              </SheetDescription>
            </motion.div>
          </SheetHeader>

          <RoadmapPhases revealedCount={1} animate={false} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
