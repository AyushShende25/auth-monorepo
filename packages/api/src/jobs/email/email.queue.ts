import { Queue } from "bullmq";

import { defaultQueueOptions, redisConnection } from "@/config/queue";
import Logger from "@/utils/logger";

type EmailJobType = "verification" | "welcome";

export type EmailJobData = {
  email: string;
  firstname: string;
  emailVerificationCode?: string;
};

export const emailQueueName = "emailQueue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueOptions,
});

export const addEmailToQueue = async (jobType: EmailJobType, jobData: EmailJobData) => {
  await emailQueue.add(jobType, jobData);
};

emailQueue.on("error", (err) => {
  Logger.error(err);
});
