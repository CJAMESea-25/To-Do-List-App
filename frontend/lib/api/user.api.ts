import { apiRequest } from "./client";

export const getMe = () =>
  apiRequest<{ username: string }>("/api/auth/me", { auth: true });

export const updateUsername = (payload: { username: string }) =>
  apiRequest<{ message: string }>("/api/auth/username", {
    method: "PATCH",
    auth: true,
    body: payload,
  });
