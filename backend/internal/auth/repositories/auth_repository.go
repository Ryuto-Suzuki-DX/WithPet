package repositories

import (
	"withpet/backend/internal/database"
	"withpet/backend/internal/models"
)

type AuthRepository struct {
}

func NewAuthRepository() *AuthRepository {
	return &AuthRepository{}
}

// メールアドレスでユーザーを1件取得
func (r *AuthRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User

	err := database.DB.
		Where("email = ? AND is_deleted = ?", email, false).
		First(&user).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}
