import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getVoterHash } from "@/lib/voter";

const COOLDOWN_MINUTES = 60;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { submission_id } = req.body;

    if (
      !submission_id ||
      typeof submission_id !== "string" ||
      !UUID_RE.test(submission_id)
    ) {
      return res.status(400).json({ error: "A valid submission ID is required" });
    }

    // Make sure the target submission exists and is open for voting.
    const { data: submission, error: submissionError } = await getSupabaseAdmin()
      .from("project_submissions")
      .select("id, status")
      .eq("id", submission_id)
      .eq("status", "pending")
      .single();

    if (submissionError || !submission) {
      return res
        .status(400)
        .json({ error: "Submission not found or voting is closed" });
    }

    const voterHash = getVoterHash(req);

    // Check the last vote time for this voter + submission.
    const { data: existingVote, error: fetchError } = await getSupabaseAdmin()
      .from("votes")
      .select("last_voted_at")
      .eq("submission_id", submission_id)
      .eq("voter_hash", voterHash)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows found, which is expected for first-time voters.
      throw fetchError;
    }

    if (existingVote) {
      const lastVote = new Date(existingVote.last_voted_at).getTime();
      const nextVoteTime = lastVote + COOLDOWN_MINUTES * 60 * 1000;
      const now = Date.now();

      if (now < nextVoteTime) {
        const secondsRemaining = Math.ceil((nextVoteTime - now) / 1000);
        return res.status(429).json({
          error: "You can vote again soon",
          secondsRemaining,
        });
      }
    }

    // Upsert vote record and increment submission vote count.
    const { error: voteError } = await getSupabaseAdmin().from("votes").upsert(
      {
        submission_id,
        voter_hash: voterHash,
        last_voted_at: new Date().toISOString(),
      },
      { onConflict: "submission_id,voter_hash" }
    );

    if (voteError) throw voteError;

    const { data: updated, error: incError } = await getSupabaseAdmin().rpc(
      "increment_votes",
      { row_id: submission_id }
    );

    if (incError) throw incError;

    return res.status(200).json({ success: true, votes_count: updated });
  } catch (err) {
    console.error("[/api/vote] error:", err);
    return res.status(500).json({ error: "Failed to register vote" });
  }
}
