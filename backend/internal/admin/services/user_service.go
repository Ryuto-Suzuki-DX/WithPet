package services

import (
	"errors"
	builder "withpet/backend/internal/admin/builders"
	"withpet/backend/internal/admin/repositories"
	"withpet/backend/internal/admin/types"
	"withpet/backend/internal/models"
)

/*
 * 〇 新規作成時はメールアドレス重複チェックを行う
 * 〇 新規作成時はbuilder
 */

type UserServiceInterface interface {
	SearchUsers(req types.SearchUsersRequest) (types.SearchUsersResponse, error)
	CreateUser(req types.CreateUserRequest) (types.UserResponse, error)
	UpdateUser(req types.UpdateUserRequest) (types.UserResponse, error)
	DeleteUser(req types.DeleteUserRequest) error
}

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

// 検索(件数指定スクロール型)
func (s *UserService) SearchUsers(req types.SearchUsersRequest) (types.SearchUsersResponse, error) {
	// 全件カウント用(ここではoffset/limitは扱わない)
	countCondition := types.SearchUsersCondition{
		Keyword: req.Keyword,
	}
	// 全件数カウント用クエリ作成
	countQuery, err := s.userBuilder.BuildCountUserQuery(countCondition)
	if err != nil {
		return types.SearchUsersResponse{}, err
	}

	// 全件数カウント実行
	total, err := s.userRepository.CountUsers(countQuery)
	if err != nil {
		return types.SearchUsersResponse{}, err
	}

	// 一覧取得用条件
	condition := types.SearchUsersCondition{
		Keyword: req.Keyword,
		Offset:  req.Offset,
		Limit:   req.Limit,
	}

	// 一覧取得用クエリ作成
	searchQuery, err := s.userBuilder.BuildSearchUserQuery(condition)
	if err != nil {
		return types.SearchUsersResponse{}, err
	}

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
	query, err := s.userBuilder.BuildFindUserByEmailQuery(req.Email)
	if err != nil {
		return types.UserResponse{}, err
	}

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

// 編集
func (s *UserService) UpdateUser(req types.UpdateUserRequest) (types.UserResponse, error) {
	// メアド重複チェッククエリ作成(メアドでユーザーを検索するクエリ作成)
	query, err := s.userBuilder.BuildFindUserByEmailQuery(req.Email)
	if err != nil {
		return types.UserResponse{}, err
	}

	// 既存ユーザー取得
	existingUser, err := s.userRepository.FindUserByEmail(query)
	if err != nil {
		return types.UserResponse{}, err
	}

	// 自分以外で同じメアドが存在する場合はエラーを返す(該当なしでID=0のユーザーが返ってくる想定)
	if existingUser.ID != 0 && existingUser.ID != req.ID {
		return types.UserResponse{}, errors.New("メールアドレスは既に使用されています")
	}

	// 編集用クエリ作成
	updateQuery, err := s.userBuilder.BuildUpdateUserQuery(req)
	if err != nil {
		return types.UserResponse{}, err
	}

	// 編集実行
	if err := s.userRepository.UpdateUser(updateQuery); err != nil {
		return types.UserResponse{}, err
	}

	// フロント返却型に変換して、返却
	response := types.UserResponse{
		ID:        req.ID,
		Name:      req.Name,
		Email:     req.Email,
		Role:      req.Role,
		IsDeleted: false,
	}

	return response, nil
}

// 削除
func (s *UserService) DeleteUser(req types.DeleteUserRequest) error {
	// 削除用クエリ作成
	deleteQuery, err := s.userBuilder.BuildDeleteUserQuery(req.ID)
	if err != nil {
		return err
	}

	// 論理削除実行
	if err := s.userRepository.DeleteUser(deleteQuery); err != nil {
		return err
	}

	return nil
}
