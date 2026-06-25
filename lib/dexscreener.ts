export interface DexScreenerPair {
  chainId: string;
  url: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  info?: {
    imageUrl?: string;
    header?: string;
    websites?: { url: string; label?: string }[];
    socials?: { type: string; url: string }[];
  };
}

interface DexScreenerPairsResponse {
  schemaVersion?: string;
  pairs?: DexScreenerPair[];
}

export async function fetchDexScreenerPair(
  identifier: string
): Promise<DexScreenerPair | null> {
  // Try resolving identifier as a pair address first.
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/solana/${identifier}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (res.ok) {
      const json: DexScreenerPairsResponse = await res.json();
      if (Array.isArray(json.pairs) && json.pairs.length > 0) {
        return json.pairs[0];
      }
    }
  } catch {
    // Fall through to token lookup.
  }

  // Fallback: resolve identifier as a token mint address.
  try {
    const res = await fetch(
      `https://api.dexscreener.com/tokens/v1/solana/${identifier}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (res.ok) {
      const pairs: DexScreenerPair[] = await res.json();
      if (pairs.length > 0) return pairs[0];
    }
  } catch {
    // Ignore network errors; let caller handle missing pair.
  }

  return null;
}
