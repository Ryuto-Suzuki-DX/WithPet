package models

import "time"

/*
 * ケアテンプレート明細
 *
 * 例:
 * フェレットペレット 20g
 * フェレットフード緑 80g
 */
type CareTemplateItem struct {
	ID uint `gorm:"primaryKey"`

	TemplateID uint `gorm:"not null" json:"templateId"`

	ItemName string  `gorm:"not null;size:100" json:"itemName"`
	Amount   float64 `gorm:"not null;default:0" json:"amount"`
	Unit     string  `gorm:"not null;size:10" json:"unit"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
