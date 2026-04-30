package services

import (
	"withpet/backend/internal/models"
	"withpet/backend/internal/user/repositories"
	"withpet/backend/internal/user/types"
)

type UserSettingService struct {
	userSettingRepository *repositories.UserSettingRepository
}

func NewUserSettingService(
	userSettingRepository *repositories.UserSettingRepository,
) *UserSettingService {
	return &UserSettingService{
		userSettingRepository: userSettingRepository,
	}
}

/*
 * リマインド設定取得
 *
 * 設定がまだ存在しない場合は、デフォルト値で作成して返す
 */
func (s *UserSettingService) GetRemindSetting(userID uint) (*types.RemindSettingResponse, error) {
	setting, err := s.userSettingRepository.FindByUserID(userID)

	if err != nil {
		if !s.userSettingRepository.IsRecordNotFound(err) {
			return nil, err
		}

		setting = &models.UserSetting{
			UserID:           userID,
			RemindDaysBefore: 1,
			RemindHour:       9,
			IsEmailEnabled:   true,
		}

		if err := s.userSettingRepository.Create(setting); err != nil {
			return nil, err
		}
	}

	return &types.RemindSettingResponse{
		RemindDaysBefore: setting.RemindDaysBefore,
		RemindHour:       setting.RemindHour,
		IsEmailEnabled:   setting.IsEmailEnabled,
	}, nil
}

/*
 * リマインド設定更新
 */
func (s *UserSettingService) UpdateRemindSetting(
	userID uint,
	req types.UpdateRemindSettingRequest,
) error {
	setting, err := s.userSettingRepository.FindByUserID(userID)

	if err != nil {
		if !s.userSettingRepository.IsRecordNotFound(err) {
			return err
		}

		setting = &models.UserSetting{
			UserID: userID,
		}
	}

	setting.RemindDaysBefore = req.RemindDaysBefore
	setting.RemindHour = req.RemindHour
	setting.IsEmailEnabled = req.IsEmailEnabled

	if setting.ID == 0 {
		return s.userSettingRepository.Create(setting)
	}

	return s.userSettingRepository.Update(setting)
}
