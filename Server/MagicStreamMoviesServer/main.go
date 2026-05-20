package main

import (
	"fmt"

	"github.com/Guose/MagicStreamMovies/Server/MagicStreamMoviesServer/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	// This is the main function

	fmt.Println("Welcome to Magic Stream Movies Server!")

	router := gin.Default()
	router.GET("/health", func(c *gin.Context) {
		c.String(200, "Healthy, Magic Stream Movies Server is running!")
	})

	routes.SetupUnProtectedRoutes(router)
	routes.SetupProtectedRoutes(router)

	if err := router.Run(":8080"); err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
	}
}
