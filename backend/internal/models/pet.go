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
	BirthDate time.Time  `json:"birthDate"`
	isDelete  bool       `gorm:"default:false" json:"isDeleted"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
