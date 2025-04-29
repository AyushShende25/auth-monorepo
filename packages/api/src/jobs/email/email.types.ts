export type EmailJobType = "verification" | "welcome";

export type EmailJobData = {
  email: string;
  firstname: string;
  emailVerificationCode?: string;
};
