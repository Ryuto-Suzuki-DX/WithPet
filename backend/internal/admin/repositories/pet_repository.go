package repositories

import (
	"withpet/backend/internal/database"
	"withpet/backend/internal/models"
)

type PetRepositoryInterface interface {
	FindPetsByUserID(userID uint) ([]models.Pet, error)
}

type PetRepository struct{}

// コンストラクタ
func NewPetRepository() *PetRepository {
	return &PetRepository{}
}

// ユーザーIDに紐づくペット一覧取得
func (r *PetRepository) FindPetsByUserID(userID uint) ([]models.Pet, error) {
	var pets []models.Pet

	if err := database.DB.
		Where("user_id = ?", userID).
		Find(&pets).Error; err != nil {
		return nil, err
	}

	return pets, nil
}
