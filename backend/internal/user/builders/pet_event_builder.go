package builders

import (
	"time"

	"withpet/backend/internal/database"
	"withpet/backend/internal/models"
	"withpet/backend/internal/user/types"

	"gorm.io/gorm"
)

type PetEventBuilder struct{}

func NewPetEventBuilder() *PetEventBuilder {
	return &PetEventBuilder{}
}

/*
 * ペットイベント一覧取得クエリ作成
 *
 * ペット詳細カレンダーで表示するイベントを取得する
 */
func (b *PetEventBuilder) BuildFindPetEventsQuery(
	condition types.SearchPetEventsCondition,
) *gorm.DB {
	query := database.DB.
		Model(&models.PetEvent{}).
		Preload("Items").
		Where("user_id = ?", condition.UserID).
		Where("pet_id = ?", condition.PetID).
		Where("is_deleted = ?", false)

	query = query.Order("event_at ASC")

	return query
}

/*
 * リマインド送信対象イベント取得クエリ作成
 *
 * remind_enabled = true
 * remind_at <= 現在時刻
 * remind_sent_at IS NULL
 * is_deleted = false
 */
func (b *PetEventBuilder) BuildDueRemindEventsQuery(
	now time.Time,
	limit int,
) *gorm.DB {
	if limit <= 0 {
		limit = 50
	}

	query := database.DB.
		Model(&models.PetEvent{}).
		Where("remind_enabled = ?", true).
		Where("remind_at IS NOT NULL").
		Where("remind_at <= ?", now).
		Where("remind_sent_at IS NULL").
		Where("is_deleted = ?", false).
		Order("remind_at ASC").
		Limit(limit)

	return query
}

/*
 * ペットイベント1件取得クエリ作成
 *
 * 編集・削除対象のイベントを取得する
 */
func (b *PetEventBuilder) BuildFindPetEventByIDQuery(
	condition types.FindPetEventCondition,
) *gorm.DB {
	query := database.DB.
		Model(&models.PetEvent{}).
		Preload("Items").
		Where("id = ?", condition.EventID).
		Where("user_id = ?", condition.UserID).
		Where("pet_id = ?", condition.PetID).
		Where("is_deleted = ?", false)

	return query
}
