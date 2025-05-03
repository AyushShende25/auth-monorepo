import { eq, getTableColumns } from "drizzle-orm";

import db from "@/db";
import { usersTable } from "@/db/schema/users";

export const getUserByEmail = async (email: string) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  return user ?? null;
};

export const getUserById = async (id: string) => {
  const { password, ...rest } = getTableColumns(usersTable);
  const [user] = await db
    .select({ ...rest })
    .from(usersTable)
    .where(eq(usersTable.id, id));
  return user ?? null;
};
