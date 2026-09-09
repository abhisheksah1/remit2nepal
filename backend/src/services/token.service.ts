import crypto from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import argon2 from "argon2";
import { env } from "../config/env.js";
import type { RoleName } from "../constants/roles.js";

export interface AccessTokenPayload {
  sub: string;
  userId: string;
  fullName: string;
  role: RoleName;
  permissions: string[];
  mustChangePassword: boolean;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as SignOptions);
}

export function signRefreshToken(userId: string, jti: string): string {
  return jwt.sign({ sub: userId, jti } satisfies RefreshTokenPayload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN
  } as SignOptions);
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}

export async function hashSecret(value: string): Promise<string> {
  return argon2.hash(value);
}

export async function verifySecret(hash: string, value: string): Promise<boolean> {
  return argon2.verify(hash, value);
}

export function randomToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}
