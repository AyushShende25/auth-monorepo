import { env } from "@/config/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
console.log(env.DATABASE_URL);

const db = drizzle({ client: pool, casing: "snake_case" });

export default db;
