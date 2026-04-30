package repositories

import (
	"withpet/backend/internal/database"
	"withpet/backend/internal/models"
)

type PetRepository struct{}

// コンストラクタ
func NewPetRepository() *PetRepository {
	return &PetRepository{}
}

// ユーザーIDでペット一覧を取得
func (r *PetRepository) FindPetsByUserID(userID uint) ([]models.Pet, error) {
	var pets []models.Pet

	if err := database.DB.
		Where("user_id = ? AND is_deleted = ?", userID, false).
		Find(&pets).Error; err != nil {
		return nil, err
	}

	return pets, nil
}
