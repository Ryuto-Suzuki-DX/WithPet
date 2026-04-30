package models

import (
	"time"
)

// 飼い主ユーザのモデル
type User struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	Name      string     `gorm:"size:100,not null" json:"name"`
	Email     string     `gorm:"size:255, not null" json:"email"`
	Role      string     `gorm:"size:20,not null;default:USER" json:"role"`
	Password  string     `gorm:"size:255,not null" json:"-"`
	IsDeleted bool       `gorm:"default:false" json:"isDeleted"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
