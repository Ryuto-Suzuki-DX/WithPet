#!/bin/bash
set -e

REGION="ap-northeast-1"

DB_PASSWORD=$(aws ssm get-parameter \
  --name /withpet/prod/DB_PASSWORD \
  --with-decryption \
  --region "$REGION" \
  --query "Parameter.Value" \
  --output text)

JWT_SECRET=$(aws ssm get-parameter \
  --name /withpet/prod/JWT_SECRET \
  --with-decryption \
  --region "$REGION" \
  --query "Parameter.Value" \
  --output text)

SMTP_PASSWORD=$(aws ssm get-parameter \
  --name /withpet/prod/SMTP_PASSWORD \
  --with-decryption \
  --region "$REGION" \
  --query "Parameter.Value" \
  --output text)

cat > .env <<EOF
# Database
DB_HOST=withpet-db.ch4s46cawu4y.ap-northeast-1.rds.amazonaws.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=withpet

# Auth
JWT_SECRET=${JWT_SECRET}

# CORS
FRONTEND_ORIGIN=http://13.115.76.106

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=zukishi.toryu13579@gmail.com
SMTP_PASSWORD=${SMTP_PASSWORD}
SMTP_FROM=zukishi.toryu13579@gmail.com
SMTP_FROM_NAME=WithPet

# AWS
AWS_REGION=ap-northeast-1
S3_BUCKET_NAME=withpet-user-images-ryuto-20260430
CLOUDFRONT_DOMAIN=https://d1svwkkdh1ud2k.cloudfront.net

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
EOF

chmod 600 .env

echo ".env generated from Parameter Store"
