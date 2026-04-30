/*
 * user設定関連の型
 */

// リマインド設定
export type RemindSetting = {
  remindDaysBefore: number;
  remindHour: number;
  isEmailEnabled: boolean;
};

// リマインド設定更新リクエスト
export type UpdateRemindSettingRequest = {
  remindDaysBefore: number;
  remindHour: number;
  isEmailEnabled: boolean;
};