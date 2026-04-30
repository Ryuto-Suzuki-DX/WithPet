package main

import (
	"withpet/backend/internal/database"
	"withpet/backend/internal/jobs"
	"withpet/backend/internal/routes"
)

func main() {
	database.Connect()

	r := routes.SetupRouter()

	jobs.StartPetEventReminderJob()

	r.Run(":8080")
}
