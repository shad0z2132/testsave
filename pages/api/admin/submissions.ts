import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!requireAdmin(req, res)) return;

  if (req.method === "GET") {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from("project_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return res.status(200).json(data ?? []);
    } catch (err) {
      console.error("[/api/admin/submissions] GET error:", err);
      return res.status(500).json({ error: "Failed to load submissions" });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { id, status } = req.body;

      if (!id || !status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid id or status" });
      }

      const { data, error } = await getSupabaseAdmin()
        .from("project_submissions")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    } catch (err) {
      console.error("[/api/admin/submissions] PATCH error:", err);
      return res.status(500).json({ error: "Failed to update submission" });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  return res.status(405).json({ error: "Method not allowed" });
}
