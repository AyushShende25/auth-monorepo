export type EmailJobType = "verification" | "welcome" | "reset";

export type EmailJobData = {
  email: string;
  firstname: string;
  emailVerificationCode?: string;
  resetLink?: string;
};
