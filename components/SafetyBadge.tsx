"use client";

import { SafetyBreakdown } from "@/types/game";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { Check, X } from "lucide-react";

interface SafetyBadgeProps {
  score: number;
  breakdown?: SafetyBreakdown[];
  size?: "sm" | "md";
}

export function SafetyBadge({ score, breakdown, size = "md" }: SafetyBadgeProps) {
  const isHigh = score >= 80;
  const isMedium = score >= 60;

  const colorClasses = isHigh
    ? "border-lime/30 bg-lime/10 text-lime"
    : isMedium
    ? "border-cyan-400/30 bg-cyan-950/30 text-cyan-400"
    : "border-red-500/30 bg-red-950/30 text-red-400";

  return (
    <Tooltip
      content={
        <div className="space-y-1.5">
          <p className="font-semibold text-foreground">Safety Score: {score}/100</p>
          {breakdown ? (
            <div className="space-y-1">
              {breakdown.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between gap-2 ${
                    item.passed ? "text-lime" : "text-foreground/40"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.passed ? <Check size={10} /> : <X size={10} />}
                    {item.label}
                  </span>
                  <span className="font-mono text-[10px]">+{item.points}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-foreground/60">Score not available.</p>
          )}
        </div>
      }
    >
      <Badge
        variant="outline"
        className={`cursor-help ${colorClasses} ${size === "sm" ? "px-1.5 py-0 text-[10px]" : ""}`}
      >
        Safety {score}
      </Badge>
    </Tooltip>
  );
}
