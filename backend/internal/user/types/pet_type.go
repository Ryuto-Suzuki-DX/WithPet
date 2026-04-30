package types

/*
 * ペット関連の型
 */

/*
 * フロントへのレスポンス型-------------------------------------------------------------
 */

// マイページ表示用ペット
type MyPagePetResponse struct {
	ID        uint   `json:"id"`
	UserID    uint   `json:"userId"`
	Name      string `json:"name"`
	Type      string `json:"type"`
	Sex       string `json:"sex"`
	BirthDate string `json:"birthDate"`
}
