import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "@/config/env";
import type {
  ActiveUserData,
  RefreshTokenPayload,
  UserWithoutPassword,
} from "@/modules/auth/auth.types";
import * as refreshTokenIdStorage from "@/redis/refreshTokenIdStorage";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

export const generatePasswordResetToken = () => {
  return randomUUID();
};

export const comparePassword = async (inputPassword: string, storedPassword: string) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

export const generateTokens = async (user: UserWithoutPassword) => {
  const refreshTokenId = randomUUID();
  const [access_token, refresh_token] = await Promise.all([
    signToken<Partial<ActiveUserData>>(user.id, env.JWT_ACCESS_TOKEN_TTL, {
      email: user.email,
    }),
    signToken<Partial<RefreshTokenPayload>>(user.id, env.JWT_REFRESH_TOKEN_TTL, {
      refreshTokenId,
    }),
  ]);
  await refreshTokenIdStorage.insert(user.id, refreshTokenId);
  return { access_token, refresh_token };
};

export const signToken = async <T>(userId: string, expiresIn: number, payload?: T) => {
  return await jwt.sign(
    {
      sub: userId,
      ...payload,
    },
    env.JWT_SECRET,
    {
      expiresIn,
    },
  );
};

export const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  secure: env.NODE_ENV === "production",
};
