package storage

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Storage struct {
	client           *s3.Client
	bucketName       string
	cloudFrontDomain string
}

func NewS3Storage(ctx context.Context) (*S3Storage, error) {
	region := os.Getenv("AWS_REGION")
	bucketName := os.Getenv("S3_BUCKET_NAME")
	cloudFrontDomain := os.Getenv("CLOUDFRONT_DOMAIN")

	if region == "" {
		region = "ap-northeast-1"
	}

	if bucketName == "" {
		return nil, fmt.Errorf("S3_BUCKET_NAME is not set")
	}

	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion(region))
	if err != nil {
		return nil, err
	}

	return &S3Storage{
		client:           s3.NewFromConfig(cfg),
		bucketName:       bucketName,
		cloudFrontDomain: strings.TrimRight(cloudFrontDomain, "/"),
	}, nil
}

func (s *S3Storage) Upload(ctx context.Context, key string, body []byte, contentType string) (string, error) {
	if key == "" {
		return "", fmt.Errorf("s3 key is empty")
	}

	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      &s.bucketName,
		Key:         &key,
		Body:        bytes.NewReader(body),
		ContentType: &contentType,
	})
	if err != nil {
		return "", err
	}

	if s.cloudFrontDomain != "" {
		return fmt.Sprintf("%s/%s", s.cloudFrontDomain, key), nil
	}

	return fmt.Sprintf("https://%s.s3.amazonaws.com/%s", s.bucketName, key), nil
}
