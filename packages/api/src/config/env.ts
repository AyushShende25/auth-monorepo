import z from "zod";

import Logger from "@/utils/logger";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DATABASE_URL: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().default(6379),
  CLIENT_URL: z.string(),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  Logger.error("Invalid environment variables");
  Logger.error(envVars.error.format());
  process.exit(1);
}

export const env = envVars.data;
