package repositories

import (
	"time"

	"withpet/backend/internal/database"
	"withpet/backend/internal/models"

	"gorm.io/gorm"
)

type CareTemplateRepository struct{}

func NewCareTemplateRepository() *CareTemplateRepository {
	return &CareTemplateRepository{}
}

/*
 * ケアテンプレート一覧取得
 *
 * builderで作成したクエリを実行する
 */
func (r *CareTemplateRepository) FindCareTemplates(query *gorm.DB) ([]models.CareTemplate, error) {
	var templates []models.CareTemplate

	err := query.Find(&templates).Error

	return templates, err
}

/*
 * ケアテンプレート1件取得
 */
func (r *CareTemplateRepository) FindByID(
	userID uint,
	petID uint,
	templateID uint,
) (*models.CareTemplate, error) {
	var template models.CareTemplate

	err := database.DB.
		Preload("Items").
		Where(
			"id = ? AND user_id = ? AND pet_id = ? AND is_deleted = ?",
			templateID,
			userID,
			petID,
			false,
		).
		First(&template).Error

	if err != nil {
		return nil, err
	}

	return &template, nil
}

/*
 * ケアテンプレート作成
 */
func (r *CareTemplateRepository) Create(template *models.CareTemplate) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		return tx.Create(template).Error
	})
}

/*
 * ケアテンプレート更新
 *
 * 明細は一旦削除して作り直す
 */
func (r *CareTemplateRepository) Update(template *models.CareTemplate) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.CareTemplate{}).
			Where(
				"id = ? AND user_id = ? AND pet_id = ? AND is_deleted = ?",
				template.ID,
				template.UserID,
				template.PetID,
				false,
			).
			Updates(map[string]interface{}{
				"template_type":      template.TemplateType,
				"name":               template.Name,
				"image_key":          template.ImageKey,
				"is_fixed":           template.IsFixed,
				"fixed_days_of_week": template.FixedDaysOfWeek,
				"fixed_time":         template.FixedTime,
				"memo":               template.Memo,
				"updated_at":         time.Now(),
			}).Error; err != nil {
			return err
		}

		if err := tx.
			Where("template_id = ?", template.ID).
			Delete(&models.CareTemplateItem{}).Error; err != nil {
			return err
		}

		for i := range template.Items {
			template.Items[i].ID = 0
			template.Items[i].TemplateID = template.ID
		}

		if len(template.Items) > 0 {
			if err := tx.Create(&template.Items).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

/*
 * ケアテンプレート論理削除
 */
func (r *CareTemplateRepository) Delete(userID uint, petID uint, templateID uint) error {
	now := time.Now()

	return database.DB.Model(&models.CareTemplate{}).
		Where(
			"id = ? AND user_id = ? AND pet_id = ? AND is_deleted = ?",
			templateID,
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
