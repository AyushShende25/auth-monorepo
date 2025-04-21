import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { signupService } from "@/modules/auth/auth.service";
import type { SignupInput } from "@auth-monorepo/shared/schema/auth";

export const signupHandler = async (req: Request<{}, {}, SignupInput>, res: Response) => {
  await signupService(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "User registered successfully. Check your email to verify your account.",
  });
};
