package logger

import (
	"encoding/json"
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

type AuditLog struct {
	LogType   string `json:"logType"`
	Action    string `json:"action"`
	Result    string `json:"result"`
	UserID    string `json:"userId,omitempty"`
	Email     string `json:"email,omitempty"`
	TargetID  string `json:"targetId,omitempty"`
	Target    string `json:"target,omitempty"`
	Method    string `json:"method,omitempty"`
	Path      string `json:"path,omitempty"`
	ClientIP  string `json:"clientIp,omitempty"`
	UserAgent string `json:"userAgent,omitempty"`
	Message   string `json:"message,omitempty"`
	CreatedAt string `json:"createdAt"`
}

func Audit(c *gin.Context, action string, result string, userID string, email string, target string, targetID string, message string) {
	auditLog := AuditLog{
		LogType:   "AUDIT",
		Action:    action,
		Result:    result,
		UserID:    userID,
		Email:     email,
		Target:    target,
		TargetID:  targetID,
		Method:    c.Request.Method,
		Path:      c.Request.URL.Path,
		ClientIP:  c.ClientIP(),
		UserAgent: c.Request.UserAgent(),
		Message:   message,
		CreatedAt: time.Now().Format(time.RFC3339),
	}

	bytes, err := json.Marshal(auditLog)
	if err != nil {
		log.Printf(`{"logType":"AUDIT","action":"%s","result":"ERROR","message":"failed to marshal audit log"}`, action)
		return
	}

	log.Println(string(bytes))
}