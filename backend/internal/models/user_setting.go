package models

import "time"

/*
 * ユーザー設定
 *
 * 現時点ではリマインド設定のみ保持する
 * 将来的に他のユーザー設定が増えた場合もこのテーブルを拡張できる
 */
type UserSetting struct {
	ID uint `gorm:"primaryKey"`

	UserID           uint `gorm:"not null;uniqueIndex" json:"userId"`         // 何日前にリマインドするか
	RemindDaysBefore int  `gorm:"not null;default:1" json:"remindDaysBefore"` // 何時にリマインドするか 0〜23
	RemindHour       int  `gorm:"not null;default:9" json:"remindHour"`       // メール通知を有効にするか
	IsEmailEnabled   bool `gorm:"not null;default:true" json:"isEmailEnabled"`

	CreatedAt time.Time
	UpdatedAt time.Time
}
