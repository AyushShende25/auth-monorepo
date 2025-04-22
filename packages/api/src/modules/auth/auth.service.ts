import { BadRequestError, ServiceUnavailableError } from "@/errors";
import { addEmailToQueue } from "@/jobs/email/email.queue";
import { createUser, getUserByEmail, verifyUser } from "@/modules/auth/auth.dal";
import { generateVerificationCode, hashPassword } from "@/modules/auth/auth.utils";
import * as verificationCodeStorage from "@/redis/verificationCodeStorage";
import Logger from "@/utils/logger";
import type { SignupInput, VerifyEmailInput } from "@auth-monorepo/shared/schema/auth";

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
