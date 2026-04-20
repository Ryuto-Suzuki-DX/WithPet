package builder

import (
	"withpet/backend/internal/admin/types"
	"withpet/backend/internal/database"
	"withpet/backend/internal/models"

	"gorm.io/gorm"
)

type UserBuilder struct{}

// コンストラクタ
func NewUserBuilder() *UserBuilder {
	return &UserBuilder{}
}

// 全件数カウント用クエリ
func (b *UserBuilder) BuildCountUserQuery(condition types.SearchUsersCondition) *gorm.DB {
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

	return query

}

// 一覧取得用クエリ作成
func (b *UserBuilder) BuildSearchUserQuery(condition types.SearchUsersCondition) *gorm.DB {
	query := b.BuildCountUserQuery(condition)

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
	return query
}

// メールアドレスでユーザーを検索するクエリ作成
func (b *UserBuilder) BuildFindUserByEmailQuery(email string) *gorm.DB {
	return database.DB.
		Model(&models.User{}).
		Where("email = ?", email)
}
