import { Request, Response } from "express";
import { db } from "../database/database";

export function userInfo(req: any, res: any) {
  const userInfo = req.user;
  console.log("Checking if user exists", userInfo);

  let user = db.findUserByEmail(userInfo.email);
  if (!user) {
    user = db.createUser(userInfo.email, userInfo.sub);
  }
  res.status(200).json({ email: user.email });
}
