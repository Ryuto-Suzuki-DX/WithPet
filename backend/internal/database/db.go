package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println(".env not found, using system environment variables")
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Tokyo",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	log.Println("DB_HOST =", os.Getenv("DB_HOST"))
	log.Println("DB_USER =", os.Getenv("DB_USER"))
	log.Println("DB_PASSWORD =", os.Getenv("DB_PASSWORD"))
	log.Println("DB_NAME =", os.Getenv("DB_NAME"))
	log.Println("DB_PORT =", os.Getenv("DB_PORT"))

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}

	DB = db

	log.Println("database connected")
}
