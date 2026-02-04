import { apiRequest } from "./client";

export interface AuthResponse {
  message: string;
  token?: string;
}

const safeSetToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
};

export const isAuthenticated = () => !!getToken();

export const login = async (username: string, password: string) => {
  const data = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { username, password },
  });

  if (data.token) safeSetToken(data.token);
  return data;
};

export const signup = async (username: string, password: string) => {
  return apiRequest<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: { username, password },
  });
};
