package models

import (
	"time"
)

// 食事テンプレートのモデル
type MealTemplate struct {
	ID             uint       `gorm:"primaryKey" json:"id"`
	PetID          uint       `gorm:"not null" json:"petId"`
	Name           string     `gorm:"size:100,not null" json:"name"`
	FoodName       string     `gorm:"size:100,not null" json:"foodName"`
	DefaultAmountG int        `gorm:"not null" json:"defaultAmountG"`
	Memo           string     `gorm:"size:255" json:"memo"`
	isDelete       bool       `gorm:"default:false" json:"isDeleted"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
	DeletedAt      *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
