package handlers

import (
	"net/http"
	"strconv"

	"withpet/backend/internal/logger"
	"withpet/backend/internal/user/services"
	"withpet/backend/internal/user/types"

	"github.com/gin-gonic/gin"
)

type PetEventHandler struct {
	petEventService *services.PetEventService
}

func NewPetEventHandler(
	petEventService *services.PetEventService,
) *PetEventHandler {
	return &PetEventHandler{
		petEventService: petEventService,
	}
}

/*
 * ペットイベント一覧取得
 */
func (h *PetEventHandler) GetPetEvents(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("ペットイベント一覧取得失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	petID64, err := strconv.ParseUint(c.Param("petId"), 10, 64)
	if err != nil {
		logger.Warnf("ペットイベント一覧取得失敗: ペットID形式不正 userID=%d petId=%s error=%v", userID, c.Param("petId"), err)
		respondBadRequest(c, "INVALID_PET_ID", err)
		return
	}

	response, err := h.petEventService.GetPetEvents(userID, uint(petID64))
	if err != nil {
		logger.Errorf("ペットイベント一覧取得失敗 userID=%d petID=%d error=%v", userID, uint(petID64), err)
		respondError(c, http.StatusInternalServerError, "GET_PET_EVENTS_FAILED", err)
		return
	}

	logger.Infof("ペットイベント一覧取得成功 userID=%d petID=%d", userID, uint(petID64))
	respondSuccess(c, http.StatusOK, response, "ペットイベント一覧の取得に成功しました。")
}

/*
 * ペットイベント作成
 */
func (h *PetEventHandler) CreatePetEvent(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("ペットイベント作成失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	petID64, err := strconv.ParseUint(c.Param("petId"), 10, 64)
	if err != nil {
		logger.Warnf("ペットイベント作成失敗: ペットID形式不正 userID=%d petId=%s error=%v", userID, c.Param("petId"), err)
		respondBadRequest(c, "INVALID_PET_ID", err)
		return
	}

	var req types.CreatePetEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Warnf("ペットイベント作成失敗: リクエスト形式不正 userID=%d petID=%d error=%v", userID, uint(petID64), err)
		respondBadRequest(c, "INVALID_PET_EVENT_REQUEST", err)
		return
	}

	if err := h.petEventService.CreatePetEvent(userID, uint(petID64), req); err != nil {
		logger.Errorf("ペットイベント作成失敗 userID=%d petID=%d error=%v", userID, uint(petID64), err)
		respondError(c, http.StatusInternalServerError, "CREATE_PET_EVENT_FAILED", err)
		return
	}

	logger.Infof("ペットイベント作成成功 userID=%d petID=%d", userID, uint(petID64))
	respondSuccess(c, http.StatusCreated, nil, "ペットイベントを作成しました。")
}

/*
 * ペットイベント更新
 */
func (h *PetEventHandler) UpdatePetEvent(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("ペットイベント更新失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	petID, err := parseUintParam(c, "petId")
	if err != nil {
		logger.Warnf("ペットイベント更新失敗: ペットID形式不正 userID=%d petId=%s error=%v", userID, c.Param("petId"), err)
		respondBadRequest(c, "INVALID_PET_ID", err)
		return
	}

	eventID, err := parseUintParam(c, "eventId")
	if err != nil {
		logger.Warnf("ペットイベント更新失敗: イベントID形式不正 userID=%d petID=%d eventId=%s error=%v", userID, petID, c.Param("eventId"), err)
		respondBadRequest(c, "INVALID_EVENT_ID", err)
		return
	}

	var req types.UpdatePetEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Warnf("ペットイベント更新失敗: リクエスト形式不正 userID=%d petID=%d eventID=%d error=%v", userID, petID, eventID, err)
		respondBadRequest(c, "INVALID_PET_EVENT_REQUEST", err)
		return
	}

	if err := h.petEventService.UpdatePetEvent(userID, petID, eventID, req); err != nil {
		logger.Errorf("ペットイベント更新失敗 userID=%d petID=%d eventID=%d error=%v", userID, petID, eventID, err)
		respondError(c, http.StatusInternalServerError, "UPDATE_PET_EVENT_FAILED", err)
		return
	}

	logger.Infof("ペットイベント更新成功 userID=%d petID=%d eventID=%d", userID, petID, eventID)
	respondSuccess(c, http.StatusOK, nil, "ペットイベントを更新しました。")
}

/*
 * ペットイベント削除
 */
func (h *PetEventHandler) DeletePetEvent(c *gin.Context) {
	userID, err := getLoginUserID(c)
	if err != nil {
		logger.Warnf("ペットイベント削除失敗: ログインユーザーID取得失敗 error=%v", err)
		respondBadRequest(c, "INVALID_LOGIN_USER_ID", err)
		return
	}

	petID, err := parseUintParam(c, "petId")
	if err != nil {
		logger.Warnf("ペットイベント削除失敗: ペットID形式不正 userID=%d petId=%s error=%v", userID, c.Param("petId"), err)
		respondBadRequest(c, "INVALID_PET_ID", err)
		return
	}

	eventID, err := parseUintParam(c, "eventId")
	if err != nil {
		logger.Warnf("ペットイベント削除失敗: イベントID形式不正 userID=%d petID=%d eventId=%s error=%v", userID, petID, c.Param("eventId"), err)
		respondBadRequest(c, "INVALID_EVENT_ID", err)
		return
	}

	if err := h.petEventService.DeletePetEvent(userID, petID, eventID); err != nil {
		logger.Errorf("ペットイベント削除失敗 userID=%d petID=%d eventID=%d error=%v", userID, petID, eventID, err)
		respondError(c, http.StatusInternalServerError, "DELETE_PET_EVENT_FAILED", err)
		return
	}

	logger.Infof("ペットイベント削除成功 userID=%d petID=%d eventID=%d", userID, petID, eventID)
	respondSuccess(c, http.StatusOK, nil, "ペットイベントを削除しました。")
}
