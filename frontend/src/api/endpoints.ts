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
  user: {
    mypage: "/api/v1/user/mypage",
    petDetail: (petId: string) => `/api/v1/user/pets/${petId}`,
    remindSetting: "/api/v1/user/settings/remind",
    remindTestEmail: "/api/v1/user/settings/remind/test-email",
    petEvents: (petId: number) => `/api/v1/user/pets/${petId}/events`,
    careTemplates: (petId: number) => `/api/v1/user/pets/${petId}/care-templates`,
    careTemplate: (petId: number, templateId: number) => `/api/v1/user/pets/${petId}/care-templates/${templateId}`,
    petEvent: (petId: number, eventId: number) => `/api/v1/user/pets/${petId}/events/${eventId}`,
  },
};