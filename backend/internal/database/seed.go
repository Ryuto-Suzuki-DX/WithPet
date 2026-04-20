package database

import (
	"log"

	"withpet/backend/internal/models"

	"golang.org/x/crypto/bcrypt"
)

func Seed() {
	var count int64

	DB.Model(&models.User{}).Where("email = ?", "admin@example.com").Count(&count)
	if count > 0 {
		log.Println("seed skipped: admin user already exists")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin1234"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("failed to hash password: ", err)
	}

	admin := models.User{
		Name:     "Admin",
		Email:    "admin@example.com",
		Password: string(hashedPassword),
	}

	if err := DB.Create(&admin).Error; err != nil {
		log.Fatal("failed to seed admin user: ", err)
	}

	log.Println("seed completed")
}
