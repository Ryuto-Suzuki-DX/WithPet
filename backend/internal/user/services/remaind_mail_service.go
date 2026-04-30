package services

import (
	"errors"
	"fmt"
	"mime"
	"net/smtp"
	"os"
	"strings"

	"withpet/backend/internal/user/repositories"
)

type RemindMailService struct {
	userRepository *repositories.UserRepository
}

func NewRemindMailService(
	userRepository *repositories.UserRepository,
) *RemindMailService {
	return &RemindMailService{
		userRepository: userRepository,
	}
}

/*
 * リマインドテストメール送信
 *
 * ログイン中ユーザーのメールアドレス宛にテストメールを送信する
 */
func (s *RemindMailService) SendTestEmail(userID uint) error {
	user, err := s.userRepository.FindUserByID(userID)
	if err != nil {
		return err
	}

	if user.Email == "" {
		return errors.New("送信先メールアドレスが設定されていません")
	}

	subject := "【WithPet】リマインドテストメール"

	body := fmt.Sprintf(`%s さん

WithPetからのリマインドテストメールです。

このメールが届いていれば、メール通知の送信設定は正常に動作しています。

※このメールはテスト送信です。
`, user.Name)

	return sendPlainMail(user.Email, subject, body)
}

/*
 * プレーンテキストメール送信
 *
 * SMTP設定は環境変数から取得する
 */
func sendPlainMail(to string, subject string, body string) error {
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USERNAME")
	smtpPassword := os.Getenv("SMTP_PASSWORD")
	smtpFrom := os.Getenv("SMTP_FROM")
	smtpFromName := os.Getenv("SMTP_FROM_NAME")

	if smtpHost == "" {
		return errors.New("SMTP_HOST が設定されていません")
	}

	if smtpPort == "" {
		return errors.New("SMTP_PORT が設定されていません")
	}

	if smtpFrom == "" {
		smtpFrom = smtpUser
	}

	if smtpFrom == "" {
		return errors.New("SMTP_FROM または SMTP_USERNAME が設定されていません")
	}

	if smtpFromName == "" {
		smtpFromName = "WithPet"
	}

	address := smtpHost + ":" + smtpPort

	var auth smtp.Auth
	if smtpUser != "" && smtpPassword != "" {
		auth = smtp.PlainAuth("", smtpUser, smtpPassword, smtpHost)
	}

	encodedSubject := mime.QEncoding.Encode("UTF-8", subject)
	encodedFromName := mime.QEncoding.Encode("UTF-8", smtpFromName)

	message := strings.Join([]string{
		fmt.Sprintf("From: %s <%s>", encodedFromName, smtpFrom),
		fmt.Sprintf("To: %s", to),
		fmt.Sprintf("Subject: %s", encodedSubject),
		"MIME-Version: 1.0",
		"Content-Type: text/plain; charset=UTF-8",
		"Content-Transfer-Encoding: 8bit",
		"",
		body,
	}, "\r\n")

	return smtp.SendMail(
		address,
		auth,
		smtpFrom,
		[]string{to},
		[]byte(message),
	)
}
