import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
  sub: string;
  role: "admin" | "customer";
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(
    payload,
    env.jwtSecret.secret as jwt.Secret,
    {
      expiresIn: env.jwtSecret.expiresIn,
    } as jwt.SignOptions,
  );
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret.secret as jwt.Secret) as JwtPayload;
}
