package models

import "time"

// 食事テンプレートの期間モデル
type MealTemplatePeriod struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	MealTemplateID uint      `gorm:"not null;index" json:"mealTemplateId"`
	StartDate      time.Time `gorm:"not null" json:"startDate"`
	EndDate        time.Time `gorm:"not null" json:"endDate"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}
