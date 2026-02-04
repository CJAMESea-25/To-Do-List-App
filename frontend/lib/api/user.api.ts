import { apiRequest } from "./client";

export const getMe = () =>
  apiRequest<{ username: string }>("/api/auth/me", { auth: true });
