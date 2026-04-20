package main

import (
	"withpet/backend/internal/database"
)

func main() {
	database.Connect()
	database.Migrate()
}
