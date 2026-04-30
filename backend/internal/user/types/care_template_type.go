package types

/*
 * ケアテンプレート明細レスポンス
 */
type CareTemplateItemResponse struct {
	ID uint `json:"id"`

	ItemName string  `json:"itemName"`
	Amount   float64 `json:"amount"`
	Unit     string  `json:"unit"`
}

/*
 * ケアテンプレートレスポンス
 */
type CareTemplateResponse struct {
	ID uint `json:"id"`

	PetID uint `json:"petId"`

	TemplateType string `json:"templateType"`
	Name         string `json:"name"`
	ImageKey     string `json:"imageKey"`

	Items []CareTemplateItemResponse `json:"items"`

	IsFixed         bool     `json:"isFixed"`
	FixedDaysOfWeek []string `json:"fixedDaysOfWeek"`
	FixedTime       string   `json:"fixedTime"`

	Memo string `json:"memo"`
}

/*
 * ケアテンプレート明細リクエスト
 */
type CareTemplateItemRequest struct {
	ItemName string  `json:"itemName" binding:"required"`
	Amount   float64 `json:"amount" binding:"min=0"`
	Unit     string  `json:"unit" binding:"required"`
}

/*
 * ケアテンプレート作成リクエスト
 */
type CreateCareTemplateRequest struct {
	TemplateType string `json:"templateType" binding:"required"`
	Name         string `json:"name" binding:"required"`
	ImageKey     string `json:"imageKey"`

	Items []CareTemplateItemRequest `json:"items" binding:"required"`

	IsFixed         bool     `json:"isFixed"`
	FixedDaysOfWeek []string `json:"fixedDaysOfWeek"`
	FixedTime       string   `json:"fixedTime"`

	Memo string `json:"memo"`
}

/*
 * ケアテンプレート更新リクエスト
 */
type UpdateCareTemplateRequest struct {
	TemplateType string `json:"templateType" binding:"required"`
	Name         string `json:"name" binding:"required"`
	ImageKey     string `json:"imageKey"`

	Items []CareTemplateItemRequest `json:"items" binding:"required"`

	IsFixed         bool     `json:"isFixed"`
	FixedDaysOfWeek []string `json:"fixedDaysOfWeek"`
	FixedTime       string   `json:"fixedTime"`

	Memo string `json:"memo"`
}

/*
 * ケアテンプレート検索条件
 */
type SearchCareTemplatesCondition struct {
	UserID uint
	PetID  uint

	TemplateType string
	Keyword      string

	IsFixedOnly    bool
	FixedDayOfWeek string
}
