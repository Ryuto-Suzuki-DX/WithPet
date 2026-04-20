package utils

/*
 * jwt発行
 */

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("withpet-secret-key")

type CustomClaims struct {
	UserID string `json:"userId"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateJWT(userID string, name string, email string, role string) (string, error) {
	claims := CustomClaims{
		UserID: userID,
		Name:   name,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ParseJWT(tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		&CustomClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		},
	)
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return nil, err
	}

	return claims, nil
}
