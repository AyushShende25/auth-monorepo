import { Router } from "express";

import { validate } from "@/middlewares/validateRequest.middleware";
import { signupHandler } from "@/modules/auth/auth.controller";
import { signupSchema } from "@auth-monorepo/shared/schema/auth";

const router: Router = Router();

router.post("/signup", validate(signupSchema), signupHandler);

export default router;
