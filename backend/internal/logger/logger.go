package logger

import "log"

func Info(message string) {
	log.Println("[INFO]", message)
}

func Warn(message string) {
	log.Println("[WARN]", message)
}

func Error(message string, err error) {
	if err != nil {
		log.Println("[ERROR]", message, err.Error())
		return
	}
	log.Println("[ERROR]", message)
}

func Infof(format string, args ...interface{}) {
	log.Printf("[INFO] "+format, args...)
}

func Warnf(format string, args ...interface{}) {
	log.Printf("[WARN] "+format, args...)
}

func Errorf(format string, args ...interface{}) {
	log.Printf("[ERROR] "+format, args...)
}
