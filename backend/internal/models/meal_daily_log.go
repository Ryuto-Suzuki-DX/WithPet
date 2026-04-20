package models

import "time"

// 食事日誌のモデル
type MealDailyLog struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	PetID          uint      `gorm:"not null;index" json:"petId"`
	MealTemplateID uint      `gorm:"not null;index" json:"mealTemplateId"`
	LogDate        time.Time `gorm:"not null;index" json:"logDate"`
	ServedAmountG  float64   `gorm:"not null" json:"servedAmountG"`
	EatenRatio     float64   `gorm:"not null" json:"eatenRatio"`
	Status         string    `gorm:"size:30;not null" json:"status"`
	Note           string    `gorm:"type:text" json:"note"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}
