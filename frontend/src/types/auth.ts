/*
 * 認証関連の型定義
 */

export type UserRole = "ADMIN" | "USER";

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
    user: AuthUser;
};

export type MeResponse = {
    user: AuthUser;
};