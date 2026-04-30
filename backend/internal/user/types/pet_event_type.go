package types

import "time"

/*
 * ペットイベント明細レスポンス
 */
type PetEventItemResponse struct {
	ID uint `json:"id"`

	ItemName string  `json:"itemName"`
	Amount   float64 `json:"amount"`
	Unit     string  `json:"unit"`
}

/*
 * ペットイベントレスポンス
 */
type PetEventResponse struct {
	ID uint `json:"id"`

	PetID uint `json:"petId"`

	EventType string `json:"eventType"`
	Title     string `json:"title"`

	EventAt     time.Time  `json:"eventAt"`
	NextEventAt *time.Time `json:"nextEventAt"`

	Memo     string `json:"memo"`
	ImageKey string `json:"imageKey"`

	RemindEnabled bool       `json:"remindEnabled"`
	RemindAt      *time.Time `json:"remindAt"`

	Items []PetEventItemResponse `json:"items"`
}

/*
 * ペットイベント明細作成リクエスト
 */
type CreatePetEventItemRequest struct {
	ItemName string  `json:"itemName" binding:"required"`
	Amount   float64 `json:"amount" binding:"min=0"`
	Unit     string  `json:"unit" binding:"required"`
}

/*
 * ペットイベント作成リクエスト
 */
type CreatePetEventRequest struct {
	EventType string `json:"eventType" binding:"required"`
	Title     string `json:"title" binding:"required"`

	EventAt     time.Time  `json:"eventAt" binding:"required"`
	NextEventAt *time.Time `json:"nextEventAt"`

	Memo     string `json:"memo"`
	ImageKey string `json:"imageKey"`

	RemindEnabled bool       `json:"remindEnabled"`
	RemindAt      *time.Time `json:"remindAt"`

	Items []CreatePetEventItemRequest `json:"items"`
}

/*
 * ペットイベント検索条件
 */
type SearchPetEventsCondition struct {
	UserID uint
	PetID  uint
}

/*
 * ペットイベント更新リクエスト
 */
type UpdatePetEventRequest struct {
	EventType string `json:"eventType" binding:"required"`
	Title     string `json:"title" binding:"required"`

	EventAt     time.Time  `json:"eventAt" binding:"required"`
	NextEventAt *time.Time `json:"nextEventAt"`

	Memo     string `json:"memo"`
	ImageKey string `json:"imageKey"`

	RemindEnabled bool       `json:"remindEnabled"`
	RemindAt      *time.Time `json:"remindAt"`

	Items []CreatePetEventItemRequest `json:"items"`
}

/*
 * ペットイベント1件取得条件
 */
type FindPetEventCondition struct {
	UserID  uint
	PetID   uint
	EventID uint
}
