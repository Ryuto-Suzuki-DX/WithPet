package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		roleValue, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "権限情報が取得できません",
			})
			c.Abort()
			return
		}

		role, ok := roleValue.(string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "権限情報の形式が不正です",
			})
			c.Abort()
			return
		}

		if role != "ADMIN" {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "管理者権限が必要です",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
