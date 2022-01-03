import * as fs from "fs";
import * as jwt from "jsonwebtoken";
const nodeUtil = require("util");
const nodeCrypto = require("crypto");

export const randomBytes = nodeUtil.promisify(nodeCrypto.randomBytes);
export const signJwt = nodeUtil.promisify(jwt.sign);

const RSA_PRIVATE_KEY = fs.readFileSync("./rsa_keys/private.key");
const RSA_PUBLIC_KEY = fs.readFileSync("./rsa_keys/public.key");
const SESSION_DURATION = 30;

export async function createSessionToken(userId: string) {
  return jwt.sign({}, RSA_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: SESSION_DURATION,
    subject: userId,
  });
}

export async function decodeJwt(token: string) {
  const payload = await jwt.verify(token, RSA_PUBLIC_KEY);
  console.log("Decoded JWT payload:", payload);
  return payload;
}
