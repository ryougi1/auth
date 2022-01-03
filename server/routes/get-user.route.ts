import { Request, Response } from "express";
import { db } from "../database/database";
// import { sessionStore } from "../database/session-store";

export function getUser(req: Request, res: Response) {
  // const sessionId = req.cookies["SESSIONID"];
  // const user = sessionStore.getUserBySessionId(sessionId);

  const user = db.findUserById(req["userId"]);
  if (user) {
    res.status(200).json({ email: user.email, id: user.id });
  } else {
    res.sendStatus(204);
  }
}
