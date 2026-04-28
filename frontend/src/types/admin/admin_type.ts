/*
 * admin関連の型
 */

// User単体の型
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

// APIレスポンス
export type ApiResponse<T> = {
  code: string;
  data: T;
  detail: string | null;
  error: boolean;
  message: string;
};

// 
export type SearchListData<T> = {
  users: T[];
  hasMore: boolean;
};

//
export type GetAdminUsersParams = {
  keyword: string;
  offset: number;
  limit: number;
};

// 新規作成リクエスト
export type CreateUserRequest = {
  name:     string;
  email:    string;
  password: string;
  role:     "ADMIN" | "USER";
};

// 編集リクエスト
export type UpdateUserRequest = {
  ID:       number;
  email:    string;
  password: string;
  role:     "ADMIN" | "USER";
}