package routes

import (
	authMiddlewares "withpet/backend/internal/auth/middlewares"
	userBuilders "withpet/backend/internal/user/builders"
	userHandlers "withpet/backend/internal/user/handlers"
	userRepositories "withpet/backend/internal/user/repositories"
	userServices "withpet/backend/internal/user/services"

	"github.com/gin-gonic/gin"
)

/*
 * 一般ユーザー用API窓口
 */
func RegisterUserRoutes(rg *gin.RouterGroup) {
	// ログイン後のマイページ
	userRepository := userRepositories.NewUserRepository()
	petRepository := userRepositories.NewPetRepository()
	userService := userServices.NewUserService(userRepository, petRepository)
	userHandler := userHandlers.NewUserHandler(userService)

	// リマインド設定
	userSettingRepository := userRepositories.NewUserSettingRepository()
	userSettingService := userServices.NewUserSettingService(userSettingRepository)
	userSettingHandler := userHandlers.NewUserSettingHandler(userSettingService)

	// リマインドメール
	remindMailService := userServices.NewRemindMailService(userRepository)
	remindMailHandler := userHandlers.NewRemindMailHandler(remindMailService)

	// ペットイベント
	petEventRepository := userRepositories.NewPetEventRepository()
	petEventBuilder := userBuilders.NewPetEventBuilder()
	petEventService := userServices.NewPetEventService(petEventRepository, petEventBuilder)
	petEventHandler := userHandlers.NewPetEventHandler(petEventService)

	// ケアテンプレート
	careTemplateRepository := userRepositories.NewCareTemplateRepository()
	careTemplateBuilder := userBuilders.NewCareTemplateBuilder()
	careTemplateService := userServices.NewCareTemplateService(
		careTemplateRepository,
		careTemplateBuilder,
	)
	careTemplateHandler := userHandlers.NewCareTemplateHandler(careTemplateService)

	// 画像アップロード
	imageService := userServices.NewImageService()
	imageHandler := userHandlers.NewImageHandler(imageService)

	user := rg.Group("/user")
	user.Use(
		authMiddlewares.AuthMiddleware(),
	)
	{
		// マイページ
		user.GET("/mypage", userHandler.GetMyPage)

		// 画像アップロード
		user.POST("/images", imageHandler.UploadImage)

		// リマインド設定
		user.GET("/settings/remind", userSettingHandler.GetRemindSetting)
		user.POST("/settings/remind/test-email", remindMailHandler.SendTestEmail)

		// ペットイベント
		user.GET("/pets/:petId/events", petEventHandler.GetPetEvents)
		user.POST("/pets/:petId/events", petEventHandler.CreatePetEvent)
		user.PUT("/pets/:petId/events/:eventId", petEventHandler.UpdatePetEvent)
		user.DELETE("/pets/:petId/events/:eventId", petEventHandler.DeletePetEvent)

		// ケアテンプレート
		user.GET("/pets/:petId/care-templates", careTemplateHandler.GetCareTemplates)
		user.POST("/pets/:petId/care-templates", careTemplateHandler.CreateCareTemplate)
		user.PUT("/pets/:petId/care-templates/:templateId", careTemplateHandler.UpdateCareTemplate)
		user.DELETE("/pets/:petId/care-templates/:templateId", careTemplateHandler.DeleteCareTemplate)
	}
}
