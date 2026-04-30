package services

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"withpet/backend/internal/storage"
)

const maxImageSize = 5 * 1024 * 1024 // 5MB

type ImageService struct{}

type UploadImageResult struct {
	ImageURL string `json:"imageUrl"`
	ImageKey string `json:"imageKey"`
}

func NewImageService() *ImageService {
	return &ImageService{}
}

/*
 * 画像アップロード
 */
func (s *ImageService) UploadImage(
	ctx context.Context,
	userID uint,
	fileHeader *multipart.FileHeader,
) (*UploadImageResult, error) {
	if fileHeader == nil {
		return nil, fmt.Errorf("画像ファイルが指定されていません")
	}

	if fileHeader.Size > maxImageSize {
		return nil, fmt.Errorf("画像サイズは5MB以下にしてください")
	}

	file, err := fileHeader.Open()
	if err != nil {
		return nil, err
	}
	defer file.Close()

	body, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}

	contentType := http.DetectContentType(body)
	if !isAllowedImageContentType(contentType) {
		return nil, fmt.Errorf("許可されていない画像形式です")
	}

	ext := normalizeImageExtension(fileHeader.Filename, contentType)
	key := buildImageKey(userID, ext)

	s3Storage, err := storage.NewS3Storage(ctx)
	if err != nil {
		return nil, err
	}

	imageURL, err := s3Storage.Upload(ctx, key, body, contentType)
	if err != nil {
		return nil, err
	}

	return &UploadImageResult{
		ImageURL: imageURL,
		ImageKey: key,
	}, nil
}

func isAllowedImageContentType(contentType string) bool {
	switch contentType {
	case "image/jpeg", "image/png", "image/webp":
		return true
	default:
		return false
	}
}

func normalizeImageExtension(filename string, contentType string) string {
	ext := strings.ToLower(filepath.Ext(filename))

	switch ext {
	case ".jpg", ".jpeg", ".png", ".webp":
		return ext
	}

	switch contentType {
	case "image/jpeg":
		return ".jpg"
	case "image/png":
		return ".png"
	case "image/webp":
		return ".webp"
	default:
		return ".jpg"
	}
}

func buildImageKey(userID uint, ext string) string {
	timestamp := time.Now().Format("20060102150405")
	userIDText := strconv.FormatUint(uint64(userID), 10)

	return filepath.ToSlash(
		filepath.Join(
			"users",
			userIDText,
			timestamp+ext,
		),
	)
}
