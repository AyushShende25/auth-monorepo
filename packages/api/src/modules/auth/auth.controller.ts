import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { signupService, verifyEmailService } from "@/modules/auth/auth.service";
import type { SignupInput, VerifyEmailInput } from "@auth-monorepo/shared/schema/auth";

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
