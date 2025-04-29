import { Router } from "express";

import { validate } from "@/middlewares/validateRequest.middleware";
import { loginHandler, signupHandler, verifyEmailHandler } from "@/modules/auth/auth.controller";
import { loginSchema, signupSchema, verifyEmailSchema } from "@auth-monorepo/shared/schema/auth";

const router: Router = Router();

router.post("/signup", validate(signupSchema), signupHandler);

router.post("/verify-email", validate(verifyEmailSchema), verifyEmailHandler);

router.post("/login", validate(loginSchema), loginHandler);

export default router;
