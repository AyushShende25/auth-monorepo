import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}
