import { Request, Response } from "express";
import { db } from "../database/database";
import { createCsrfToken, createSessionToken } from "../security-utils";
import { User } from "../user";
import * as argon2 from "argon2";

export function login(req: Request, res: Response) {
  const credentials = req.body;

  const user = db.findUserByEmail(credentials.email);

  if (!user) {
    res.sendStatus(403);
  } else {
    loginAndBuildResponse(credentials, user, res);
  }
}

async function loginAndBuildResponse(
  credentials: any,
  user: User,
  res: Response
) {
  try {
    const sessionToken = await attemptLogin(credentials, user);
    const csrfToken = await createCsrfToken(sessionToken);

    console.log("Login successful");
    res.cookie("SESSIONID", sessionToken, { httpOnly: true, secure: true });
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({ id: user.id, email: user.email });
  } catch (err) {
    console.log("Login failed:", err);
    res.sendStatus(403);
  }
}

async function attemptLogin(credentials: any, user: User) {
  const isPasswordValid = await argon2.verify(
    user.passwordDigest,
    credentials.password
  );

  if (!isPasswordValid) {
    throw new Error("Password Invalid");
  }

  return createSessionToken(user.id.toString());
}
