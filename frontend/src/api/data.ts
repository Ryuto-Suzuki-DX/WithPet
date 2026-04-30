/*
 * バックエンドからのレスポンスをフロントエンドで使いやすくするために加工
 */

import type { 
  ApiResponse,
  SearchListData,
  
} from "@/types/admin/admin_type";

// 汎用型の純粋に取り出すタイプ
export function extractListData<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;

  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data?: unknown }).data)
  ) {
    return (data as { data: T[] }).data;
  }

  if (
    data &&
    typeof data === "object" &&
    "users" in data &&
    Array.isArray((data as { users?: unknown }).users)
  ) {
    return (data as { users: T[] }).users;
  }

  return [];
}

// 検索一覧APIの戻り値専用タイプ
export function extractSearchListData<T>(
  response: ApiResponse<SearchListData<T>>
): SearchListData<T> {
  return {
    users: response.data.users,
    hasMore: response.data.hasMore,
  };
}

// 単体取得APIの戻り値専用タイプ
export function extractData<T>(
  response: ApiResponse<T>
): T {
  if (response.error) {
    throw new Error(response.message || "ユーザー取得時にAPIエラーが発生しました。");
  }

  return response.data;
}