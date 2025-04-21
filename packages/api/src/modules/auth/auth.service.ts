import { BadRequestError, ServiceUnavailableError } from "@/errors";
import { addEmailToQueue } from "@/jobs/email/email.queue";
import { createUser, getUserByEmail } from "@/modules/auth/auth.dal";
import { generateVerificationCode, hashPassword } from "@/modules/auth/auth.utils";
import * as verificationCodeStorage from "@/redis/verificationCodeStorage";
import Logger from "@/utils/logger";
import type { SignupInput } from "@auth-monorepo/shared/schema/auth";

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
