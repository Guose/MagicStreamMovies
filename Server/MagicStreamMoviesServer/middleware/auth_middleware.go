package middleware

import (
	"net/http"

	"github.com/Guose/MagicStreamMovies/Server/MagicStreamMoviesServer/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := utils.GetAccessToken(c)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: " + err.Error()})
			c.Abort()
			return
		}

		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
			c.Abort()
			return
		}

		claims, err := utils.ValidateToken(token)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: " + err.Error()})
			c.Abort()
			return
		}
		c.Set("userId", claims.UserID)
		c.Set("role", claims.Role)
		c.Set("claims", claims)
		c.Next()
	}
}
