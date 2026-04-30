package models

import "time"

/*
 * ペットイベント
 *
 * ペット詳細カレンダーに表示する予定・記録
 */
type PetEvent struct {
	ID uint `gorm:"primaryKey"`

	UserID uint `gorm:"not null" json:"userId"`
	PetID  uint `gorm:"not null" json:"petId"`

	EventType string `gorm:"not null;size:50" json:"eventType"`
	Title     string `gorm:"not null;size:100" json:"title"`

	EventAt     time.Time  `gorm:"not null" json:"eventAt"`
	NextEventAt *time.Time `json:"nextEventAt"`

	Memo     string `json:"memo"`
	ImageKey string `json:"imageKey"`

	RemindEnabled bool       `gorm:"not null;default:false" json:"remindEnabled"`
	RemindAt      *time.Time `json:"remindAt"`
	RemindSentAt  *time.Time `json:"remindSentAt"`

	IsDeleted bool       `gorm:"not null;default:false" json:"isDeleted"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt"`

	Items []PetEventItem `gorm:"foreignKey:PetEventID" json:"items"`
}
