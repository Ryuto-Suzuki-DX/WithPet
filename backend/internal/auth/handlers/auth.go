package handlers

import (
	"net/http"

	"withpet/backend/internal/auth/repositories"
	"withpet/backend/internal/auth/services"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var req LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "リクエスト形式が不正です。",
			"error":   err.Error(),
		})
		return
	}

	authRepository := repositories.NewAuthRepository()
	authService := services.NewAuthService(authRepository)

	res, err := authService.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
