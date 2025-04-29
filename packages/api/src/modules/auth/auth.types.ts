import type { usersTable } from "@/db/schema/users";

export type ActiveUserData = {
  sub: string;
  email: string;
};

export type RefreshTokenPayload = {
  sub: string;
  refreshTokenId: string;
};

export type UserWithoutPassword = Omit<typeof usersTable.$inferSelect, "password">;
