
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { pool } from "./db/pool";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({ status: "ok" });
  } catch {
    res.status(503).json({
      status: "error",
      message: "Database connection unavailable",
    });
  }
});
