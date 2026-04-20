package repositories

import (
	"withpet/backend/internal/database"
	"withpet/backend/internal/models"

	"gorm.io/gorm"
)

type UserRepository struct{}

// コンストラクタ
func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

// 全件数取得
func (r *UserRepository) CountUsers(query *gorm.DB) (int64, error) {
	var count int64

	if err := query.Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

// 一覧取得
func (r *UserRepository) FindUsers(query *gorm.DB) ([]models.User, error) {
	var users []models.User

	if err := query.Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

// メアドでユーザーを検索
func (r *UserRepository) FindUserByEmail(query *gorm.DB) (models.User, error) {
	var user models.User

	err := query.First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return models.User{}, nil
		}
		return models.User{}, err
	}
	return user, nil
}

// 新規作成
func (r *UserRepository) CreateUser(user *models.User) error {
	if err := database.DB.Create(user).Error; err != nil {
		return err
	}

	return nil
}
