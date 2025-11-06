# 🚀 Hướng dẫn Deploy chi tiết - Bước từng bước

## 📋 Lựa chọn phương thức Deploy

**Ứng dụng Bếp Nhà có API routes và server-side features** → Có 3 options:

| Option | Độ khó | Chi phí | Tốc độ | Khuyến nghị |
|--------|--------|---------|--------|-------------|
| **A. Cloud Run** | ⭐⭐ | Free tier | Nhanh | ✅ **KHUYẾN NGHỊ** |
| B. Vercel | ⭐ | Free | Rất nhanh | ✅ Dễ nhất |
| C. Firebase Hosting + Functions | ⭐⭐⭐ | Free tier | Trung bình | Phức tạp |

---

## 🎯 OPTION A: Google Cloud Run (KHUYẾN NGHỊ)

### ✅ Ưu điểm:
- Hoàn toàn miễn phí (2M requests/month)
- Hỗ trợ đầy đủ Next.js features
- Auto-scaling
- Dễ setup

### 📝 Các bước thực hiện:

#### Bước 1: Chuẩn bị môi trường

```bash
# Mở Command Prompt hoặc PowerShell
# Đảm bảo bạn đang ở thư mục gốc của project
cd C:\bepnha

# Kiểm tra xem có đúng thư mục không
dir

# Bạn phải thấy: package.json, next.config.ts, app, components, lib
```

#### Bước 2: Cài đặt Google Cloud SDK

**Windows:**
1. Download từ: https://cloud.google.com/sdk/docs/install
2. Chạy file installer `GoogleCloudSDKInstaller.exe`
3. Làm theo hướng dẫn, chọn "Install bundled Python"
4. Restart Command Prompt sau khi cài xong

**Verify installation:**
```bash
gcloud --version
```

#### Bước 3: Login và Setup Project

```bash
# Login vào Google Cloud
gcloud auth login

# List các projects (hoặc tạo mới trên console.cloud.google.com)
gcloud projects list

# Set project ID (thay YOUR_PROJECT_ID bằng Firebase project ID của bạn)
gcloud config set project YOUR_PROJECT_ID

# Enable các APIs cần thiết
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com
```

#### Bước 4: Tạo file .env.production

```bash
# Tạo file .env.production trong thư mục gốc
# Copy từ .env.local
copy .env.local .env.production
```

#### Bước 5: Build và Deploy

```bash
# Build Docker image (có thể mất 5-10 phút)
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/bepnha

# Deploy lên Cloud Run
gcloud run deploy bepnha ^
  --image gcr.io/YOUR_PROJECT_ID/bepnha ^
  --platform managed ^
  --region asia-southeast1 ^
  --allow-unauthenticated ^
  --memory 512Mi ^
  --cpu 1 ^
  --max-instances 10 ^
  --set-env-vars NEXT_PUBLIC_FIREBASE_API_KEY=your_key,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain,NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender,NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id,GOOGLE_GEMINI_API_KEY=your_gemini_key
```

**⚠️ Lưu ý:** Thay thế tất cả `YOUR_PROJECT_ID` và các giá trị environment variables bằng giá trị thực của bạn.

#### Bước 6: Set Environment Variables (Cách dễ hơn)

Thay vì command dài, tạo file `env.yaml`:

```yaml
NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "bepnha-xxx.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID: "bepnha-xxx"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "bepnha-xxx.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123456789"
NEXT_PUBLIC_FIREBASE_APP_ID: "1:123456789:web:abc123"
GOOGLE_GEMINI_API_KEY: "AIzaSy..."
```

Sau đó deploy:

```bash
gcloud run deploy bepnha ^
  --image gcr.io/YOUR_PROJECT_ID/bepnha ^
  --platform managed ^
  --region asia-southeast1 ^
  --allow-unauthenticated ^
  --env-vars-file env.yaml
```

#### Bước 7: Kiểm tra

Sau khi deploy xong, bạn sẽ nhận được URL:
```
Service URL: https://bepnha-xxxxx-as.a.run.app
```

Mở URL này để test app!

---

## 🎯 OPTION B: Vercel (DỄ NHẤT)

### ✅ Ưu điểm:
- Cực kỳ dễ setup
- Free tier generous
- Auto CI/CD
- Optimized cho Next.js

### 📝 Các bước:

#### Bước 1: Push code lên GitHub

Nếu chưa có repo, tạo trên GitHub, sau đó:

```bash
cd C:\bepnha
git remote add origin https://github.com/YOUR_USERNAME/bepnha.git
git push -u origin main
```

#### Bước 2: Deploy qua Vercel

1. Truy cập: https://vercel.com
2. Click "Add New Project"
3. Import GitHub repository
4. Vercel tự động detect Next.js
5. Thêm Environment Variables:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `GOOGLE_GEMINI_API_KEY`
6. Click "Deploy"

**Xong!** Vercel sẽ tự động build và deploy.

---

## 🎯 OPTION C: Firebase Hosting + Cloud Functions

### ⚠️ Phức tạp hơn - Chỉ dùng nếu bạn cần Firebase Hosting specifically

#### Bước 1: Cài đặt dependencies

```bash
cd C:\bepnha

# Cài đặt Firebase CLI
npm install -g firebase-tools

# Login
firebase login
```

#### Bước 2: Xóa thư mục functions cũ (nếu có)

```bash
# Nếu bạn đã tạo nhầm thư mục functions
rmdir /s functions
```

#### Bước 3: Initialize Firebase Hosting

```bash
firebase init hosting

# Chọn:
# - Existing project: [your-project-id]
# - Public directory: .next  (QUAN TRỌNG!)
# - Single-page app: No
# - GitHub deploys: No
```

#### Bước 4: Tạo firebase.json

```json
{
  "hosting": {
    "source": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "frameworksBackend": {
      "region": "asia-southeast1"
    }
  }
}
```

#### Bước 5: Deploy

```bash
firebase deploy --only hosting
```

**Lưu ý**: Firebase sẽ tự động deploy Next.js app với Cloud Functions backend.

---

## 🛠️ Xử lý lỗi thường gặp

### Lỗi 1: "npm error Missing script: build"

**Nguyên nhân**: Bạn đang ở thư mục `functions` thay vì thư mục gốc

**Giải pháp**:
```bash
# Quay về thư mục gốc
cd ..
# hoặc
cd C:\bepnha
```

### Lỗi 2: "gcloud: command not found" (Windows)

**Giải pháp**:
1. Restart Command Prompt sau khi cài Google Cloud SDK
2. Hoặc thêm vào PATH: `C:\Program Files\Google\Cloud SDK\google-cloud-sdk\bin`

### Lỗi 3: "Permission denied" khi deploy

**Giải pháp**:
```bash
# Re-login
gcloud auth login

# Set lại project
gcloud config set project YOUR_PROJECT_ID
```

### Lỗi 4: Build Docker image lâu hoặc timeout

**Giải pháp**:
```bash
# Build local trước
docker build -t bepnha .

# Tag
docker tag bepnha gcr.io/YOUR_PROJECT_ID/bepnha

# Push
docker push gcr.io/YOUR_PROJECT_ID/bepnha
```

### Lỗi 5: Firebase Hosting không có thư mục `out`

**Nguyên nhân**: Next.js 14 App Router không hỗ trợ static export với API routes

**Giải pháp**: Dùng Option A (Cloud Run) hoặc Option B (Vercel)

---

## 📊 So sánh Chi tiết

| Feature | Cloud Run | Vercel | Firebase Hosting |
|---------|-----------|--------|------------------|
| Setup | Trung bình | Dễ | Khó |
| Build time | 5-10 phút | 2-5 phút | 3-7 phút |
| Deploy time | 1-2 phút | 30s | 1-2 phút |
| Custom domain | ✅ Free | ✅ Free | ✅ Free |
| Auto SSL | ✅ | ✅ | ✅ |
| CI/CD | Manual | Auto | Manual |
| Logs | Cloud Console | Vercel Dashboard | Firebase Console |
| Cost (>1000 users) | ~$0 | ~$0 | ~$0 |

---

## ✅ Checklist sau khi Deploy

- [ ] Test đăng ký tài khoản mới
- [ ] Test đăng nhập
- [ ] Thêm công thức mới
- [ ] Upload ảnh
- [ ] Test AI suggestions (cần Gemini API key)
- [ ] Test responsive trên mobile
- [ ] Setup custom domain (optional)
- [ ] Enable monitoring/logging

---

## 🎯 Khuyến nghị của tôi

**Cho người mới bắt đầu**:
→ **Vercel** (Option B) - Dễ nhất, deploy trong 5 phút

**Cho Google Cloud Free Trial**:
→ **Cloud Run** (Option A) - Tốt nhất cho production, miễn phí hoàn toàn

**Tránh**:
→ Firebase Hosting + Functions - Quá phức tạp cho project này

---

## 📞 Cần trợ giúp?

**Nếu gặp lỗi khi deploy:**

1. Check thư mục hiện tại: `cd C:\bepnha` (phải là thư mục gốc)
2. Check package.json có script build: `type package.json`
3. Check Docker đã cài: `docker --version`
4. Check gcloud đã cài: `gcloud --version`
5. Check Firebase project: `gcloud projects list`

**Log để debug:**

```bash
# Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Build logs
gcloud builds list
gcloud builds log BUILD_ID
```

---

Bạn muốn deploy theo option nào? Tôi sẽ hướng dẫn chi tiết từng bước! 🚀
