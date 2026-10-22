import bcrypt from "bcryptjs";
import { pool } from "../db/pool";
import { withTx } from "../db/tx";

// Usage: npm run seed:admin -- admin@example.com 'StrongPassword1' "Full Name"
async function main() {
  const [email, password, name = "Super Admin"] = process.argv.slice(2);
  if (!email || !password || password.length < 8) throw new Error("Usage: seed:admin <email> <password(8+)> [name]");
  const hash = await bcrypt.hash(password, 12);
  await withTx(async (c) => {
    const p = await c.query("INSERT INTO people (full_name) VALUES ($1) RETURNING id", [name]);
    const u = await c.query(
      "INSERT INTO users (person_id, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [p.rows[0].id, email.trim().toLowerCase(), hash]);
    const r = await c.query(
      "INSERT INTO user_roles (user_id, role_id) SELECT $1, id FROM roles WHERE name = 'super_admin'",
      [u.rows[0].id]);
    if (r.rowCount !== 1) throw new Error("Role 'super_admin' missing. Run db/seed.sql first.");
  });
  console.log("Super admin created:", email);
  await pool.end();
}
main().catch((e) => { console.error(e.message); process.exit(1); });
