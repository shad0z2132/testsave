import { getSupabaseAdmin } from "./supabase";

const DEFAULT_WINDOW_MINUTES = 60;

export async function countRecentSubmissions(
  submitterHash: string,
  windowMinutes = DEFAULT_WINDOW_MINUTES
): Promise<number> {
  const since = new Date(
    Date.now() - windowMinutes * 60 * 1000
  ).toISOString();

  const { count, error } = await getSupabaseAdmin()
    .from("project_submissions")
    .select("*", { count: "exact", head: true })
    .eq("submitter_hash", submitterHash)
    .gte("created_at", since);

  if (error) throw error;
  return count ?? 0;
}
