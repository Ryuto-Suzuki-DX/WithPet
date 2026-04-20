package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type MeUser struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type MeResponse struct {
	User MeUser `json:"user"`
}

func Me(c *gin.Context) {
	userIDValue, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "ユーザー情報が取得できません",
		})
		return
	}

	nameValue, exists := c.Get("name")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "ユーザー情報が取得できません",
		})
		return
	}

	emailValue, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "ユーザー情報が取得できません",
		})
		return
	}

	roleValue, exists := c.Get("role")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "ユーザー情報が取得できません",
		})
		return
	}

	userID, ok := userIDValue.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "ユーザーIDの形式が不正です",
		})
		return
	}

	name, ok := nameValue.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "ユーザー名の形式が不正です",
		})
		return
	}

	email, ok := emailValue.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "メールアドレスの形式が不正です",
		})
		return
	}

	role, ok := roleValue.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "権限情報の形式が不正です",
		})
		return
	}

	c.JSON(http.StatusOK, MeResponse{
		User: MeUser{
			ID:    userID,
			Name:  name,
			Email: email,
			Role:  role,
		},
	})
}
