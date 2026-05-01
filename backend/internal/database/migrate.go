package database

import (
	"log"

	"withpet/backend/internal/models"
)

func Migrate() {
	err := DB.AutoMigrate(
		&models.User{},
		&models.Pet{},
		&models.UserSetting{},
		&models.PetEvent{},
		&models.PetEventItem{},
		&models.CareTemplate{},
		&models.CareTemplateItem{},
	)
	if err != nil {
		log.Fatal("failed to migrate database: ", err)
	}

	log.Println("database migrated")
}
