import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getVoterHash } from "@/lib/voter";
import { countRecentSubmissions } from "@/lib/rate-limit";
import { isDexScreenerUrl, extractDexScreenerIdentifier } from "@/lib/validation";
import { fetchDexScreenerPair } from "@/lib/dexscreener";

const SUBMISSIONS_PER_HOUR = 5;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from("project_submissions")
        .select(
          "id, name, symbol, token_mint, dex_url, image_url, website, description, status, votes_count, created_at"
        )
        .eq("status", "pending")
        .order("votes_count", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return res.status(200).json(data ?? []);
    } catch (err) {
      console.error("[/api/submissions] GET error:", err);
      return res.status(500).json({ error: "Failed to load submissions" });
    }
  }

  if (req.method === "POST") {
    try {
      const { dex_url } = req.body;

      if (!dex_url || typeof dex_url !== "string") {
        return res.status(400).json({ error: "DexScreener link is required" });
      }

      if (!isDexScreenerUrl(dex_url)) {
        return res.status(400).json({
          error: "Only Solana DexScreener links are accepted",
        });
      }

      const identifier = extractDexScreenerIdentifier(dex_url);
      if (!identifier) {
        return res.status(400).json({ error: "Invalid DexScreener link" });
      }

      const pair = await fetchDexScreenerPair(identifier);
      if (!pair) {
        return res.status(400).json({
          error:
            "Could not find a Solana pair for that link. Make sure the token/pair exists on DexScreener.",
        });
      }

      const submitterHash = getVoterHash(req);
      const recentSubmissions = await countRecentSubmissions(submitterHash);

      if (recentSubmissions >= SUBMISSIONS_PER_HOUR) {
        return res.status(429).json({
          error: `Too many submissions from this device. You can submit up to ${SUBMISSIONS_PER_HOUR} projects per hour.`,
        });
      }

      const { data, error } = await getSupabaseAdmin()
        .from("project_submissions")
        .insert({
          dex_url: pair.url || dex_url.trim(),
          name: pair.baseToken.name,
          symbol: pair.baseToken.symbol,
          token_mint: pair.baseToken.address,
          image_url: pair.info?.imageUrl || null,
          website: pair.info?.websites?.[0]?.url || pair.url || dex_url.trim(),
          description: `${pair.baseToken.symbol} on Solana`,
          submitter_hash: submitterHash,
          status: "pending",
          votes_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    } catch (err) {
      console.error("[/api/submissions] POST error:", err);
      return res.status(500).json({ error: "Failed to submit project" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
