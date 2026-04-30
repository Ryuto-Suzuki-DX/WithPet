package models

import "time"

/*
 * ペットイベント明細
 *
 * 食事・薬・おやつ・嘔吐・うんちなどの明細
 */
type PetEventItem struct {
	ID uint `gorm:"primaryKey"`

	PetEventID uint `gorm:"not null" json:"petEventId"`

	ItemName string  `gorm:"not null;size:100" json:"itemName"`
	Amount   float64 `gorm:"not null;default:0" json:"amount"`
	Unit     string  `gorm:"not null;size:10" json:"unit"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
