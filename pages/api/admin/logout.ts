import type { NextApiRequest, NextApiResponse } from "next";
import { clearAdminSession } from "@/lib/admin";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  clearAdminSession(res);
  return res.status(200).json({ success: true });
}
