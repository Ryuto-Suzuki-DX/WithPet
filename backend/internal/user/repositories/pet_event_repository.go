package repositories

import (
	"time"

	"withpet/backend/internal/database"
	"withpet/backend/internal/models"

	"gorm.io/gorm"
)

type PetEventRepository struct{}

func NewPetEventRepository() *PetEventRepository {
	return &PetEventRepository{}
}

/*
 * ペットイベント一覧取得
 *
 * builderで作成したクエリを実行する
 */
func (r *PetEventRepository) FindPetEvents(
	query *gorm.DB,
) ([]models.PetEvent, error) {
	var events []models.PetEvent

	err := query.Find(&events).Error

	return events, err
}

/*
 * リマインド送信対象イベント取得
 *
 * builderで作成したクエリを実行する
 */
func (r *PetEventRepository) FindDueRemindEvents(
	query *gorm.DB,
) ([]models.PetEvent, error) {
	var events []models.PetEvent

	err := query.Find(&events).Error

	return events, err
}

/*
 * ペットイベント作成
 *
 * イベント本体と明細をまとめて保存する
 */
func (r *PetEventRepository) Create(event *models.PetEvent) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(event).Error; err != nil {
			return err
		}

		return nil
	})
}

/*
 * リマインド送信済みに更新
 *
 * メール送信に成功したイベントに送信日時を入れる
 */
func (r *PetEventRepository) MarkRemindSent(
	eventID uint,
	sentAt time.Time,
) error {
	return database.DB.
		Model(&models.PetEvent{}).
		Where("id = ?", eventID).
		Where("remind_sent_at IS NULL").
		Updates(map[string]interface{}{
			"remind_sent_at": sentAt,
			"updated_at":     sentAt,
		}).Error
}

/*
 * ペットイベント1件取得
 *
 * builderで作成したクエリを実行する
 */
func (r *PetEventRepository) FindPetEvent(
	query *gorm.DB,
) (*models.PetEvent, error) {
	var event models.PetEvent

	if err := query.First(&event).Error; err != nil {
		return nil, err
	}

	return &event, nil
}

/*
 * ペットイベント更新
 *
 * 明細は一旦削除して作り直す
 */
func (r *PetEventRepository) Update(event *models.PetEvent) error {
	now := time.Now()

	return database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.PetEvent{}).
			Where(
				"id = ? AND user_id = ? AND pet_id = ? AND is_deleted = ?",
				event.ID,
				event.UserID,
				event.PetID,
				false,
			).
			Updates(map[string]interface{}{
				"event_type":     event.EventType,
				"title":          event.Title,
				"event_at":       event.EventAt,
				"next_event_at":  event.NextEventAt,
				"memo":           event.Memo,
				"image_key":      event.ImageKey,
				"remind_enabled": event.RemindEnabled,
				"remind_at":      event.RemindAt,
				"remind_sent_at": event.RemindSentAt,
				"updated_at":     now,
			}).Error; err != nil {
			return err
		}

		if err := tx.
			Where("pet_event_id = ?", event.ID).
			Delete(&models.PetEventItem{}).Error; err != nil {
			return err
		}

		for i := range event.Items {
			event.Items[i].ID = 0
			event.Items[i].PetEventID = event.ID
		}

		if len(event.Items) > 0 {
			if err := tx.Create(&event.Items).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

/*
 * ペットイベント論理削除
 */
func (r *PetEventRepository) Delete(
	userID uint,
	petID uint,
	eventID uint,
) error {
	now := time.Now()

	return database.DB.Model(&models.PetEvent{}).
		Where(
			"id = ? AND user_id = ? AND pet_id = ? AND is_deleted = ?",
			eventID,
			userID,
			petID,
			false,
		).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": now,
			"updated_at": now,
		}).Error
}
