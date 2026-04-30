/*
 * admin関連の型
 */

// User単体の型
export type User = {
  id:         number;
  name:       string;
  email:      string;
  role:       string;
  isDeleted:  boolean;
  pets?:      Pet[];
};

// APIレスポンス
export type ApiResponse<T> = {
  code:     string;
  data:     T;
  detail:   string | null;
  error:    boolean;
  message:  string;
};

// ペットの型 →　あとで移動
export type Pet = {
  id:       number;
  userId:   number;
  name:     string;
  type:     string;
  sex:      string;
  birthDate:string;
  isDeleted:boolean;
  createdAt:string;
}

// 
export type SearchListData<T> = {
  users:    T[];
  hasMore:  boolean;
};

//
export type GetAdminUsersParams = {
  keyword:  string;
  offset:   number;
  limit:    number;
};

// ---------------------------------------------------------------------

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
  name:     string;
  email:    string;
  password?: string;
  role:     "ADMIN" | "USER";
}

