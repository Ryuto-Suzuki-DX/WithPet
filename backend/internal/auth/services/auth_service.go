package services

import (
	"errors"
	"log"
	"strconv"

	"withpet/backend/internal/auth/repositories"
	"withpet/backend/internal/auth/utils"

	"golang.org/x/crypto/bcrypt"
)

type LoginUser struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type LoginResponse struct {
	AccessToken string    `json:"accessToken"`
	User        LoginUser `json:"user"`
}

type AuthService struct {
	authRepository *repositories.AuthRepository
}

func NewAuthService(authRepository *repositories.AuthRepository) *AuthService {
	return &AuthService{
		authRepository: authRepository,
	}
}

func (s *AuthService) Login(email, password string) (*LoginResponse, error) {
	user, err := s.authRepository.FindByEmail(email)
	if err != nil {
		log.Println("ログインユーザーが見つかりません。")
		return nil, errors.New("メールアドレスまたはパスワードが正しくありません")
	}

	log.Println("みつからん", user.Email, "role", user.Role)

	// 入力パスワードとDBのハッシュを照合
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		log.Println("ぱすわーどみす", err)
		return nil, errors.New("メールアドレスまたはパスワードが正しくありません")
	}

	log.Println("せいこう！")

	token, err := utils.GenerateJWT(
		strconv.Itoa(int(user.ID)),
		user.Name,
		user.Email,
		user.Role,
	)
	if err != nil {
		return nil, errors.New("トークン生成に失敗しました")
	}

	log.Println("login success")

	return &LoginResponse{
		AccessToken: token,
		User: LoginUser{
			ID:    strconv.Itoa(int(user.ID)),
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
	}, nil
}
