package types

/*
 * Petモデルの定義
 */

/*
 *フロントへのレスポンス型------------------------------------------------------
 */

// ペット表示用レスポンス
type PetResponse struct {
	ID        uint   `json:"id"`
	UserID    uint   `json:"userId"`
	Name      string `json:"name"`
	Type      string `json:"type"`
	Sex       string `json:"sex"`
	BirthDate string `json:"birthDate"`
	IsDeleted bool   `json:"isDeleted"`
	CreatedAt string `json:"createdAt"`
}

/*
 *フロントからのリクエスト型------------------------------------------------------
 */
