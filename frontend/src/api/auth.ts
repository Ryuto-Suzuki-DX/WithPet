/*
 * 認証関連のAPI関数
 */

import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import type { LoginRequest, LoginResponse, MeResponse } from "../types/auth";

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse>(ENDPOINTS.auth.login, {
    method: "POST",
    auth: false,
    body: JSON.stringify(request),
  });
}

export async function logout(): Promise<void> {
  await apiClient<void>(ENDPOINTS.auth.logout, {
    method: "POST",
  });
}

export async function fetchMe(): Promise<MeResponse> {
  return apiClient<MeResponse>(ENDPOINTS.auth.me, {
    method: "GET",
  });
}