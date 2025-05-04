import { eq } from "drizzle-orm";

import db from "@/db";
import { type InsertUser, usersTable } from "@/db/schema/users";

export const createUser = async (newUser: InsertUser) => {
  const [user] = await db.insert(usersTable).values(newUser).returning();
  return user ?? null;
};

export const verifyUser = async (userId: string) => {
  const [user] = await db
    .update(usersTable)
    .set({ isVerified: true })
    .where(eq(usersTable.id, userId))
    .returning();
  return user ?? null;
};

export const updatePassword = async ({
  newPassword,
  userId,
}: { newPassword: string; userId: string }) => {
  const [user] = await db
    .update(usersTable)
    .set({ password: newPassword })
    .where(eq(usersTable.id, userId))
    .returning();
  return user ?? null;
};
