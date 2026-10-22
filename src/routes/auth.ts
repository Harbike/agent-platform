import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool } from "../db/pool";
import { env } from "../config/env";
import { audit } from "../services/audit";
import { HttpError, parse } from "../library/http";

export const authRouter = Router();

// Compared against when the email doesn't exist, so both cases take the same time.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

const loginSchema = z.object({
  email: z.string().email().transform((s) => s.trim().toLowerCase()),
  password: z.string().min(1).max(200),
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = parse(loginSchema, req.body);

  const user = (await pool.query(
    "SELECT id, password_hash, is_active FROM users WHERE email = $1", [email]
  )).rows[0];

  const passwordOk = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !user.is_active || !passwordOk) {
    await audit(pool, req, "auth.login_failed", "user", user?.id ?? null, { email });
    throw new HttpError(401, "Invalid credentials"); // same message for every failure
  }

  await pool.query("UPDATE users SET last_login_at = now() WHERE id = $1", [user.id]);
  req.user = { id: user.id, personId: null, email };
  await audit(pool, req, "auth.login", "user", user.id);

  // The token only identifies the user. Permissions are read from the DB on each request.
  const token = jwt.sign({}, env.jwtSecret, {
    subject: user.id,
    algorithm: "HS256",
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
  res.json({ token });
});
