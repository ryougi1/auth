import { Request, Response } from "express";
import { sessionStore } from "../database/session-store";

export function getUser(req: Request, res: Response) {
  const sessionId = req.cookies["SESSIONID"];
  const user = sessionStore.getUserBySessionId(sessionId);
  if (user) {
    res.status(200).json(user);
  } else {
    res.sendStatus(204);
  }
}
