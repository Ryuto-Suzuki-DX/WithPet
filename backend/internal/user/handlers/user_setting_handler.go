package handlers

import (
	"net/http"

	"withpet/backend/internal/logger"
	"withpet/backend/internal/user/services"
	"withpet/backend/internal/user/types"

	"github.com/gin-gonic/gin"
)

type UserSettingHandler struct {
	userSettingService *services.UserSettingService
}

func NewUserSettingHandler(
	userSettingService *services.UserSettingService,
) *UserSettingHandler {
	return &UserSettingHandler{
		userSettingService: userSettingService,
	}
}

/*
 * リマインド設定取得
 */
func (h *UserSettingHandler) GetRemindSetting(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("リマインド設定取得失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	setting, err := h.userSettingService.GetRemindSetting(userID)
	if err != nil {
		logger.Errorf("リマインド設定取得失敗 userID=%d error=%v", userID, err)
		respondError(c, http.StatusInternalServerError, "GET_REMIND_SETTING_FAILED", err)
		return
	}

	logger.Infof("リマインド設定取得成功 userID=%d", userID)
	respondSuccess(c, http.StatusOK, setting, "リマインド設定の取得に成功しました。")
}

/*
 * リマインド設定更新
 */
func (h *UserSettingHandler) UpdateRemindSetting(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("リマインド設定更新失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	var req types.UpdateRemindSettingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Warnf("リマインド設定更新失敗: リクエスト形式不正 userID=%d error=%v", userID, err)
		respondBadRequest(c, "INVALID_REMIND_SETTING_REQUEST", err)
		return
	}

	if err := h.userSettingService.UpdateRemindSetting(userID, req); err != nil {
		logger.Errorf("リマインド設定更新失敗 userID=%d error=%v", userID, err)
		respondError(c, http.StatusInternalServerError, "UPDATE_REMIND_SETTING_FAILED", err)
		return
	}

	logger.Infof("リマインド設定更新成功 userID=%d", userID)
	respondSuccess(c, http.StatusOK, nil, "リマインド設定を更新しました。")
}
