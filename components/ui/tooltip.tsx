"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, className, side = "top" }: TooltipProps) {
  const sideClasses = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };

  return (
    <div className={cn("group relative inline-flex", className)}>
      {children}
      <div
        className={cn(
          "pointer-events-none absolute z-50 w-56 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          sideClasses[side]
        )}
      >
        <div className="rounded-lg border border-border/60 bg-[#0f0f11] p-2.5 text-xs shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          {content}
        </div>
      </div>
    </div>
  );
}
