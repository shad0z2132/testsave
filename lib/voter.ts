import { NextApiRequest } from "next";
import crypto from "crypto";

export function getVoterHash(req: NextApiRequest): string {
  const ip =
    (Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"]) ||
    req.socket.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"] || "unknown";
  const raw = `${ip.trim()}|${userAgent}`;

  return crypto.createHash("sha256").update(raw).digest("hex");
}
