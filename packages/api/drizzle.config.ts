import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.POSTGRES_HOST as string,
    port: Number.parseInt(process.env.POSTGRES_PORT as string),
    database: process.env.POSTGRES_DB as string,
    user: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string,
    ssl: false,
  },
});
