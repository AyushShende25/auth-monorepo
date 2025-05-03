import { UnAuthorizedError } from "@/errors";
import { getUserById } from "@/modules/users/users.dal";

export const getCurrentUserService = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) throw new UnAuthorizedError();
  return user;
};
