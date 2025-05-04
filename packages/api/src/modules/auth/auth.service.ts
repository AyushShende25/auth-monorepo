import type { Request } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/config/env";
import { BadRequestError, ServiceUnavailableError, UnAuthorizedError } from "@/errors";
import { addEmailToQueue } from "@/jobs/email/email.queue";
import { createUser, verifyUser } from "@/modules/auth/auth.dal";
import type { RefreshTokenPayload } from "@/modules/auth/auth.types";
import {
  comparePassword,
  generateTokens,
  generateVerificationCode,
  hashPassword,
} from "@/modules/auth/auth.utils";
import { getUserByEmail, getUserById } from "@/modules/users/users.dal";
import * as refreshTokenIdStorage from "@/redis/refreshTokenIdStorage";
import * as verificationCodeStorage from "@/redis/verificationCodeStorage";
import Logger from "@/utils/logger";
import type { LoginInput, SignupInput, VerifyEmailInput } from "@auth-monorepo/shared/schema/auth";

export const signupService = async (signupInput: SignupInput) => {
  // Check if user already exists
  const existingUser = await getUserByEmail(signupInput.email);
  if (existingUser) {
    throw new BadRequestError("email already in use");
  }

  // generate verification code
  const emailVerificationCode = generateVerificationCode();

  try {
    await addEmailToQueue("verification", {
      email: signupInput.email,
      firstname: signupInput.firstName,
      emailVerificationCode,
    });
  } catch (err) {
    Logger.error("Failed to queue verification email", err);
    throw new ServiceUnavailableError("Email service is down");
  }

  // hash the password
  const hashedPassword = await hashPassword(signupInput.password);

  // Create a new user
  const newUser = await createUser({
    ...signupInput,
    firstName: signupInput.firstName,
    password: hashedPassword,
  });

  // store the verification code
  await verificationCodeStorage.setVerificationCode(newUser.id, emailVerificationCode);
};

export const verifyEmailService = async (verifyEmailInput: VerifyEmailInput) => {
  // Get verification code
  const { verificationCode } = verifyEmailInput;

  // verify the code with the stored code
  const userId = await verificationCodeStorage.getVerificationCode(verificationCode);

  if (!userId) {
    throw new BadRequestError("Invalid or expired verification code");
  }
  // update the user as verified
  const verifiedUser = await verifyUser(userId);

  if (verifiedUser) {
    // delete the verification code from our storage
    await verificationCodeStorage.deleteVerificationCode(verificationCode);

    try {
      // send welcome email
      await addEmailToQueue("welcome", {
        email: verifiedUser.email,
        firstname: verifiedUser.firstName,
      });
    } catch (error) {
      Logger.error("could not send welcome email", error);
    }
  }
};

export const loginService = async (loginInput: LoginInput) => {
  // check if user exists and is verified
  const existingUser = await getUserByEmail(loginInput.email);
  if (!existingUser || !existingUser.isVerified) {
    throw new BadRequestError("Invalid Credentials or user is not verified");
  }
  // verify password
  const isPasswordValid = await comparePassword(loginInput.password, existingUser.password);
  if (!isPasswordValid) {
    throw new UnAuthorizedError("Invalid credentials");
  }
  // generate access and refresh tokens
  const { password, ...safeUser } = existingUser;
  const { access_token, refresh_token } = await generateTokens(safeUser);
  return { access_token, refresh_token, user: safeUser };
};

export const refreshTokensService = async (req: Request) => {
  const refreshToken: string = req.cookies.refresh_token;
  if (!refreshToken) {
    throw new UnAuthorizedError();
  }
  try {
    const { refreshTokenId, sub } = jwt.verify(refreshToken, env.JWT_SECRET) as RefreshTokenPayload;

    const user = await getUserById(sub);
    if (!user) {
      throw new UnAuthorizedError("User does not exist");
    }

    const isValid = await refreshTokenIdStorage.validate(user.id, refreshTokenId);
    if (isValid) {
      await refreshTokenIdStorage.invalidate(user.id);
    } else {
      throw new UnAuthorizedError("Invalid token");
    }
    return await generateTokens(user);
  } catch (error) {
    throw new UnAuthorizedError("Invalid token: Access Denied");
  }
};

export const logoutService = async (userId: string) => {
  await refreshTokenIdStorage.invalidate(userId);
};
