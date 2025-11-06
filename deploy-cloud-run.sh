#!/bin/bash

# Deploy script for Google Cloud Run
# Usage: ./deploy-cloud-run.sh YOUR_PROJECT_ID

set -e

PROJECT_ID=$1

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Error: PROJECT_ID is required"
  echo "Usage: ./deploy-cloud-run.sh YOUR_PROJECT_ID"
  exit 1
fi

echo "🚀 Starting deployment to Cloud Run..."
echo "📦 Project ID: $PROJECT_ID"

# Check if env.yaml exists
if [ ! -f "env.yaml" ]; then
  echo "❌ Error: env.yaml not found"
  echo "Please copy env.yaml.example to env.yaml and fill in your values"
  exit 1
fi

# Set project
echo "📝 Setting project..."
gcloud config set project $PROJECT_ID

# Enable APIs
echo "🔧 Enabling required APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com

# Build image
echo "🏗️  Building Docker image (this may take 5-10 minutes)..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/bepnha

# Deploy to Cloud Run
echo "🚢 Deploying to Cloud Run..."
gcloud run deploy bepnha \
  --image gcr.io/$PROJECT_ID/bepnha \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --env-vars-file env.yaml

echo "✅ Deployment complete!"
echo "🌐 Your app is now live!"
echo ""
echo "To view your app:"
echo "  gcloud run services describe bepnha --region asia-southeast1 --format 'value(status.url)'"
