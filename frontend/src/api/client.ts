/*
 * API通信の共通エンジン
 */
import { getAccessToken, removeAccessToken } from "../lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type ApiClientOptions = RequestInit & {
  auth?: boolean;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return {} as T;
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { auth = true, headers, ...restOptions } = options;

  const token = auth ? getAccessToken() : null;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    cache: "no-store",
  });

  const data = await parseResponse<T | { message?: string }>(response);

  if (response.status === 401) {
    removeAccessToken();
    throw new Error("認証に失敗しました。再度ログインしてください。");
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? data.message || "API request failed"
        : "API request failed";

    throw new Error(message);
  }

  return data as T;
}