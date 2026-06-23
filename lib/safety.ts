import { SafetyBreakdown } from "@/types/game";

export interface SafetySignals {
  jupiterVerified: boolean;
  mintAuthorityRevoked: boolean | null;
  freezeAuthorityRevoked: boolean | null;
  top10HoldersBelow30: boolean | null;
  tokenAgeAbove7Days: boolean;
  hasWebsiteAndX: boolean;
  gamingKeywordMatch: boolean;
  liquidityAbove5k: boolean;
}

export const SAFETY_THRESHOLD = 40;

export function computeSafetyScore(signals: SafetySignals): {
  score: number;
  breakdown: SafetyBreakdown[];
} {
  const checks: SafetyBreakdown[] = [
    { label: "Verified on Jupiter", passed: signals.jupiterVerified, points: 20 },
    { label: "Mint authority revoked", passed: signals.mintAuthorityRevoked ?? false, points: 20 },
    { label: "Freeze authority revoked", passed: signals.freezeAuthorityRevoked ?? false, points: 15 },
    { label: "Top 10 holders below 30%", passed: signals.top10HoldersBelow30 ?? false, points: 10 },
    { label: "Token age above 7 days", passed: signals.tokenAgeAbove7Days, points: 10 },
    { label: "Website and X present", passed: signals.hasWebsiteAndX, points: 10 },
    { label: "Gaming keywords match", passed: signals.gamingKeywordMatch, points: 10 },
    { label: "Liquidity above $5k", passed: signals.liquidityAbove5k, points: 5 },
  ];

  const score = checks.reduce((acc, check) => acc + (check.passed ? check.points : 0), 0);

  return { score, breakdown: checks };
}

export function passesSafetyThreshold(score: number): boolean {
  return score >= SAFETY_THRESHOLD;
}
