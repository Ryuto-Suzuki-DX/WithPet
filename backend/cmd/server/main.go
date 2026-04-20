package main

import (
	"withpet/backend/internal/database"
	"withpet/backend/internal/routes"
)

func main() {
	database.Connect()

	r := routes.SetupRouter()

	r.Run(":8080")
}
