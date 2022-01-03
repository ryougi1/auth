import { Request, Response } from "express";
import { db } from "../database/database";
// import { sessionStore } from "../database/session-store";

export function readAllLessons(req: Request, res: Response) {
  // const sessionId = req.cookies["SESSIONID"];
  // const isSessionValid = sessionStore.isSessionValid(sessionId);
  // if (!isSessionValid) {
  //   res.sendStatus(403);
  // } else {
  //   res.status(200).json({ lessons: db.readAllLessons() });
  // }

  return res.status(200).json({ lessons: db.readAllLessons() });
}
