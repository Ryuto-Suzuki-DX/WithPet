package builders

import (
	"withpet/backend/internal/database"
	"withpet/backend/internal/models"
	"withpet/backend/internal/user/types"

	"gorm.io/gorm"
)

type CareTemplateBuilder struct{}

func NewCareTemplateBuilder() *CareTemplateBuilder {
	return &CareTemplateBuilder{}
}

/*
 * ケアテンプレート検索クエリ作成
 */
func (b *CareTemplateBuilder) BuildSearchCareTemplatesQuery(
	condition types.SearchCareTemplatesCondition,
) *gorm.DB {
	query := database.DB.
		Model(&models.CareTemplate{}).
		Preload("Items").
		Where("user_id = ?", condition.UserID).
		Where("pet_id = ?", condition.PetID).
		Where("is_deleted = ?", false)

	if condition.TemplateType != "" {
		query = query.Where("template_type = ?", condition.TemplateType)
	}

	if condition.Keyword != "" {
		keyword := "%" + condition.Keyword + "%"
		query = query.Where(
			"(name ILIKE ? OR memo ILIKE ?)",
			keyword,
			keyword,
		)
	}

	if condition.IsFixedOnly {
		query = query.Where("is_fixed = ?", true)
	}

	if condition.FixedDayOfWeek != "" {
		// fixed_days_of_week は "MON,TUE,WED" のように保存する前提
		query = query.Where("fixed_days_of_week LIKE ?", "%"+condition.FixedDayOfWeek+"%")
	}

	query = query.Order("id ASC")

	return query
}
