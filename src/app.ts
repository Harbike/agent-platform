import express from "express";
import helmet from "helmet";
import cors from "cors";
import { pool } from "./db/pool";
import { authRouter } from "./routes/auth";
import { authenticate } from "./middleware/authenticate";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);   // public: login
app.use(authenticate);          // everything below needs a valid token

app.get("/me", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT DISTINCT p.name FROM user_roles ur
       JOIN role_permissions rp ON rp.role_id = ur.role_id
       JOIN permissions p ON p.id = rp.permission_id
      WHERE ur.user_id = $1 ORDER BY p.name`, [req.user!.id]);
  res.json({ ...req.user, permissions: rows.map((r) => r.name) });
});

app.use(errorHandler);          // must be last
