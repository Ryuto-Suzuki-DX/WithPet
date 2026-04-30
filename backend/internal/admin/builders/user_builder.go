package builder

import (
	"errors"
	"withpet/backend/internal/admin/types"
	"withpet/backend/internal/database"
	"withpet/backend/internal/models"

	"gorm.io/gorm"
)

type UserBuilderInterface interface {
	BuildCountUserQuery(condition types.SearchUsersCondition) (*gorm.DB, error)
	BuildSearchUserQury(condition types.SearchUsersCondition) (*gorm.DB, error)
	BuildFindUserByEmailQuery(email string) (*gorm.DB, error)
	BuildUpdateUserQuery(req types.UpdateUserRequest) (*gorm.DB, error)
	BuildDeleteUserQuery(userID uint) (*gorm.DB, error)
}

type UserBuilder struct{}

// コンストラクタ
func NewUserBuilder() *UserBuilder {
	return &UserBuilder{}
}

// 全件数カウント用クエリ
func (b *UserBuilder) BuildCountUserQuery(condition types.SearchUsersCondition) (*gorm.DB, error) {
	query := database.DB.Model(&models.User{})

	// フリーワード検索
	if condition.Keyword != "" {
		likeKeyword := "%" + condition.Keyword + "%"

		query = query.Where(
			database.DB.
				Where("name LIKE ?", likeKeyword).
				Or("email LIKE ?", likeKeyword),
		)
	}

	return query, nil

}

// 一覧取得用クエリ作成
func (b *UserBuilder) BuildSearchUserQuery(condition types.SearchUsersCondition) (*gorm.DB, error) {
	query, err := b.BuildCountUserQuery(condition)
	if err != nil {
		return nil, err
	}

	// フリーワード検索
	if condition.Keyword != "" {
		likeKeyword := "%" + condition.Keyword + "%"

		query = query.Where(
			database.DB.
				Where("name LIKE ?", likeKeyword).
				Or("email LIKE ?", likeKeyword),
		)
	}

	// offset指定
	if condition.Offset > 0 {
		query = query.Offset(condition.Offset)
	}

	// limit指定
	if condition.Limit > 0 {
		query = query.Limit(condition.Limit)
	}

	// admin一覧なので、削除済みユーザーも含めて取得する
	return query, nil
}

// メールアドレスでユーザーを検索するクエリ作成 ※削除済みユーザーは除外する
func (b *UserBuilder) BuildFindUserByEmailQuery(email string) (*gorm.DB, error) {
	if email == "" {
		return nil, errors.New("メールアドレスが未指定です")
	}

	query := database.DB.
		Model(&models.User{}).
		Where("email = ? AND is_deleted = ?", email, false)

	return query, nil
}

// 編集
func (b *UserBuilder) BuildUpdateUserQuery(req types.UpdateUserRequest) (*gorm.DB, error) {
	if req.ID == 0 {
		return nil, errors.New("ユーザーIDが不正です")
	}

	query := database.DB.
		Model(&models.User{}).
		Where("id = ?", req.ID).
		Updates(models.User{
			Name:  req.Name,
			Email: req.Email,
			Role:  req.Role,
		})

	return query, nil
}

// 削除
func (b *UserBuilder) BuildDeleteUserQuery(userID uint) (*gorm.DB, error) {
	if userID == 0 {
		return nil, errors.New("ユーザーIDが不正です")
	}

	query := database.DB.
		Model(&models.User{}).
		Where("id = ?", userID)

	return query, nil
}
