package services

import (
	"errors"
	"os"
	"strings"

	"withpet/backend/internal/models"
	"withpet/backend/internal/user/builders"
	"withpet/backend/internal/user/repositories"
	"withpet/backend/internal/user/types"
)

type CareTemplateService struct {
	careTemplateRepository *repositories.CareTemplateRepository
	careTemplateBuilder    *builders.CareTemplateBuilder
}

func NewCareTemplateService(
	careTemplateRepository *repositories.CareTemplateRepository,
	careTemplateBuilder *builders.CareTemplateBuilder,
) *CareTemplateService {
	return &CareTemplateService{
		careTemplateRepository: careTemplateRepository,
		careTemplateBuilder:    careTemplateBuilder,
	}
}

/*
 * ケアテンプレート一覧取得
 */
func (s *CareTemplateService) GetCareTemplates(
	userID uint,
	petID uint,
	templateType string,
	keyword string,
) ([]types.CareTemplateResponse, error) {
	condition := types.SearchCareTemplatesCondition{
		UserID:       userID,
		PetID:        petID,
		TemplateType: templateType,
		Keyword:      keyword,
	}

	query := s.careTemplateBuilder.BuildSearchCareTemplatesQuery(condition)

	templates, err := s.careTemplateRepository.FindCareTemplates(query)
	if err != nil {
		return nil, err
	}

	responses := make([]types.CareTemplateResponse, 0, len(templates))
	for _, template := range templates {
		responses = append(responses, toCareTemplateResponse(template))
	}

	return responses, nil
}

/*
 * ケアテンプレート作成
 */
func (s *CareTemplateService) CreateCareTemplate(
	userID uint,
	petID uint,
	req types.CreateCareTemplateRequest,
) error {
	if len(req.Items) == 0 {
		return errors.New("明細を1件以上入力してください")
	}

	fixedDaysText := joinFixedDays(req.FixedDaysOfWeek)
	fixedTime := req.FixedTime

	if !req.IsFixed {
		fixedDaysText = ""
		fixedTime = ""
	}

	template := models.CareTemplate{
		UserID:          userID,
		PetID:           petID,
		TemplateType:    req.TemplateType,
		Name:            req.Name,
		ImageKey:        req.ImageKey,
		IsFixed:         req.IsFixed,
		FixedDaysOfWeek: fixedDaysText,
		FixedTime:       fixedTime,
		Memo:            req.Memo,
		Items:           toCareTemplateItems(req.Items),
	}

	return s.careTemplateRepository.Create(&template)
}

/*
 * ケアテンプレート更新
 */
func (s *CareTemplateService) UpdateCareTemplate(
	userID uint,
	petID uint,
	templateID uint,
	req types.UpdateCareTemplateRequest,
) error {
	if len(req.Items) == 0 {
		return errors.New("明細を1件以上入力してください")
	}

	existingTemplate, err := s.careTemplateRepository.FindByID(userID, petID, templateID)
	if err != nil {
		return err
	}

	fixedDaysText := joinFixedDays(req.FixedDaysOfWeek)
	fixedTime := req.FixedTime

	if !req.IsFixed {
		fixedDaysText = ""
		fixedTime = ""
	}

	existingTemplate.TemplateType = req.TemplateType
	existingTemplate.Name = req.Name
	existingTemplate.ImageKey = req.ImageKey
	existingTemplate.IsFixed = req.IsFixed
	existingTemplate.FixedDaysOfWeek = fixedDaysText
	existingTemplate.FixedTime = fixedTime
	existingTemplate.Memo = req.Memo
	existingTemplate.Items = toCareTemplateItems(req.Items)

	return s.careTemplateRepository.Update(existingTemplate)
}

/*
 * ケアテンプレート削除
 */
func (s *CareTemplateService) DeleteCareTemplate(
	userID uint,
	petID uint,
	templateID uint,
) error {
	return s.careTemplateRepository.Delete(userID, petID, templateID)
}

/*
 * モデルからレスポンスへ変換
 */
func toCareTemplateResponse(template models.CareTemplate) types.CareTemplateResponse {
	items := make([]types.CareTemplateItemResponse, 0, len(template.Items))

	for _, item := range template.Items {
		items = append(items, types.CareTemplateItemResponse{
			ID:       item.ID,
			ItemName: item.ItemName,
			Amount:   item.Amount,
			Unit:     item.Unit,
		})
	}

	return types.CareTemplateResponse{
		ID:              template.ID,
		PetID:           template.PetID,
		TemplateType:    template.TemplateType,
		Name:            template.Name,
		ImageKey:        template.ImageKey,
		ImageURL:        buildImageURL(template.ImageKey),
		Items:           items,
		IsFixed:         template.IsFixed,
		FixedDaysOfWeek: splitFixedDays(template.FixedDaysOfWeek),
		FixedTime:       template.FixedTime,
		Memo:            template.Memo,
	}
}

/*
 * リクエスト明細からモデル明細へ変換
 */
func toCareTemplateItems(reqItems []types.CareTemplateItemRequest) []models.CareTemplateItem {
	items := make([]models.CareTemplateItem, 0, len(reqItems))

	for _, reqItem := range reqItems {
		items = append(items, models.CareTemplateItem{
			ItemName: reqItem.ItemName,
			Amount:   reqItem.Amount,
			Unit:     reqItem.Unit,
		})
	}

	return items
}

/*
 * 曜日配列をDB保存用文字列へ変換
 */
func joinFixedDays(days []string) string {
	return strings.Join(days, ",")
}

/*
 * DB保存文字列を曜日配列へ変換
 */
func splitFixedDays(daysText string) []string {
	if daysText == "" {
		return []string{}
	}

	return strings.Split(daysText, ",")
}

/*
 * 画像キーから表示用URLへ変換
 */
func buildImageURL(imageKey string) string {
	if imageKey == "" {
		return ""
	}

	cloudFrontDomain := strings.TrimRight(os.Getenv("CLOUDFRONT_DOMAIN"), "/")
	if cloudFrontDomain == "" {
		return ""
	}

	return cloudFrontDomain + "/" + imageKey
}
