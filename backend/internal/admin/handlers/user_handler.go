package handlers

/*
 * 〇 ユーザーハンドラー
 *
 * 〇返却型は全て共通の形式にする
 * {
 *   "data": 		...,
 *   "error": 		false/true,
 *   "code": 		"",
 *   "message": 	""
 *	 "detail": 		"errorの詳細情報(あれば)"
 * }
 *
 * 〇エラーコードの命名規則
 * [処理内容]_[対象]_[エラー内容]
 *
 * 〇バリデーションエラーはモデルで定義したErrValidationを返す
 * (逆にそれ以外はチェックしていない)
 */

import (
	"net/http"
	"strconv"

	"withpet/backend/internal/admin/services"
	"withpet/backend/internal/admin/types"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// 通常エラー処理用
func respondError(c *gin.Context, status int, code string, err error) {
	c.JSON(status, gin.H{
		"data":    nil,
		"error":   true,
		"code":    code,
		"message": err.Error(),
		"detail":  err.Error(),
	})
}

// リクエスト不正系エラー処理用
func respondBadRequest(c *gin.Context, code string, err error) {
	c.JSON(http.StatusBadRequest, gin.H{
		"data":    nil,
		"error":   true,
		"code":    code,
		"message": "リクエストの形式が不正です。",
		"detail":  err.Error(),
	})
}

// 成功レスポンス用
func respondSuccess(c *gin.Context, status int, data interface{}, message string) {
	c.JSON(status, gin.H{
		"data":    data,
		"error":   false,
		"code":    "",
		"message": message,
		"detail":  nil,
	})
}

// 一覧取得
func (h *UserHandler) SearchUsers(c *gin.Context) {
	var req types.SearchUsersRequest
	// クエリパラメータを受け取る
	if err := c.ShouldBindQuery(&req); err != nil {
		respondBadRequest(c, "INVALID_QUERY", err)
		return
	}

	// 各エラー
	response, err := h.userService.SearchUsers(req)
	if err != nil {
		respondError(c, http.StatusInternalServerError, "SEARCH_USERS_FAILED", err)
		return
	}

	respondSuccess(c, http.StatusOK, response, "ユーザーの取得に成功しました。")
}

// 新規作成
func (h *UserHandler) CreateUser(c *gin.Context) {
	var req types.CreateUserRequest

	// リクエストJSONを受け取る
	if err := c.ShouldBindJSON(&req); err != nil {
		respondBadRequest(c, "INVALID_REQUEST", err)
		return
	}

	user, err := h.userService.CreateUser(req)
	if err != nil {
		respondError(c, http.StatusInternalServerError, "CREATE_USER_FAILED", err)
		return
	}

	respondSuccess(c, http.StatusCreated, user, "ユーザーの作成に成功しました。")
}

// 詳細取得
func (h *UserHandler) GetUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		respondBadRequest(c, "INVALID_ID_REQUEST", err)
		return
	}

	user, err := h.userService.GetUser(uint(id))
	if err != nil {
		respondError(c, http.StatusInternalServerError, "GET_USER_FAILED", err)
		return
	}

	respondSuccess(c, http.StatusOK, user, "ユーザーの取得に成功しました。")
}

// 編集
func (h *UserHandler) UpdateUser(c *gin.Context) {
	var req types.UpdateUserRequest

	// リクエストJSONを受け取る
	if err := c.ShouldBindJSON(&req); err != nil {
		respondBadRequest(c, "INVALID_REQUEST", err)
		return
	}

	// 編集実行
	user, err := h.userService.UpdateUser(req)
	if err != nil {
		respondError(c, http.StatusInternalServerError, "UPDATE_USER_FAILED", err)
		return
	}

	respondSuccess(c, http.StatusOK, user, "ユーザーの編集に成功しました。")
}

// 削除
func (h *UserHandler) DeleteUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		respondBadRequest(c, "INVAID_ID_REQUEST", err)
		return
	}

	req := types.DeleteUserRequest{
		ID: uint(id),
	}

	// 削除実行
	if err := h.userService.DeleteUser(req); err != nil {
		respondError(c, http.StatusInternalServerError, "DELETE_USER_FAILED", err)
		return
	}

	respondSuccess(c, http.StatusOK, gin.H{"id": req.ID}, "ユーザーの削除に成功しました。")
}
