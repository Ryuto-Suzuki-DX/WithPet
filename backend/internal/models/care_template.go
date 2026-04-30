package models

import "time"

/*
 * ケアテンプレート
 *
 * 食事・おやつ・薬など、カレンダー登録時に選択するセット
 */
type CareTemplate struct {
	ID uint `gorm:"primaryKey"`

	UserID uint `gorm:"not null" json:"userId"`
	PetID  uint `gorm:"not null" json:"petId"`

	TemplateType string `gorm:"not null;size:50" json:"templateType"`
	Name         string `gorm:"not null;size:100" json:"name"`
	ImageKey     string `json:"imageKey"`

	IsFixed         bool   `gorm:"not null;default:false" json:"isFixed"`
	FixedDaysOfWeek string `json:"fixedDaysOfWeek"`
	FixedTime       string `gorm:"type:time" json:"fixedTime"`

	Memo string `json:"memo"`

	IsDeleted bool       `gorm:"not null;default:false" json:"isDeleted"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt"`

	Items []CareTemplateItem `gorm:"foreignKey:TemplateID" json:"items"`
}
