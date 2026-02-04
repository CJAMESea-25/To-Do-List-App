const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    auth?: boolean;
    headers?: HeadersInit;
  } = {}
): Promise<T> {
  const { method = "GET", body, auth = false, headers } = options;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(headers || {}),
  };

  if (auth) {
    const token = getToken();
    if (token) (finalHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Safe JSON parsing
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}
