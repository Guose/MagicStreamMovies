package routes

import (
	controller "github.com/Guose/MagicStreamMovies/Server/MagicStreamMoviesServer/controllers"
	"github.com/Guose/MagicStreamMovies/Server/MagicStreamMoviesServer/middleware"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetupProtectedRoutes(router *gin.Engine, client *mongo.Client) {
	router.Use(middleware.AuthMiddleware())
	{
		router.GET("/movie/:imdb_id", controller.GetMovie(client))
		router.POST("/addmovie", controller.AddMovie(client))
		router.GET("/recommendedmovies", controller.GetRecommendedMovies(client))
		router.PATCH("/updatereview/:imdb_id", controller.AdminReviewUpdate(client))
	}
}
