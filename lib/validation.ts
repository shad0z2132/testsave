const URL_MAX_LENGTH = 512;
const SOLANA_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const DEXSCREENER_HOSTS = new Set(["dexscreener.com", "www.dexscreener.com"]);

export const VALIDATION_LIMITS = {
  name: { min: 1, max: 80 },
  description: { min: 10, max: 1000 },
  genre: { min: 0, max: 40 },
  submittedBy: { min: 0, max: 80 },
  url: { max: URL_MAX_LENGTH },
  tokenMint: { max: 44 },
} as const;

export function isSolanaAddress(value: string): boolean {
  if (!value) return false;
  return SOLANA_ADDRESS_RE.test(value.trim());
}

export function isSolanaMint(value: string): boolean {
  return isSolanaAddress(value);
}

export function isDexScreenerUrl(value: string): boolean {
  if (!value || value.length > URL_MAX_LENGTH) return false;

  const normalized = normalizeUrl(value);
  try {
    const url = new URL(normalized);
    if (!DEXSCREENER_HOSTS.has(url.hostname.toLowerCase())) return false;

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return false;

    const [chain, identifier] = parts;
    return (
      chain.toLowerCase() === "solana" && isSolanaAddress(identifier)
    );
  } catch {
    return false;
  }
}

export function extractDexScreenerIdentifier(value: string): string | null {
  const normalized = normalizeUrl(value);
  try {
    const url = new URL(normalized);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    const [chain, identifier] = parts;
    if (chain.toLowerCase() !== "solana" || !isSolanaAddress(identifier)) {
      return null;
    }
    return identifier;
  } catch {
    return null;
  }
}

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function isValidHttpUrl(value: string): boolean {
  if (!value) return false;
  if (value.length > URL_MAX_LENGTH) return false;

  const normalized = normalizeUrl(value);
  try {
    const url = new URL(normalized);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}
