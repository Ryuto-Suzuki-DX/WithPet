package handlers

import (
	"net/http"

	"withpet/backend/internal/logger"
	"withpet/backend/internal/user/services"

	"github.com/gin-gonic/gin"
)

type ImageHandler struct {
	imageService *services.ImageService
}

func NewImageHandler(
	imageService *services.ImageService,
) *ImageHandler {
	return &ImageHandler{
		imageService: imageService,
	}
}

/*
 * 画像アップロード
 */
func (h *ImageHandler) UploadImage(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("画像アップロード失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		logger.Warnf("画像アップロード失敗: 画像ファイル取得失敗 userID=%d error=%v", userID, err)
		respondBadRequest(c, "INVALID_IMAGE_FILE", err)
		return
	}

	result, err := h.imageService.UploadImage(c.Request.Context(), userID, file)
	if err != nil {
		logger.Errorf("画像アップロード失敗 userID=%d error=%v", userID, err)
		respondError(c, http.StatusInternalServerError, "UPLOAD_IMAGE_FAILED", err)
		return
	}

	logger.Infof("画像アップロード成功 userID=%d imageKey=%s", userID, result.ImageKey)

	respondSuccess(c, http.StatusOK, result, "画像をアップロードしました。")
}
