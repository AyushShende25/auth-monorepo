import { Router } from "express";

import { Authenticate } from "@/middlewares/authenticate.middleware";
import { validate } from "@/middlewares/validateRequest.middleware";
import {
  loginHandler,
  logoutHandler,
  refreshTokensHandler,
  signupHandler,
  verifyEmailHandler,
} from "@/modules/auth/auth.controller";
import { loginSchema, signupSchema, verifyEmailSchema } from "@auth-monorepo/shared/schema/auth";

const router: Router = Router();

router.post("/signup", validate(signupSchema), signupHandler);

router.post("/verify-email", validate(verifyEmailSchema), verifyEmailHandler);

router.post("/login", validate(loginSchema), loginHandler);

router.post("/refresh", refreshTokensHandler);

router.post("/logout", Authenticate, logoutHandler);

export default router;
