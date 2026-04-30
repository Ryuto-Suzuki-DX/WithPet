package repositories

import (
	"withpet/backend/internal/database"
	"withpet/backend/internal/models"
)

type UserRepository struct{}

// コンストラクタ
func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

// 詳細取得(ログイン中ユーザー情報取得)
func (r *UserRepository) FindUserByID(userID uint) (*models.User, error) {
	var user models.User

	if err := database.DB.
		Where("id = ? AND is_deleted = ?", userID, false).
		First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}
