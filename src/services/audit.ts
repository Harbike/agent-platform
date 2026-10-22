import { Request } from "express";
import { Pool, PoolClient } from "pg";

/** Pass the transaction client so the log row commits or rolls back with the change. */
export async function audit(
  db: Pool | PoolClient,
  req: Request,
  action: string,
  entityType: string,
  entityId: string | null,
  details: Record<string, unknown> = {}
) {
  await db.query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, change_details, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [req.user?.id ?? null, action, entityType, entityId, JSON.stringify(details), req.ip ?? null]
  );
}
