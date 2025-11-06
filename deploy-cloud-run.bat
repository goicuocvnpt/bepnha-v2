@echo off
REM Deploy script for Google Cloud Run (Windows)
REM Usage: deploy-cloud-run.bat YOUR_PROJECT_ID

setlocal

set PROJECT_ID=%1

if "%PROJECT_ID%"=="" (
  echo ❌ Error: PROJECT_ID is required
  echo Usage: deploy-cloud-run.bat YOUR_PROJECT_ID
  exit /b 1
)

echo 🚀 Starting deployment to Cloud Run...
echo 📦 Project ID: %PROJECT_ID%

REM Check if env.yaml exists
if not exist "env.yaml" (
  echo ❌ Error: env.yaml not found
  echo Please copy env.yaml.example to env.yaml and fill in your values
  exit /b 1
)

REM Set project
echo 📝 Setting project...
gcloud config set project %PROJECT_ID%

REM Enable APIs
echo 🔧 Enabling required APIs...
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com

REM Build image
echo 🏗️  Building Docker image (this may take 5-10 minutes)...
gcloud builds submit --tag gcr.io/%PROJECT_ID%/bepnha

REM Deploy to Cloud Run
echo 🚢 Deploying to Cloud Run...
gcloud run deploy bepnha ^
  --image gcr.io/%PROJECT_ID%/bepnha ^
  --platform managed ^
  --region asia-southeast1 ^
  --allow-unauthenticated ^
  --memory 512Mi ^
  --cpu 1 ^
  --max-instances 10 ^
  --env-vars-file env.yaml

echo ✅ Deployment complete!
echo 🌐 Your app is now live!
echo.
echo To view your app:
echo   gcloud run services describe bepnha --region asia-southeast1 --format "value(status.url)"

endlocal
