package types

/*
 * USER側　レスポンス型
 */

// マイページ表示用ユーザー
type MyPageUserResponse struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

// マイページ取得レスポンス
type MyPageResponse struct {
	User MyPageUserResponse  `json:"user"`
	Pets []MyPagePetResponse `json:"pets"`
}
