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

// 一覧取得
func (h *UserHandler) SearchUsers(c *gin.Context) {
	var req types.SearchUsersRequest
	// クエリパラメータを受け取る
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"error":   true,
			"code":    "INVALID_QUERY",
			"message": "クエリパラメータの形式が不正です",
			"detail":  err.Error(),
		})
		return
	}

	response, err := h.userService.SearchUsers(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"error":   true,
			"code":    "SEARCH_USERS_FAILED",
			"message": "ユーザーの取得に失敗しました",
			"detail":  err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    response,
		"error":   false,
		"code":    "",
		"message": "ユーザーの取得に成功しました",
		"detail":  nil,
	})
}

// 新規作成
func (h *UserHandler) CreateUser(c *gin.Context) {
	var req types.CreateUserRequest

	// リクエストJSONを受け取る
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"error":   true,
			"code":    "INVALID_REQUEST",
			"message": "リクエストの形式が不正です",
			"detail":  err.Error(),
		})
		return
	}

	user, err := h.userService.CreateUser(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"error":   true,
			"code":    "CREATE_USER_FAILED",
			"message": "ユーザーの作成に失敗しました",
			"detail":  err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data":    user,
		"error":   false,
		"code":    "",
		"message": "ユーザーの作成に成功しました",
		"detail":  nil,
	})
}
