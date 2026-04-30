package jobs

/*
 * リマインダーのトリガーとなるところ
 */
import (
	"log"
	"sync"
	"time"

	userBuilders "withpet/backend/internal/user/builders"
	userRepositories "withpet/backend/internal/user/repositories"
	userServices "withpet/backend/internal/user/services"
)

var petEventReminderJobOnce sync.Once

/*
 * ペットイベントリマインド送信ジョブ開始
 *
 * 1分ごとに、送信時刻を過ぎた未送信イベントを確認してメール送信する
 */
func StartPetEventReminderJob() {
	petEventReminderJobOnce.Do(func() {
		userRepository := userRepositories.NewUserRepository()
		petEventRepository := userRepositories.NewPetEventRepository()
		petEventBuilder := userBuilders.NewPetEventBuilder()

		reminderService := userServices.NewPetEventReminderService(
			petEventRepository,
			petEventBuilder,
			userRepository,
		)

		go func() {
			log.Println("pet event reminder job started")

			runPetEventReminderJob(reminderService)

			ticker := time.NewTicker(1 * time.Minute)
			defer ticker.Stop()

			for range ticker.C {
				runPetEventReminderJob(reminderService)
			}
		}()
	})
}

/*
 * リマインド送信ジョブ本体
 */
func runPetEventReminderJob(
	reminderService *userServices.PetEventReminderService,
) {
	sentCount, err := reminderService.SendDueRemindEmails()
	if err != nil {
		log.Println("pet event reminder job error:", err)
		return
	}

	if sentCount > 0 {
		log.Printf("pet event reminder sent count: %d\n", sentCount)
	}
}
