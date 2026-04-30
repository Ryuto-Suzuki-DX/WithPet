package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"withpet/backend/internal/logger"
	"withpet/backend/internal/user/services"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService *services.UserService
}

// コンストラクタ
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

// リクエスト不正エラー系
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

// ログイン中ユーザーID取得
func getLoginUserID(c *gin.Context) (uint, error) {
	value, exists := c.Get("userId")
	if !exists {
		return 0, errors.New("ログインユーザーIDが取得できません")
	}

	userIDText, ok := value.(string)
	if !ok {
		return 0, errors.New("ログインユーザーのID形式が不正です")
	}

	id, err := strconv.Atoi(userIDText)
	if err != nil {
		return 0, errors.New("ログインユーザーのIDを数値に変換できません")
	}

	return uint(id), nil
}

// マイページ取得
func (h *UserHandler) GetMyPage(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("マイページ取得失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	response, err := h.userService.GetMyPage(userID)
	if err != nil {
		logger.Errorf("マイページ取得失敗 userID=%d error=%v", userID, err)
		respondError(c, http.StatusInternalServerError, "GET_MYPAGE_FAILED", err)
		return
	}

	logger.Infof("マイページ取得成功 userID=%d", userID)
	respondSuccess(c, http.StatusOK, response, "マイページの取得に成功しました。")
}
