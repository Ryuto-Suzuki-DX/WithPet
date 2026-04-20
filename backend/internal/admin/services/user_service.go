package services

import (
	"errors"
	"withpet/backend/internal/admin/builder"
	"withpet/backend/internal/admin/repositories"
	"withpet/backend/internal/admin/types"
	"withpet/backend/internal/models"
)

/*
 * 〇 新規作成時はメールアドレス重複チェックを行う
 * 〇 新規作成時はbuilder
 */

type UserService struct {
	userRepository *repositories.UserRepository
	userBuilder    *builder.UserBuilder
}

func NewUserService(
	userRepository *repositories.UserRepository,
	userBuilder *builder.UserBuilder,
) *UserService {
	return &UserService{
		userRepository: userRepository,
		userBuilder:    userBuilder,
	}
}

// 一覧取得(件数指定スクロール型)
func (s *UserService) SearchUsers(req types.SearchUsersRequest) (types.SearchUsersResponse, error) {
	// 全件カウント用(ここではoffset/limitは扱わない)
	countCondition := types.SearchUsersCondition{
		Keyword: req.Keyword,
	}
	// 全件数カウント用クエリ作成
	countQuery := s.userBuilder.BuildCountUserQuery(countCondition)

	// 全件数カウント実行
	total, err := s.userRepository.CountUsers(countQuery)
	if err != nil {
		return types.SearchUsersResponse{}, err
	}

	// 一覧取得用 builderでクエリ作成(admin一覧なので、削除済みユーザーも含めて取得)
	condition := types.SearchUsersCondition{
		Keyword: req.Keyword,
		Offset:  req.Offset,
		Limit:   req.Limit,
	}
	searchQuery := s.userBuilder.BuildSearchUserQuery(condition)

	//repositoryでクエリ実行
	users, err := s.userRepository.FindUsers(searchQuery)
	if err != nil {
		return types.SearchUsersResponse{}, err
	}

	//モデルからレスポンス型に変換
	responses := make([]types.UserResponse, 0, len(users))
	for _, user := range users {
		responses = append(responses, types.UserResponse{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			Role:      user.Role,
			IsDeleted: user.IsDeleted,
		})
	}

	// 次ページ有無を厳密に判定
	hasMore := req.Offset+len(responses) < int(total)

	response := types.SearchUsersResponse{
		Users:   responses,
		HasMore: hasMore,
	}

	return response, nil
}

// 新規作成
func (s *UserService) CreateUser(req types.CreateUserRequest) (types.UserResponse, error) {
	// メアド重複チェッククエリ作成(メアドでユーザーを検索するクエリ作成)
	query := s.userBuilder.BuildFindUserByEmailQuery(req.Email)

	// 既存ユーザー取得
	existingUser, err := s.userRepository.FindUserByEmail(query)
	if err != nil {
		return types.UserResponse{}, err
	}
	// 既存ユーザーが存在する場合はエラーを返す(該当無しでID=0のユーザーが返ってくる想定)
	if existingUser.ID != 0 {
		return types.UserResponse{}, errors.New("メールアドレスは既に使用されています")
	}
	// 保存用model作成
	user := models.User{
		Name:      req.Name,
		Email:     req.Email,
		Password:  req.Password,
		Role:      "USER",
		IsDeleted: false,
	}

	// 保存実行
	if err := s.userRepository.CreateUser(&user); err != nil {
		return types.UserResponse{}, err
	}

	// フロント返却型に変換して、返却
	response := types.UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Role:      user.Role,
		IsDeleted: false,
	}

	return response, nil

}
