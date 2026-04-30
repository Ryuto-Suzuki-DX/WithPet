package repositories

import (
	"errors"
	"time"
	"withpet/backend/internal/database"
	"withpet/backend/internal/models"

	"gorm.io/gorm"
)

type UserRepositoryInterface interface {
	CountUsers(query *gorm.DB) (int64, error)
	FindUsers(query *gorm.DB) ([]models.User, error)
	FindUserByEmail(query *gorm.DB) (models.User, error)
	CreateUser(user *models.User) error
	UpdateUser(query *gorm.DB) error
	DeleteUser(query *gorm.DB) error
}

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

// 詳細取得
func (r *UserRepository) FindUserByID(id uint) (*models.User, error) {
	var user models.User

	if err := database.DB.
		Where("id = ? AND is_deleted = ?", id, false).
		First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

// 編集
func (r *UserRepository) UpdateUser(query *gorm.DB) error {
	if query.Error != nil {
		return query.Error
	}

	if query.RowsAffected == 0 {
		return errors.New("対象ユーザーが存在しません")
	}

	return nil
}

// 削除
func (r *UserRepository) DeleteUser(query *gorm.DB) error {
	result := query.Updates(map[string]interface{}{
		"is_deleted": true,
		"deleted_at": time.Now(),
	})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("対象ユーザーが存在しません")
	}

	return nil
}
