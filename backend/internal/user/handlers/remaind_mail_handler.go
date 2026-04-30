package handlers

import (
	"net/http"

	"withpet/backend/internal/logger"
	"withpet/backend/internal/user/services"

	"github.com/gin-gonic/gin"
)

type RemindMailHandler struct {
	remindMailService *services.RemindMailService
}

func NewRemindMailHandler(
	remindMailService *services.RemindMailService,
) *RemindMailHandler {
	return &RemindMailHandler{
		remindMailService: remindMailService,
	}
}

/*
 * リマインドテストメール送信
 */
func (h *RemindMailHandler) SendTestEmail(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("リマインドテストメール送信失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	if err := h.remindMailService.SendTestEmail(userID); err != nil {
		logger.Errorf("リマインドテストメール送信失敗 userID=%d error=%v", userID, err)
		respondError(c, http.StatusInternalServerError, "SEND_REMIND_TEST_EMAIL_FAILED", err)
		return
	}

	logger.Infof("リマインドテストメール送信成功 userID=%d", userID)
	respondSuccess(c, http.StatusOK, nil, "テストメールを送信しました。")
}
