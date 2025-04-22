import { Router } from "express";

import { validate } from "@/middlewares/validateRequest.middleware";
import { signupHandler, verifyEmailHandler } from "@/modules/auth/auth.controller";
import { signupSchema, verifyEmailSchema } from "@auth-monorepo/shared/schema/auth";

const router: Router = Router();

router.post("/signup", validate(signupSchema), signupHandler);

router.post("/verify-email", validate(verifyEmailSchema), verifyEmailHandler);

export default router;
