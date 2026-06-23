export type GameStatus = "live" | "beta" | "alpha" | "upcoming";

export interface SafetyBreakdown {
  label: string;
  passed: boolean;
  points: number;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  genre: string;
  status: GameStatus;
  tokenSymbol: string;
  tokenMint?: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  safetyScore: number;
  safetyBreakdown?: SafetyBreakdown[];
  thumbnail: string;
  banner?: string;
  website: string;
  xUrl?: string;
  discordUrl?: string;
  telegramUrl?: string;
  docsUrl?: string;
  playUrl?: string;
  tags: string[];
  trending?: boolean;
}
