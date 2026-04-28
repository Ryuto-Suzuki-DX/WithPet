/*
 * APIのURL一覧表
 */

export const ENDPOINTS = {
  auth: {
    login: "/api/v1/auth/login",
    logout: "/api/v1/auth/logout",
    me: "/api/v1/auth/me",
  },

  /*
   * ADMIN
   */
  // ユーザー関連
  admin: {
    users: "/api/v1/admin/users",
    userDetail: (userId: string) => `/api/v1/admin/users/${userId}`,
  },

  /*
   * USER
   */
  // マイページ？
  user: {
    mypage: "/api/v1/user/mypage",
  },

  pet: {
    list: "/api/v1/user/pets",
    detail: (petId: string) => `/api/v1/user/pets/${petId}`,
  },

  record: {
    list: "/api/v1/user/records",
    detail: (recordId: string) => `/api/v1/user/records/${recordId}`,
  },
} as const;