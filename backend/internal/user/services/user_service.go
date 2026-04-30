package services

import (
	"withpet/backend/internal/user/repositories"
	"withpet/backend/internal/user/types"
)

type UserService struct {
	userRepository *repositories.UserRepository
	petRepository  *repositories.PetRepository
}

// コンストラクタ
func NewUserService(
	userRepository *repositories.UserRepository,
	petRepository *repositories.PetRepository,
) *UserService {
	return &UserService{
		userRepository: userRepository,
		petRepository:  petRepository,
	}
}

// マイページ取得
func (s *UserService) GetMyPage(userID uint) (*types.MyPageResponse, error) {
	// ログイン中ユーザーを取得
	user, err := s.userRepository.FindUserByID(userID)
	if err != nil {
		return nil, err
	}

	// ログイン中ユーザーに紐づくペットを取得
	pets, err := s.petRepository.FindPetsByUserID(userID)
	if err != nil {
		return nil, err
	}

	// ペット情報をレスポンス型に変換
	petResponses := make([]types.MyPagePetResponse, 0, len(pets))
	for _, pet := range pets {
		petResponses = append(petResponses, types.MyPagePetResponse{
			ID:        pet.ID,
			UserID:    pet.UserID,
			Name:      pet.Name,
			Sex:       pet.Sex,
			Type:      pet.Type,
			BirthDate: pet.BirthDate.Format("2006-01-02"),
		})
	}

	response := types.MyPageResponse{
		User: types.MyPageUserResponse{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		},
		Pets: petResponses,
	}

	return &response, nil
}
