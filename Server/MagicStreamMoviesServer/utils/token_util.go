package utils

import (
	"context"
	"errors"
	"os"
	"time"

	"github.com/Guose/MagicStreamMovies/Server/MagicStreamMoviesServer/database"
	"github.com/gin-gonic/gin"
	jwt "github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type SignedDetails struct {
	Email     string
	FirstName string
	LastName  string
	Role      string
	UserID    string
	jwt.RegisteredClaims
}

var SECRET_KEY string = os.Getenv("SECRET_KEY")
var SECRET_REFRESH_KEY string = os.Getenv("SECRET_REFRESH_KEY")

var userCollection *mongo.Collection = database.OpenCollection("users")

func GenerateAllTokens(email, firstName, lastName, role, userID string) (string, string, error) {
	claims := &SignedDetails{
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
		Role:      role,
		UserID:    userID,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "MagicStreamMovies",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(SECRET_KEY))

	if err != nil {
		return "", "", err
	}

	refreshClaims := &SignedDetails{
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
		Role:      role,
		UserID:    userID,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "MagicStreamMovies",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * 7 * time.Hour)),
		},
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	signedRefreshToken, err := refreshToken.SignedString([]byte(SECRET_REFRESH_KEY))

	if err != nil {
		return "", "", err
	}

	return signedToken, signedRefreshToken, nil
}

func UpdateAllTokens(signedToken, signedRefreshToken, userID string) error {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	updateAt, _ := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))

	updateObj := bson.M{
		"$set": bson.M{
			"token":         signedToken,
			"refresh_token": signedRefreshToken,
			"updated_at":    updateAt,
		},
	}
	_, err := userCollection.UpdateOne(ctx, bson.M{"user_id": userID}, updateObj)
	if err != nil {
		return err
	}

	return nil
}

func GetAccessToken(c *gin.Context) (string, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return "", errors.New("Authorization header is required")
	}
	token := authHeader[len("Bearer "):]

	if token == "" {
		return "", errors.New("Bearer token is required")
	}

	return token, nil
}

func ValidateToken(signedToken string) (*SignedDetails, error) {
	claims := &SignedDetails{}

	token, err := jwt.ParseWithClaims(signedToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(SECRET_KEY), nil
	})

	if err != nil {
		return nil, err
	}

	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		return nil, err
	}

	if claims.ExpiresAt.Time.Before(time.Now()) {
		return nil, errors.New("Token is expired")
	}

	return claims, nil
}

func GetUserIdFromContext(c *gin.Context) (string, error) {
	userId, exists := c.Get("userId")
	if !exists {
		return "", errors.New("User ID not found in context")
	}

	id, ok := userId.(string)

	if !ok {
		return "", errors.New("unable to retrieve userId")
	}

	return id, nil
}
