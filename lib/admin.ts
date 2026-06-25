import { NextApiRequest, NextApiResponse } from "next";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_COOKIE = "savepoint_admin_session";

export function isAdminSession(req: NextApiRequest): boolean {
  return req.cookies[SESSION_COOKIE] === ADMIN_PASSWORD;
}

export function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  if (!ADMIN_PASSWORD) {
    res.status(500).json({ error: "Admin password not configured" });
    return false;
  }

  if (!isAdminSession(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  return true;
}

export function setAdminSession(res: NextApiResponse, password: string): boolean {
  if (password !== ADMIN_PASSWORD) return false;

  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${ADMIN_PASSWORD}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );
  return true;
}

export function clearAdminSession(res: NextApiResponse): void {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}
