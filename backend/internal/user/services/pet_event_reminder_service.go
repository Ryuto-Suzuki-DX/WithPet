package services

import (
	"fmt"
	"time"

	"withpet/backend/internal/models"
	"withpet/backend/internal/user/builders"
	"withpet/backend/internal/user/repositories"
)

type PetEventReminderService struct {
	petEventRepository *repositories.PetEventRepository
	petEventBuilder    *builders.PetEventBuilder
	userRepository     *repositories.UserRepository
}

func NewPetEventReminderService(
	petEventRepository *repositories.PetEventRepository,
	petEventBuilder *builders.PetEventBuilder,
	userRepository *repositories.UserRepository,
) *PetEventReminderService {
	return &PetEventReminderService{
		petEventRepository: petEventRepository,
		petEventBuilder:    petEventBuilder,
		userRepository:     userRepository,
	}
}

/*
 * 送信時刻を過ぎたイベントのリマインドメールを送信する
 */
func (s *PetEventReminderService) SendDueRemindEmails() (int, error) {
	now := time.Now()

	query := s.petEventBuilder.BuildDueRemindEventsQuery(now, 50)

	events, err := s.petEventRepository.FindDueRemindEvents(query)
	if err != nil {
		return 0, err
	}

	sentCount := 0
	var lastErr error

	for _, event := range events {
		if err := s.sendEventRemindEmail(event, now); err != nil {
			lastErr = err
			continue
		}

		sentCount++
	}

	if sentCount == 0 && lastErr != nil {
		return sentCount, lastErr
	}

	return sentCount, nil
}

/*
 * 1件分のイベントリマインドメールを送信する
 */
func (s *PetEventReminderService) sendEventRemindEmail(
	event models.PetEvent,
	now time.Time,
) error {
	user, err := s.userRepository.FindUserByID(event.UserID)
	if err != nil {
		return err
	}

	if user.Email == "" {
		return fmt.Errorf("送信先メールアドレスが設定されていません userID=%d", event.UserID)
	}

	subject := "【WithPet】リマインド通知"

	body := buildEventRemindMailBody(user.Name, event)

	if err := sendPlainMail(user.Email, subject, body); err != nil {
		return err
	}

	return s.petEventRepository.MarkRemindSent(event.ID, now)
}

/*
 * リマインドメール本文作成
 */
func buildEventRemindMailBody(
	userName string,
	event models.PetEvent,
) string {
	eventAtText := event.EventAt.Format("2006/01/02 15:04")

	remindAtText := "-"
	if event.RemindAt != nil {
		remindAtText = event.RemindAt.Format("2006/01/02 15:04")
	}

	memoText := event.Memo
	if memoText == "" {
		memoText = "なし"
	}

	return fmt.Sprintf(`%s さん

WithPetからのリマインド通知です。

以下の予定・記録のリマインド時刻になりました。

【内容】
タイトル：%s
区分：%s
対象日時：%s
リマインド日時：%s
メモ：%s

※このメールはWithPetから自動送信されています。
`, userName, event.Title, event.EventType, eventAtText, remindAtText, memoText)
}
