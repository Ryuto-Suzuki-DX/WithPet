package models

import (
	"time"
)

// 　ペットのモデル
type Pet struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	UserID    uint       `gorm:"not null" json:"userId"`
	Name      string     `gorm:"size:100,not null" json:"name"`
	Type      string     `gorm:"size:50,not null" json:"type"`
	Sex       string     `gorm:"not null;size:20;default:UNKNOWN" json:"sex"`
	BirthDate time.Time  `json:"birthDate"`
	IsDeleted bool       `gorm:"default:false" json:"isDeleted"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
