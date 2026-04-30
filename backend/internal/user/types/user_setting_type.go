package types

/*
 * 設定
 * 1. リマインド機能　何日前？　何時に？　メール通知有効/無効？
 *
 *
 *
 */

/*
 * リマインド設定レスポンス
 */
type RemindSettingResponse struct {
	RemindDaysBefore int  `json:"remindDaysBefore"`
	RemindHour       int  `json:"remindHour"`
	IsEmailEnabled   bool `json:"isEmailEnabled"`
}

/*
 * リマインド設定更新リクエスト
 */
type UpdateRemindSettingRequest struct {
	RemindDaysBefore int  `json:"remindDaysBefore" binding:"min=0,max=30"`
	RemindHour       int  `json:"remindHour" binding:"min=0,max=23"`
	IsEmailEnabled   bool `json:"isEmailEnabled"`
}
