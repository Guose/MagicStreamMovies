package routes

import (
	controller "github.com/Guose/MagicStreamMovies/Server/MagicStreamMoviesServer/controllers"
	"github.com/Guose/MagicStreamMovies/Server/MagicStreamMoviesServer/middleware"
	"github.com/gin-gonic/gin"
)

func SetupProtectedRoutes(router *gin.Engine) {
	router.Use(middleware.AuthMiddleware())
	{
		router.GET("/movie/:imdb_id", controller.GetMovie())
		router.POST("/addmovie", controller.AddMovie())
		router.GET("/recommendedmovies", controller.GetRecommendedMovies())
	}
}
