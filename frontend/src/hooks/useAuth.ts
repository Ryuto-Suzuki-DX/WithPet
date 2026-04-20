/*
 * 認証状態を管理するカスタムフック
 *  - ログイン状態の保持
 *  - ログイン・ログアウト処理
 *  - ユーザー情報の取得
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchMe, login as loginApi, logout as logoutApi } from "../api/auth";
import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from "../lib/auth";
import type { AuthUser, LoginRequest } from "../types/auth";

type UseAuthReturn = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (request: LoginRequest) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMe = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await fetchMe();
      setUser(response.user);
    } catch (err) {
      removeAccessToken();
      setUser(null);
      setError(err instanceof Error ? err.message : "ユーザー取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (request: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginApi(request);
      saveAccessToken(response.accessToken);
      setUser(response.user);
      return response.user;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "ログインに失敗しました。";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logoutApi();
    } catch {
      // サーバー側 logout に失敗してもフロント側は消す
    } finally {
      removeAccessToken();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshMe,
  };
}