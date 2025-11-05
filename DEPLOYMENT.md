# 🚀 Hướng dẫn Deployment chi tiết

## 📋 Mục lục

1. [Chuẩn bị](#chuẩn-bị)
2. [Firebase Setup](#firebase-setup)
3. [Google Cloud Setup](#google-cloud-setup)
4. [Deployment Options](#deployment-options)
5. [Monitoring & Logging](#monitoring--logging)
6. [Troubleshooting](#troubleshooting)

## Chuẩn bị

### 1. Account Requirements

- ✅ Gmail account
- ✅ Credit card (cho Google Cloud - nhưng sẽ không bị charge nếu dùng free tier)
- ✅ Repository trên GitHub/GitLab (optional cho CI/CD)

### 2. Install Tools

```bash
# Node.js (18+)
node --version

# Firebase CLI
npm install -g firebase-tools

# Google Cloud SDK
# Mac
brew install google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash

# Windows
# Download từ: https://cloud.google.com/sdk/docs/install
```

## Firebase Setup

### Bước 1: Tạo Firebase Project

1. Truy cập https://console.firebase.google.com/
2. Click "Add project"
3. Nhập tên project: `bepnha` (hoặc tên bạn muốn)
4. Chọn Google Analytics (optional)
5. Click "Create project"

### Bước 2: Setup Authentication

1. Trong Firebase Console, click **Authentication**
2. Click **Get Started**
3. Click tab **Sign-in method**
4. Enable **Email/Password**
5. Click **Save**

### Bước 3: Setup Firestore Database

1. Click **Firestore Database**
2. Click **Create database**
3. Chọn location: `asia-southeast1` (Singapore - gần VN nhất)
4. Chọn **Start in test mode** (sẽ config security rules sau)
5. Click **Enable**

### Bước 4: Setup Storage

1. Click **Storage**
2. Click **Get started**
3. Chọn **Start in test mode**
4. Chọn location: `asia-southeast1`
5. Click **Done**

### Bước 5: Config Security Rules

#### Firestore Rules

1. Vào **Firestore Database** > **Rules**
2. Paste code sau:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Recipes
    match /recipes/{recipeId} {
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow update, delete: if isAuthenticated() && isOwner(resource.data.userId);
    }

    // Menu Items
    match /menuItems/{menuItemId} {
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow update, delete: if isAuthenticated() && isOwner(resource.data.userId);
    }

    // Shopping Lists
    match /shoppingLists/{listId} {
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow update, delete: if isAuthenticated() && isOwner(resource.data.userId);
    }
  }
}
```

3. Click **Publish**

#### Storage Rules

1. Vào **Storage** > **Rules**
2. Paste code sau:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /recipes/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

### Bước 6: Lấy Firebase Config

1. Vào **Project Settings** (icon bánh răng)
2. Scroll xuống "Your apps"
3. Click icon **</>** (Web)
4. Nhập app nickname: "Bep Nha Web"
5. Check "Also set up Firebase Hosting"
6. Click **Register app**
7. Copy toàn bộ `firebaseConfig` object

### Bước 7: Setup Environment Variables

Tạo file `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bepnha-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bepnha-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bepnha-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Google Cloud Setup

### Bước 1: Enable Google Cloud

1. Truy cập https://console.cloud.google.com/
2. Chọn project (cùng tên với Firebase project)
3. Click **Enable Billing** (cần card nhưng sẽ không charge nếu ở free tier)

### Bước 2: Enable APIs

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com
```

### Bước 3: Setup Gemini API

1. Truy cập https://makersuite.google.com/app/apikey
2. Click **Create API key**
3. Chọn project
4. Copy API key

Thêm vào `.env.local`:

```bash
GOOGLE_GEMINI_API_KEY=AIzaSy...
```

## Deployment Options

### Option 1: Firebase Hosting (Khuyến nghị)

#### Ưu điểm:
- ✅ Miễn phí hoàn toàn
- ✅ CDN toàn cầu
- ✅ SSL certificate tự động
- ✅ Deploy nhanh

#### Nhược điểm:
- ❌ Chỉ cho static sites (cần export Next.js)
- ❌ Không có server-side rendering

#### Deploy Steps:

```bash
# 1. Login
firebase login

# 2. Init
firebase init hosting

# Chọn:
# - Existing project: bepnha-xxx
# - Public directory: out
# - Single-page app: Yes
# - GitHub deploys: No (hoặc Yes nếu muốn CI/CD)

# 3. Build
npm run build

# 4. Deploy
firebase deploy --only hosting
```

### Option 2: Cloud Run (Production)

#### Ưu điểm:
- ✅ Full Next.js features (SSR, API routes)
- ✅ Auto-scaling
- ✅ 2 million requests/month miễn phí
- ✅ Container-based (flexible)

#### Nhược điểm:
- ❌ Phức tạp hơn
- ❌ Cold start (nếu không có traffic)

#### Deploy Steps:

```bash
# 1. Login
gcloud auth login

# 2. Set project
gcloud config set project bepnha-xxx

# 3. Build container
gcloud builds submit --tag gcr.io/bepnha-xxx/bepnha

# 4. Deploy
gcloud run deploy bepnha \
  --image gcr.io/bepnha-xxx/bepnha \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID,GOOGLE_GEMINI_API_KEY=$GOOGLE_GEMINI_API_KEY"
```

#### Set env từ file:

```bash
# Tạo file env.yaml
cat > env.yaml <<EOF
NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "bepnha-xxx.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID: "bepnha-xxx"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "bepnha-xxx.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123456789"
NEXT_PUBLIC_FIREBASE_APP_ID: "1:123456789:web:abc123"
GOOGLE_GEMINI_API_KEY: "AIzaSy..."
EOF

# Deploy với env
gcloud run deploy bepnha \
  --image gcr.io/bepnha-xxx/bepnha \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --env-vars-file env.yaml
```

### Option 3: CI/CD với Cloud Build

#### Setup GitHub Integration

1. Vào Cloud Console > Cloud Build > Triggers
2. Click **Connect Repository**
3. Chọn GitHub, authorize
4. Chọn repository

#### Tạo cloudbuild.yaml

```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/bepnha', '.']

  # Push the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/bepnha']

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'bepnha'
      - '--image'
      - 'gcr.io/$PROJECT_ID/bepnha'
      - '--region'
      - 'asia-southeast1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

images:
  - 'gcr.io/$PROJECT_ID/bepnha'
```

#### Tạo trigger

```bash
gcloud builds triggers create github \
  --repo-name=bepnha-v2 \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

## Monitoring & Logging

### Firebase Console

1. **Authentication**: Xem users, sign-ins
2. **Firestore**: Monitor reads/writes
3. **Storage**: Monitor uploads/downloads

### Cloud Console

1. **Cloud Run**:
   - Metrics: Requests, latency, errors
   - Logs: Application logs
   - Revisions: Version history

2. **Cloud Logging**:
```bash
gcloud logging read "resource.type=cloud_run_revision" --limit 50
```

### Setup Alerts

```bash
# Alert khi có nhiều errors
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Error Rate" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05 \
  --condition-threshold-duration=60s
```

## Troubleshooting

### Build Errors

```bash
# Check build logs
gcloud builds list
gcloud builds log BUILD_ID
```

### Runtime Errors

```bash
# Check Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=bepnha" --limit 50
```

### Firebase Connection Issues

1. Check Firebase config trong `.env.local`
2. Verify Security Rules
3. Check Firebase Console > Usage

### Common Issues

#### 1. "Firebase: Error (auth/invalid-api-key)"
- Check `NEXT_PUBLIC_FIREBASE_API_KEY` trong env

#### 2. "Missing or insufficient permissions"
- Check Firestore Security Rules
- Verify user authentication

#### 3. "Failed to fetch" khi call API
- Check CORS settings
- Verify API endpoint URL

#### 4. Cold start lâu trên Cloud Run
- Increase min instances:
```bash
gcloud run services update bepnha --min-instances=1
```

## Performance Optimization

### 1. Enable CDN cho Cloud Run

```bash
gcloud run services update bepnha \
  --binary-authorization=default
```

### 2. Setup Cloud CDN

```bash
gcloud compute backend-services create bepnha-backend \
  --global \
  --enable-cdn
```

### 3. Optimize Images

- Sử dụng Next.js Image component
- Setup WebP format
- Enable lazy loading

## Cost Estimation

### Free Tier Limits

**Firebase**:
- Firestore: 50K reads, 20K writes, 20K deletes/day
- Storage: 5GB storage, 1GB/day download
- Authentication: Unlimited

**Cloud Run**:
- 2M requests/month
- 360K GB-seconds memory
- 180K vCPU-seconds

**Gemini API**:
- 60 requests/minute

### Ước tính cho 1000 users/month

- Requests: ~100K/month (5% of free tier) ✅
- Firestore: ~30K reads/day (60% of free tier) ✅
- Storage: ~2GB (40% of free tier) ✅

**Total cost: $0/month** 🎉

## Security Best Practices

1. ✅ Never commit `.env.local` to git
2. ✅ Use Firestore Security Rules
3. ✅ Enable Firebase App Check
4. ✅ Regular security audits
5. ✅ Monitor authentication logs

## Backup Strategy

### Firestore Backup

```bash
gcloud firestore export gs://bepnha-backup
```

### Automated Backups

Setup Cloud Scheduler:

```bash
gcloud scheduler jobs create http firestore-backup \
  --schedule="0 2 * * *" \
  --uri="https://firestore.googleapis.com/v1/projects/bepnha-xxx/databases/(default):exportDocuments" \
  --message-body='{"outputUriPrefix":"gs://bepnha-backup"}'
```

---

**Need help?** Open an issue on GitHub! 🚀
