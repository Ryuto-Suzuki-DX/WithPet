package types

/*
 * Userモデルの定義
 */

/*
 *フロントへのレスポンス型------------------------------------------------------
 */

//一覧表示(管理者画面の為、isdeletedも返す)
type UserResponse struct {
	ID        uint   `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	IsDeleted bool   `json:"isDeleted"`
}

type SearchUsersResponse struct {
	Users   []UserResponse `json:"users"`
	HasMore bool           `json:"hasMore"`
}

/*
 *フロントからのリクエスト型------------------------------------------------------
 */

// フリーワード検索
type SearchUsersRequest struct {
	Keyword string `form:"keyword"`
	Offset  int    `form:"offset"`
	Limit   int    `form:"limit"`
}

// 新規作成
type CreateUserRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	Role     string `json:"role" binding:"required,oneof=ADMIN USER"`
}

// 編集
type UpdateUserRequest struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

// 削除
type DeleteUserRequest struct {
	ID uint `json:"id" bindin:"required`
}

/*
 * builderへ渡す型------------------------------------------------------
 */

type SearchUsersCondition struct {
	Keyword string
	Offset  int
	Limit   int
}
