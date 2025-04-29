import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: "first name is required",
      })
      .trim(),
    lastName: z
      .string({
        required_error: "last name is required",
      })
      .trim(),
    email: z
      .string({
        required_error: "Email address is required",
      })
      .email("Invalid email address")
      .trim(),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters")
      .trim(),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    verificationCode: z
      .string({
        required_error: "verification code is required",
      })
      .trim(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email address is required",
      })
      .email("Invalid email address")
      .trim(),
    password: z
      .string({
        required_error: "Password is required",
      })
      .trim(),
  }),
});

export type SignupInput = z.infer<typeof signupSchema>["body"];
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
