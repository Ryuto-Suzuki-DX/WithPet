package handlers

import (
	"net/http"
	"strconv"

	"withpet/backend/internal/logger"
	"withpet/backend/internal/user/services"
	"withpet/backend/internal/user/types"

	"github.com/gin-gonic/gin"
)

type CareTemplateHandler struct {
	careTemplateService *services.CareTemplateService
}

func NewCareTemplateHandler(
	careTemplateService *services.CareTemplateService,
) *CareTemplateHandler {
	return &CareTemplateHandler{
		careTemplateService: careTemplateService,
	}
}

/*
 * ケアテンプレート一覧取得
 */
func (h *CareTemplateHandler) GetCareTemplates(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("ケアテンプレート一覧取得失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	petID, err := parseUintParam(c, "petId")
	if err != nil {
		logger.Warnf("ケアテンプレート一覧取得失敗: ペットID形式不正 userID=%d petId=%s error=%v", userID, c.Param("petId"), err)
		respondBadRequest(c, "INVALID_PET_ID", err)
		return
	}

	templateType := c.Query("type")
	keyword := c.Query("keyword")

	response, err := h.careTemplateService.GetCareTemplates(
		userID,
		petID,
		templateType,
		keyword,
	)
	if err != nil {
		logger.Errorf("ケアテンプレート一覧取得失敗 userID=%d petID=%d error=%v", userID, petID, err)
		respondError(c, http.StatusInternalServerError, "GET_CARE_TEMPLATES_FAILED", err)
		return
	}

	logger.Infof("ケアテンプレート一覧取得成功 userID=%d petID=%d", userID, petID)
	respondSuccess(c, http.StatusOK, response, "ケアテンプレート一覧の取得に成功しました。")
}

/*
 * ケアテンプレート作成
 */
func (h *CareTemplateHandler) CreateCareTemplate(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("ケアテンプレート作成失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	petID, err := parseUintParam(c, "petId")
	if err != nil {
		logger.Warnf("ケアテンプレート作成失敗: ペットID形式不正 userID=%d petId=%s error=%v", userID, c.Param("petId"), err)
		respondBadRequest(c, "INVALID_PET_ID", err)
		return
	}

	var req types.CreateCareTemplateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Warnf("ケアテンプレート作成失敗: リクエスト形式不正 userID=%d petID=%d error=%v", userID, petID, err)
		respondBadRequest(c, "INVALID_CARE_TEMPLATE_REQUEST", err)
		return
	}

	if err := h.careTemplateService.CreateCareTemplate(userID, petID, req); err != nil {
		logger.Errorf("ケアテンプレート作成失敗 userID=%d petID=%d error=%v", userID, petID, err)
		respondError(c, http.StatusInternalServerError, "CREATE_CARE_TEMPLATE_FAILED", err)
		return
	}

	logger.Infof("ケアテンプレート作成成功 userID=%d petID=%d", userID, petID)
	respondSuccess(c, http.StatusCreated, nil, "ケアテンプレートを作成しました。")
}

/*
 * ケアテンプレート更新
 */
func (h *CareTemplateHandler) UpdateCareTemplate(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("ケアテンプレート更新失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	petID, err := parseUintParam(c, "petId")
	if err != nil {
		logger.Warnf("ケアテンプレート更新失敗: ペットID形式不正 userID=%d petId=%s error=%v", userID, c.Param("petId"), err)
		respondBadRequest(c, "INVALID_PET_ID", err)
		return
	}

	templateID, err := parseUintParam(c, "templateId")
	if err != nil {
		logger.Warnf("ケアテンプレート更新失敗: テンプレートID形式不正 userID=%d petID=%d templateId=%s error=%v", userID, petID, c.Param("templateId"), err)
		respondBadRequest(c, "INVALID_TEMPLATE_ID", err)
		return
	}

	var req types.UpdateCareTemplateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Warnf("ケアテンプレート更新失敗: リクエスト形式不正 userID=%d petID=%d templateID=%d error=%v", userID, petID, templateID, err)
		respondBadRequest(c, "INVALID_CARE_TEMPLATE_REQUEST", err)
		return
	}

	if err := h.careTemplateService.UpdateCareTemplate(userID, petID, templateID, req); err != nil {
		logger.Errorf("ケアテンプレート更新失敗 userID=%d petID=%d templateID=%d error=%v", userID, petID, templateID, err)
		respondError(c, http.StatusInternalServerError, "UPDATE_CARE_TEMPLATE_FAILED", err)
		return
	}

	logger.Infof("ケアテンプレート更新成功 userID=%d petID=%d templateID=%d", userID, petID, templateID)
	respondSuccess(c, http.StatusOK, nil, "ケアテンプレートを更新しました。")
}

/*
 * ケアテンプレート削除
 */
func (h *CareTemplateHandler) DeleteCareTemplate(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("ケアテンプレート削除失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	petID, err := parseUintParam(c, "petId")
	if err != nil {
		logger.Warnf("ケアテンプレート削除失敗: ペットID形式不正 userID=%d petId=%s error=%v", userID, c.Param("petId"), err)
		respondBadRequest(c, "INVALID_PET_ID", err)
		return
	}

	templateID, err := parseUintParam(c, "templateId")
	if err != nil {
		logger.Warnf("ケアテンプレート削除失敗: テンプレートID形式不正 userID=%d petID=%d templateId=%s error=%v", userID, petID, c.Param("templateId"), err)
		respondBadRequest(c, "INVALID_TEMPLATE_ID", err)
		return
	}

	if err := h.careTemplateService.DeleteCareTemplate(userID, petID, templateID); err != nil {
		logger.Errorf("ケアテンプレート削除失敗 userID=%d petID=%d templateID=%d error=%v", userID, petID, templateID, err)
		respondError(c, http.StatusInternalServerError, "DELETE_CARE_TEMPLATE_FAILED", err)
		return
	}

	logger.Infof("ケアテンプレート削除成功 userID=%d petID=%d templateID=%d", userID, petID, templateID)
	respondSuccess(c, http.StatusOK, nil, "ケアテンプレートを削除しました。")
}

/*
 * パスパラメータをuintに変換
 */
func parseUintParam(c *gin.Context, key string) (uint, error) {
	value, err := strconv.ParseUint(c.Param(key), 10, 64)
	if err != nil {
		return 0, err
	}

	return uint(value), nil
}
