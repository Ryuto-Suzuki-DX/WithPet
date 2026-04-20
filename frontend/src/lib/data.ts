/*
 * レスポンスの中身整理をこっちで行う
 */

export type ApiResponse<T> = {
  code: string;
  data: T;
  detail: string | null;
  error: boolean;
  message: string;
};

export type SearchListData<T> = {
  users: T[];
  hasMore: boolean;
};

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

export function extractSearchListData<T>(
  response: ApiResponse<SearchListData<T>>
): SearchListData<T> {
  return {
    users: response.data.users,
    hasMore: response.data.hasMore,
  };
}