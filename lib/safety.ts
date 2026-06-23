import { SafetyBreakdown } from "@/types/game";

export interface SafetySignals {
  mintAuthorityRevoked: boolean | null;
  freezeAuthorityRevoked: boolean | null;
  top10HoldersBelow30: boolean | null;
  tokenAgeAbove7Days: boolean;
  hasWebsiteAndX: boolean;
  gamingKeywordMatch: boolean;
  liquidityAbove5k: boolean;
  curatedGame: boolean;
  dexscreenerPaid: boolean;
  dexscreenerSocialsUpdated: boolean;
}

export const SAFETY_THRESHOLD = 40;

export function computeSafetyScore(signals: SafetySignals): {
  score: number;
  breakdown: SafetyBreakdown[];
} {
  const checks: SafetyBreakdown[] = [
    { label: "Mint authority revoked", passed: signals.mintAuthorityRevoked ?? false, points: 20 },
    { label: "Freeze authority revoked", passed: signals.freezeAuthorityRevoked ?? false, points: 15 },
    { label: "Top 10 holders below 30%", passed: signals.top10HoldersBelow30 ?? false, points: 10 },
    { label: "Token age above 7 days", passed: signals.tokenAgeAbove7Days, points: 10 },
    { label: "Website and X present", passed: signals.hasWebsiteAndX, points: 10 },
    { label: "Gaming keywords match", passed: signals.gamingKeywordMatch, points: 10 },
    { label: "Liquidity above $5k", passed: signals.liquidityAbove5k, points: 5 },
    { label: "DexScreener paid profile", passed: signals.dexscreenerPaid, points: 5 },
    { label: "DexScreener socials updated", passed: signals.dexscreenerSocialsUpdated, points: 5 },
    { label: "Curated game", passed: signals.curatedGame, points: 15 },
  ];

  const score = checks.reduce((acc, check) => acc + (check.passed ? check.points : 0), 0);

  return { score, breakdown: checks };
}

export function passesSafetyThreshold(score: number): boolean {
  return score >= SAFETY_THRESHOLD;
}
