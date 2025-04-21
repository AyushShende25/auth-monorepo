import { type Job, Worker } from "bullmq";

import { redisConnection } from "@/config/queue";
import { type EmailJobData, emailQueueName } from "@/jobs/email/email.queue";
import Email from "@/jobs/email/email.service";
import Logger from "@/utils/logger";

const queueWorker = new Worker(
  emailQueueName,
  async (job: Job<EmailJobData>) => {
    const { email, firstname, emailVerificationCode } = job.data;

    const emailService = new Email({ firstname, to: email });

    if (job.name === "verification") {
      await emailService.sendVerificationCode(emailVerificationCode as string);
    } else if (job.name === "welcome") {
      await emailService.sendWelcome();
    }
  },
  {
    connection: redisConnection,
  },
);

queueWorker.on("error", (err) => {
  Logger.error(err);
});
