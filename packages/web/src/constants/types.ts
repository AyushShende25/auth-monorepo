export interface ApiErrorResponse {
  success: false;
  message?: string;
  errors?: { message: string; field?: string }[];
}
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
};
