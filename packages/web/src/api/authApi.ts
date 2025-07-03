import { api } from "@/api/axiosInstance";
import type { User } from "@/constants/types";
import type { LoginInput, SignupInput, VerifyEmailInput } from "@auth-monorepo/shared/schema/auth";
import { queryOptions } from "@tanstack/react-query";

export const authApi = {
  signup: async (credentials: SignupInput) => {
    const res = await api.post("/auth/signup", credentials);
    return res.data;
  },
  login: async (credentials: LoginInput) => {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },
  verifyEmail: async (data: VerifyEmailInput) => {
    const res = await api.post("/auth/verify-email", data);
    return res.data;
  },
  getMe: async (): Promise<User | null> => {
    try {
      const res = await api.get("/users/me");
      return res.data.data;
    } catch (error) {
      return null;
    }
  },
  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },
  refreshAccessToken: async () => {
    const res = await api.post("/auth/refresh");
    return res.data;
  },
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errMessage = error.response.data.errors[0].message as string;
    if (errMessage.includes("not logged in") && !originalRequest._retry) {
      originalRequest._retry = true;
      await authApi.refreshAccessToken();
      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: authApi.getMe,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
