/*
 * user系API
 */

import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import type { ApiResponse } from "@/types/admin/admin_type";
import type { MyPageData } from "@/types/user/user_type";
import type { RemindSetting, UpdateRemindSettingRequest } from "@/types/user/user_setting_type";
import type {
  PetEvent,
  CreatePetEventRequest,
  UpdatePetEventRequest,
} from "@/types/user/user_pet_event_type";
import type {
  CareTemplate,
  CareTemplateType,
  CreateCareTemplateRequest,
  UpdateCareTemplateRequest,
} from "@/types/user/user_care_template_type";

/*
 * 〇マイページ取得
 * - ログイン中ユーザー情報
 * - 紐づくペット一覧
 */
export async function getMyPage(): Promise<ApiResponse<MyPageData>> {
  return apiClient<ApiResponse<MyPageData>>(ENDPOINTS.user.mypage, {
    method: "GET",
  });
}

/*
 * 〇リマインド設定取得
 */
export async function getRemindSetting(): Promise<ApiResponse<RemindSetting>> {
  return apiClient<ApiResponse<RemindSetting>>(ENDPOINTS.user.remindSetting, {
    method: "GET",
  });
}

/*
 * 〇リマインド設定更新
 */
export async function updateRemindSetting(
  params: UpdateRemindSettingRequest
): Promise<void> {
  await apiClient(ENDPOINTS.user.remindSetting, {
    method: "PUT",
    body: JSON.stringify(params),
  });
}

/*
 * 〇ペットイベント一覧取得
 */
export async function getPetEvents(
  petId: number
): Promise<ApiResponse<PetEvent[]>> {
  return apiClient<ApiResponse<PetEvent[]>>(ENDPOINTS.user.petEvents(petId), {
    method: "GET",
  });
}

/*
 * 〇ペットイベント作成
 */
export async function createPetEvent(
  petId: number,
  params: CreatePetEventRequest
): Promise<void> {
  await apiClient(ENDPOINTS.user.petEvents(petId), {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/*
 * 〇ペットイベント更新
 */
export async function updatePetEvent(
  petId: number,
  eventId: number,
  params: UpdatePetEventRequest
): Promise<void> {
  await apiClient(ENDPOINTS.user.petEvent(petId, eventId), {
    method: "PUT",
    body: JSON.stringify(params),
  });
}

/*
 * 〇ペットイベント削除
 */
export async function deletePetEvent(
  petId: number,
  eventId: number
): Promise<void> {
  await apiClient(ENDPOINTS.user.petEvent(petId, eventId), {
    method: "DELETE",
  });
}

/*
 * 〇ケアテンプレート一覧取得
 */
export async function getCareTemplates(
  petId: number,
  templateType?: CareTemplateType
): Promise<ApiResponse<CareTemplate[]>> {
  const query = templateType ? `?type=${templateType}` : "";

  return apiClient<ApiResponse<CareTemplate[]>>(
    `${ENDPOINTS.user.careTemplates(petId)}${query}`,
    {
      method: "GET",
    }
  );
}

/*
 * 〇ケアテンプレート作成
 */
export async function createCareTemplate(
  petId: number,
  params: CreateCareTemplateRequest
): Promise<void> {
  await apiClient(ENDPOINTS.user.careTemplates(petId), {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/*
 * 〇ケアテンプレート更新
 */
export async function updateCareTemplate(
  petId: number,
  templateId: number,
  params: UpdateCareTemplateRequest
): Promise<void> {
  await apiClient(ENDPOINTS.user.careTemplate(petId, templateId), {
    method: "PUT",
    body: JSON.stringify(params),
  });
}

/*
 * 〇ケアテンプレート削除
 */
export async function deleteCareTemplate(
  petId: number,
  templateId: number
): Promise<void> {
  await apiClient(ENDPOINTS.user.careTemplate(petId, templateId), {
    method: "DELETE",
  });
}

/*
 * 〇リマインドテストメール送信
 */
export async function sendRemindTestEmail(): Promise<void> {
  await apiClient(ENDPOINTS.user.remindTestEmail, {
    method: "POST",
  });
}

/*
 * 〇画像アップロード
 */
export type UploadUserImageResponse = {
  imageUrl: string;
  imageKey: string;
};

export async function uploadUserImage(
  file: File
): Promise<ApiResponse<UploadUserImageResponse>> {
  const formData = new FormData();
  formData.append("image", file);

  return apiClient<ApiResponse<UploadUserImageResponse>>(ENDPOINTS.user.images, {
    method: "POST",
    body: formData,
  });
}