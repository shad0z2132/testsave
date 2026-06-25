import type { NextApiRequest, NextApiResponse } from "next";
import { setAdminSession } from "@/lib/admin";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body;

  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Password is required" });
  }

  if (!setAdminSession(res, password)) {
    return res.status(401).json({ error: "Invalid password" });
  }

  return res.status(200).json({ success: true });
}
