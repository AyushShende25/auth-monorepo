import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  forgotPasswordService,
  loginService,
  logoutService,
  refreshTokensService,
  resetPasswordService,
  signupService,
  verifyEmailService,
} from "@/modules/auth/auth.service";
import { cookieOptions } from "@/modules/auth/auth.utils";
import type {
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignupInput,
  VerifyEmailInput,
} from "@auth-monorepo/shared/schema/auth";

export const signupHandler = async (req: Request<{}, {}, SignupInput>, res: Response) => {
  await signupService(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "User registered successfully. Check your email to verify your account.",
  });
};

export const verifyEmailHandler = async (req: Request<{}, {}, VerifyEmailInput>, res: Response) => {
  await verifyEmailService(req.body);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Email successfully verified. You can now log in.",
  });
};

export const loginHandler = async (req: Request<{}, {}, LoginInput>, res: Response) => {
  const { access_token, refresh_token } = await loginService(req.body);

  res.cookie("access_token", access_token, {
    ...cookieOptions,
    expires: new Date(Date.now() + 1000 * 60 * 1),
  });
  res.cookie("refresh_token", refresh_token, {
    ...cookieOptions,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  res.status(200).json({ success: true, message: "User login success" });
};

export const refreshTokensHandler = async (req: Request, res: Response) => {
  const { access_token, refresh_token } = await refreshTokensService(req);

  res.cookie("access_token", access_token, {
    ...cookieOptions,
    expires: new Date(Date.now() + 1000 * 60 * 1),
  });
  res.cookie("refresh_token", refresh_token, {
    ...cookieOptions,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  res.status(StatusCodes.OK).json({ success: true, message: "new tokens generation successfull" });
};

export const logoutHandler = async (req: Request, res: Response) => {
  await logoutService(req.userId as string);

  res.clearCookie("access_token", { ...cookieOptions, expires: new Date(0) });
  res.clearCookie("refresh_token", { ...cookieOptions, expires: new Date(0) });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "user logged out successfully",
  });
};

export const forgotPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
) => {
  await forgotPasswordService(req.body);

  res.status(StatusCodes.OK).json({ success: true, message: "Check your email for reset link." });
};

export const resetPasswordHandler = async (
  req: Request<{}, {}, ResetPasswordInput["body"], ResetPasswordInput["query"]>,
  res: Response,
) => {
  await resetPasswordService({ password: req.body.newPassword, token: req.query.token });

  res.status(StatusCodes.OK).json({ success: true, message: "Password reset successful" });
};
