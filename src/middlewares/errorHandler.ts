import { NextFunction, Request, Response } from "express";

// Express 5 forwards errors thrown in async handlers here automatically
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // Postgres unique violation (e.g. duplicate email)
  if (err?.code === "23505") {
    return res.status(409).json({ message: "Email already exists" });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
