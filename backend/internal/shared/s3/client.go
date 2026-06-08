package s3

import (
	"context"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Client struct {
	client *s3.Client
	bucket string
}

func NewS3Client(region, bucket string) (*S3Client, error) {
	cfg, err := config.LoadDefaultConfig(context.Background(), config.WithRegion(region))
	if err != nil {
		return nil, fmt.Errorf("load aws config: %w", err)
	}

	client := s3.NewFromConfig(cfg)
	return &S3Client{client: client, bucket: bucket}, nil
}

func (c *S3Client) GeneratePresignedUploadURL(ctx context.Context, key string, expiresIn time.Duration) (string, error) {
	presignClient := s3.NewPresignClient(c.client)

	req, err := presignClient.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(c.bucket),
		Key:    aws.String(key),
	}, s3.WithPresignExpires(expiresIn))
	if err != nil {
		return "", fmt.Errorf("generate presigned upload url: %w", err)
	}

	return req.URL, nil
}

func (c *S3Client) GeneratePresignedDownloadURL(ctx context.Context, key string, expiresIn time.Duration) (string, error) {
	presignClient := s3.NewPresignClient(c.client)

	req, err := presignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(c.bucket),
		Key:    aws.String(key),
	}, s3.WithPresignExpires(expiresIn))
	if err != nil {
		return "", fmt.Errorf("generate presigned download url: %w", err)
	}

	return req.URL, nil
}
