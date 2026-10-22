import { Request, Response, NextFunction } from "express";
import { HttpError } from "../library/http";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ error: "Malformed JSON" });
    return;
  }
  switch (err?.code) {
    case "23505": // unique violation
    case "23P01": // exclusion violation (overlapping history)
      res.status(409).json({ error: "Conflict: duplicate or overlapping record" }); return;
    case "23503": // foreign key
      res.status(400).json({ error: "Invalid reference" }); return;
    case "23514": // check
    case "22003": // numeric out of range
    case "22P02": // bad text representation
      res.status(400).json({ error: "Invalid value" }); return;
    case "P0001": // RAISE EXCEPTION from our triggers (messages are written for clients)
      res.status(400).json({ error: err.message }); return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
