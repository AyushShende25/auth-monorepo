import { redisClient } from "@/config/redisClient";

const generateresetKey = (token: string) => {
  return `forgot-password:${token}`;
};

export const setResetToken = async (userId: string, token: string) => {
  const key = generateresetKey(token);
  await redisClient.set(key, userId, { EX: 60 * 10 });
};

export const getResetToken = async (token: string) => {
  const key = generateresetKey(token);
  return await redisClient.get(key);
};

export const deleteResetToken = async (token: string) => {
  const key = generateresetKey(token);
  await redisClient.del(key);
};
