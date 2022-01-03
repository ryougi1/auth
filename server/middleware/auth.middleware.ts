import { NextFunction, Request, Response } from "express";

export function checkIfAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req["userId"]) {
    next();
  } else {
    res.sendStatus(403);
  }
}
