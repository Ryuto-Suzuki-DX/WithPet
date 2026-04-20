/*
 * tokenの保存・取得・削除をする場所
 */

const ACCESS_TOKEN_KEY = "withpet_access_token";

export function saveAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}