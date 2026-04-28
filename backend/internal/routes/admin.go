package routes

import (
	adminBuilder "withpet/backend/internal/admin/builders"
	adminHandlers "withpet/backend/internal/admin/handlers"
	adminRepositories "withpet/backend/internal/admin/repositories"
	adminServices "withpet/backend/internal/admin/services"
	authMiddlewares "withpet/backend/internal/auth/middlewares"

	"github.com/gin-gonic/gin"
)

/*
 * 管理者用API窓口
 */

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
		// ユーザー関連
		// 検索・ページロード時検索
		admin.GET("/users", userHandler.SearchUsers)
		// 新規作成
		admin.POST("/users", userHandler.CreateUser)
		// 編集
		admin.POST("/users/edit", userHandler.UpdateUser)
		// 削除
		admin.POST("/users/delete", userHandler.DeleteUser)
	}
}
