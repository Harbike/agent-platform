import { Request } from "express";
import { z } from "zod";

export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}

// bigint ids arrive as strings; never convert them to JS numbers.
export const id = z.string().regex(/^\d{1,18}$/, "Invalid id");

export function parse<S extends z.ZodType>(schema: S, data: unknown): z.infer<S> {
  const r = schema.safeParse(data);
  if (!r.success) throw new HttpError(400, "Invalid input", r.error.issues);
  return r.data;
}

export function paging(req: Request) {
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  return { limit, offset };
}