package middlewares

import (
	"net/http"
	"strings"

	"withpet/backend/internal/auth/utils"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "認証情報がありません",
			})
			c.Abort()
			return
		}

		// "Bearer xxx" 形式を想定
		headerParts := strings.SplitN(authHeader, " ", 2)
		if len(headerParts) != 2 || headerParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "認証ヘッダーの形式が不正です",
			})
			c.Abort()
			return
		}

		tokenString := headerParts[1]

		claims, err := utils.ParseJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "トークンが不正です",
			})
			c.Abort()
			return
		}

		// 後続の handler で使えるように保存
		c.Set("userId", claims.UserID)
		c.Set("name", claims.Name)
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)

		c.Next()
	}
}
