package routes

import (
	authHandlers "withpet/backend/internal/auth/handlers"
	authMiddlewares "withpet/backend/internal/auth/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(rg *gin.RouterGroup) {
	auth := rg.Group("/auth")
	{
		auth.POST("/login", authHandlers.Login)
		auth.GET("/me", authMiddlewares.AuthMiddleware(), authHandlers.Me)
	}
}
