import fs from "node:fs/promises";
import path from "node:path";
import { pool } from "./pool";

// Applies every migrations/NNN_name.sql that has not been applied yet, in order.
// Each file runs in its own transaction: it fully applies or not at all.
const dir = path.resolve(process.cwd(), "migrations");

async function main() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename   TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`);
    await client.query("SELECT pg_advisory_lock(727274)"); // one runner at a time

    const done = new Set(
      (await client.query("SELECT filename FROM schema_migrations")).rows.map((r) => r.filename)
    );
    const files = (await fs.readdir(dir)).filter((f) => /^\d+_.+\.sql$/.test(f)).sort();

    let applied = 0;
    for (const file of files) {
      if (done.has(file)) continue;
      console.log("Applying", file);
      const sql = await fs.readFile(path.join(dir, file), "utf8");
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw new Error(`${file}: ${(e as Error).message}`);
      }
      applied++;
    }
    console.log(applied ? `Done. Applied ${applied} migration(s).` : "Database is already up to date.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("Migration failed:", e.message);
  process.exit(1);
});