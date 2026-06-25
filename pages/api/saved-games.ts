import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { wallet } = req.query;
    if (!wallet || typeof wallet !== "string") {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    try {
      const { data, error } = await getSupabaseAdmin()
        .from("saved_games")
        .select("game_id")
        .eq("wallet", wallet)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return res.status(200).json((data ?? []).map((row) => row.game_id));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[/api/saved-games] GET error:", err);
      return res.status(500).json({ error: "Failed to load saved games", details: message });
    }
  }

  if (req.method === "POST") {
    const { wallet, game_id } = req.body;
    if (!wallet || typeof wallet !== "string" || !game_id || typeof game_id !== "string") {
      return res.status(400).json({ error: "Wallet and game_id are required" });
    }

    try {
      const { error } = await getSupabaseAdmin()
        .from("saved_games")
        .upsert({ wallet, game_id }, { onConflict: "wallet,game_id" });

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[/api/saved-games] POST error:", err);
      return res.status(500).json({ error: "Failed to save game", details: message });
    }
  }

  if (req.method === "DELETE") {
    const { wallet, game_id } = req.body;
    if (!wallet || typeof wallet !== "string" || !game_id || typeof game_id !== "string") {
      return res.status(400).json({ error: "Wallet and game_id are required" });
    }

    try {
      const { error } = await getSupabaseAdmin()
        .from("saved_games")
        .delete()
        .eq("wallet", wallet)
        .eq("game_id", game_id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[/api/saved-games] DELETE error:", err);
      return res.status(500).json({ error: "Failed to remove saved game", details: message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}
