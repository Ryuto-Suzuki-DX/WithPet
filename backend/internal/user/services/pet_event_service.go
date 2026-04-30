package services

import (
	"time"

	"withpet/backend/internal/models"
	"withpet/backend/internal/user/builders"
	"withpet/backend/internal/user/repositories"
	"withpet/backend/internal/user/types"
)

type PetEventService struct {
	petEventRepository *repositories.PetEventRepository
	petEventBuilder    *builders.PetEventBuilder
}

func NewPetEventService(
	petEventRepository *repositories.PetEventRepository,
	petEventBuilder *builders.PetEventBuilder,
) *PetEventService {
	return &PetEventService{
		petEventRepository: petEventRepository,
		petEventBuilder:    petEventBuilder,
	}
}

/*
 * 補助：リマインド日時が変わったか判定
 */
func isRemindAtChanged(
	before *time.Time,
	after *time.Time,
) bool {
	if before == nil && after == nil {
		return false
	}

	if before == nil || after == nil {
		return true
	}

	return !before.Equal(*after)
}

/*
 * ペットイベント一覧取得
 */
func (s *PetEventService) GetPetEvents(
	userID uint,
	petID uint,
) ([]types.PetEventResponse, error) {
	condition := types.SearchPetEventsCondition{
		UserID: userID,
		PetID:  petID,
	}

	query := s.petEventBuilder.BuildFindPetEventsQuery(condition)

	events, err := s.petEventRepository.FindPetEvents(query)
	if err != nil {
		return nil, err
	}

	responses := make([]types.PetEventResponse, 0, len(events))
	for _, event := range events {
		responses = append(responses, toPetEventResponse(event))
	}

	return responses, nil
}

/*
 * ペットイベント作成
 */
func (s *PetEventService) CreatePetEvent(
	userID uint,
	petID uint,
	req types.CreatePetEventRequest,
) error {
	event := models.PetEvent{
		UserID:        userID,
		PetID:         petID,
		EventType:     req.EventType,
		Title:         req.Title,
		EventAt:       req.EventAt,
		NextEventAt:   req.NextEventAt,
		Memo:          req.Memo,
		ImageKey:      req.ImageKey,
		RemindEnabled: req.RemindEnabled,
		RemindAt:      req.RemindAt,
		Items:         toPetEventItems(req.Items),
	}

	if !req.RemindEnabled {
		event.RemindAt = nil
	}

	return s.petEventRepository.Create(&event)
}

/*
 * モデルからレスポンスへ変換
 */
func toPetEventResponse(event models.PetEvent) types.PetEventResponse {
	items := make([]types.PetEventItemResponse, 0, len(event.Items))

	for _, item := range event.Items {
		items = append(items, types.PetEventItemResponse{
			ID:       item.ID,
			ItemName: item.ItemName,
			Amount:   item.Amount,
			Unit:     item.Unit,
		})
	}

	return types.PetEventResponse{
		ID:            event.ID,
		PetID:         event.PetID,
		EventType:     event.EventType,
		Title:         event.Title,
		EventAt:       event.EventAt,
		NextEventAt:   event.NextEventAt,
		Memo:          event.Memo,
		ImageKey:      event.ImageKey,
		RemindEnabled: event.RemindEnabled,
		RemindAt:      event.RemindAt,
		Items:         items,
	}
}

/*
 * リクエスト明細からモデル明細へ変換
 */
func toPetEventItems(
	reqItems []types.CreatePetEventItemRequest,
) []models.PetEventItem {
	items := make([]models.PetEventItem, 0, len(reqItems))

	for _, reqItem := range reqItems {
		items = append(items, models.PetEventItem{
			ItemName: reqItem.ItemName,
			Amount:   reqItem.Amount,
			Unit:     reqItem.Unit,
		})
	}

	return items
}

/*
 * ペットイベント更新
 */
func (s *PetEventService) UpdatePetEvent(
	userID uint,
	petID uint,
	eventID uint,
	req types.UpdatePetEventRequest,
) error {
	condition := types.FindPetEventCondition{
		UserID:  userID,
		PetID:   petID,
		EventID: eventID,
	}

	query := s.petEventBuilder.BuildFindPetEventByIDQuery(condition)

	existingEvent, err := s.petEventRepository.FindPetEvent(query)
	if err != nil {
		return err
	}

	remindSentAt := existingEvent.RemindSentAt

	if !req.RemindEnabled {
		req.RemindAt = nil
		remindSentAt = nil
	} else if isRemindAtChanged(existingEvent.RemindAt, req.RemindAt) {
		remindSentAt = nil
	}

	existingEvent.EventType = req.EventType
	existingEvent.Title = req.Title
	existingEvent.EventAt = req.EventAt
	existingEvent.NextEventAt = req.NextEventAt
	existingEvent.Memo = req.Memo
	existingEvent.ImageKey = req.ImageKey
	existingEvent.RemindEnabled = req.RemindEnabled
	existingEvent.RemindAt = req.RemindAt
	existingEvent.RemindSentAt = remindSentAt
	existingEvent.Items = toPetEventItems(req.Items)

	return s.petEventRepository.Update(existingEvent)
}

/*
 * ペットイベント削除
 */
func (s *PetEventService) DeletePetEvent(
	userID uint,
	petID uint,
	eventID uint,
) error {
	condition := types.FindPetEventCondition{
		UserID:  userID,
		PetID:   petID,
		EventID: eventID,
	}

	query := s.petEventBuilder.BuildFindPetEventByIDQuery(condition)

	if _, err := s.petEventRepository.FindPetEvent(query); err != nil {
		return err
	}

	return s.petEventRepository.Delete(userID, petID, eventID)
}
