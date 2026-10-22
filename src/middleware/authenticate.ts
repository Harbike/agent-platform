import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { pool } from "../db/pool";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing token" });
    return;
  }

  let sub: string;
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret, { algorithms: ["HS256"] });
    if (typeof payload === "string" || typeof payload.sub !== "string" || !/^\d+$/.test(payload.sub)) throw new Error();
    sub = payload.sub;
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  // Re-check the account on every request so deactivation takes effect immediately.
  const { rows } = await pool.query(
    "SELECT id, person_id, email FROM users WHERE id = $1 AND is_active", [sub]
  );
  if (!rows[0]) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  req.user = { id: rows[0].id, personId: rows[0].person_id, email: rows[0].email };
  next();
}
