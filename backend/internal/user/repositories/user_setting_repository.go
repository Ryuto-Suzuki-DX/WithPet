package repositories

import (
	"withpet/backend/internal/database"
	"withpet/backend/internal/models"

	"gorm.io/gorm"
)

type UserSettingRepository struct{}

func NewUserSettingRepository() *UserSettingRepository {
	return &UserSettingRepository{}
}

/*
 * ユーザーIDから設定を取得
 */
func (r *UserSettingRepository) FindByUserID(userID uint) (*models.UserSetting, error) {
	var setting models.UserSetting

	err := database.DB.
		Where("user_id = ?", userID).
		First(&setting).Error

	if err != nil {
		return nil, err
	}

	return &setting, nil
}

/*
 * ユーザー設定を新規作成
 */
func (r *UserSettingRepository) Create(setting *models.UserSetting) error {
	return database.DB.Create(setting).Error
}

/*
 * ユーザー設定を更新
 */
func (r *UserSettingRepository) Update(setting *models.UserSetting) error {
	return database.DB.Save(setting).Error
}

/*
 * レコード未存在エラーか判定
 */
func (r *UserSettingRepository) IsRecordNotFound(err error) bool {
	return err == gorm.ErrRecordNotFound
}
