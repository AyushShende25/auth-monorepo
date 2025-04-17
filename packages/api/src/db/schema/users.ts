import { boolean, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["user", "admin"]);

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }),
  email: varchar().notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: rolesEnum().default("user"),
  isVerified: boolean().default(false),
  createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});
