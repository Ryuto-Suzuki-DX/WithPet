/*
 * admin系API
 */

import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import type { ApiResponse,
              User,
              SearchListData,
              CreateUserRequest,
              UpdateUserRequest,
               } from "@/types/admin/admin_type";

export type GetAdminUsersParams = {
  keyword: string;
  offset: number;
  limit: number;
};

/*
 * フロント　→　バック　のAPI構造
 * 1.   page.tsx            各種ページ
 * 2.   api/admin.ts        api窓口
 * 3.   api/client.ts       共通送信エンジン
 * 4.   api/endpoints.ts    バックエンド送り先一覧
 * 5.   BACKEND
 * 6.   api/data.ts         レスポンス加工
 *(7.   api/admin_type      使用する型) 
 */ 

/*
 * 〇一覧取得
 * - 初回表示
 * - 検索
 * - もっと見る
 * の共通API
 */
export async function searchUsers(
  params: GetAdminUsersParams
): Promise<ApiResponse<SearchListData<User>>> {
  const query = new URLSearchParams({
    keyword: params.keyword,
    offset: String(params.offset),
    limit: String(params.limit),
  });

  return apiClient<ApiResponse<SearchListData<User>>>(
    `${ENDPOINTS.admin.users}?${query.toString()}`,
    {
      method: "GET",
    }
  );
}

/*
 * 〇新規作成
 */
export async function createUser(
  params: CreateUserRequest
): Promise<void> {
  await apiClient(ENDPOINTS.admin.users, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/*
 * 〇1件取得
 */
export async function getUser(
  userId: number
): Promise<ApiResponse<User>> {
  return apiClient<ApiResponse<User>>(`${ENDPOINTS.admin.users}/${userId}`, {
    method: "GET",
  });
}                                                                                                               

/*
 * 〇編集
 */
export async function updateUser(
  params: UpdateUserRequest
): Promise<void> {
  await apiClient(`${ENDPOINTS.admin.users}/${params.ID}`, {
    method: "PUT",
    body: JSON.stringify(params),
  });
}

/*
 * 〇削除
 */
export async function deleteUser(
  userId: number
): Promise<void> {
  await apiClient(`${ENDPOINTS.admin.users}/${userId}`, {
    method: "DELETE",
  });
}