package routes

import (
	adminBuilder "withpet/backend/internal/admin/builder"
	adminHandlers "withpet/backend/internal/admin/handlers"
	adminRepositories "withpet/backend/internal/admin/repositories"
	adminServices "withpet/backend/internal/admin/services"
	authMiddlewares "withpet/backend/internal/auth/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterAdminRoutes(rg *gin.RouterGroup) {
	// 依存関係を組み立てる
	userRepository := adminRepositories.NewUserRepository()
	userBuilder := adminBuilder.NewUserBuilder()
	userService := adminServices.NewUserService(userRepository, userBuilder)
	userHandler := adminHandlers.NewUserHandler(userService)

	admin := rg.Group("/admin")
	admin.Use(
		authMiddlewares.AuthMiddleware(),
		authMiddlewares.AdminMiddleware(),
	)
	{
		admin.GET("/users", userHandler.SearchUsers)
		admin.POST("/users", userHandler.CreateUser)
	}
}
