# ⚡ Quick Start Guide - Bếp Nhà

## 🎯 Mục tiêu

Deploy app "Bếp Nhà" lên Internet trong **10 phút** (Option B - Vercel)

---

## ✅ OPTION B: Vercel (KHUYẾN NGHỊ - DỄ NHẤT)

### Bước 1: Tạo tài khoản Vercel (1 phút)

1. Truy cập: https://vercel.com
2. Click **"Sign Up"**
3. Đăng nhập bằng **GitHub account**

### Bước 2: Chuẩn bị Firebase (3 phút)

1. Truy cập: https://console.firebase.google.com/
2. Tạo project mới (hoặc dùng project có sẵn)
3. Enable **Authentication** → Email/Password
4. Tạo **Firestore Database** → Start in test mode
5. Enable **Storage**
6. Vào **Project Settings** → Lấy **Firebase Config**

### Bước 3: Lấy Gemini API Key (2 phút)

1. Truy cập: https://makersuite.google.com/app/apikey
2. Click **"Create API key"**
3. Copy API key

### Bước 4: Push code lên GitHub (nếu chưa có)

```bash
cd C:\bepnha

# Initialize git (if not already)
git init

# Add remote (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/bepnha.git

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Push
git push -u origin main
```

### Bước 5: Deploy qua Vercel (2 phút)

1. Vào https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Click **"Import"** GitHub repository của bạn
4. Vercel tự động detect Next.js
5. Click **"Environment Variables"**
6. Thêm các biến sau:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bepnha-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bepnha-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bepnha-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
GOOGLE_GEMINI_API_KEY=AIzaSy...
```

7. Click **"Deploy"**

### Bước 6: Chờ deploy xong (2 phút)

Vercel sẽ:
- ✅ Build app
- ✅ Deploy lên CDN toàn cầu
- ✅ Tạo URL: `https://bepnha.vercel.app`

### Bước 7: Test app

Mở URL Vercel vừa tạo → Test các tính năng:
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập
- ✅ Thêm công thức
- ✅ AI suggestions

---

## 🎉 XONG! App đã live trên Internet!

**Total time: ~10 phút**

---

## 🔧 Troubleshooting nhanh

### Lỗi: "Failed to load environment variables"

**Giải pháp**: Check lại Environment Variables trong Vercel dashboard:
1. Vào Project Settings
2. Click Environment Variables
3. Kiểm tra tất cả biến đã nhập đúng
4. Click **"Redeploy"**

### Lỗi: "Firebase: Error (auth/invalid-api-key)"

**Giải pháp**:
1. Check Firebase Config ở Project Settings
2. Copy lại API key
3. Update trong Vercel Environment Variables
4. Redeploy

### Lỗi: "AI suggestions not working"

**Giải pháp**:
1. Check Gemini API key còn valid không
2. Verify API key ở: https://makersuite.google.com/app/apikey
3. Update trong Vercel Environment Variables
4. Redeploy

---

## 📱 Tiếp theo

### 1. Custom Domain (Optional)

**Miễn phí trên Vercel**:
1. Vào Project Settings → Domains
2. Thêm domain của bạn (vd: bepnha.com)
3. Update DNS records theo hướng dẫn
4. Chờ 24-48h

### 2. Setup Firestore Security Rules

Vào Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    match /recipes/{recipeId} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.userId);
    }

    match /menuItems/{menuItemId} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.userId);
    }

    match /shoppingLists/{listId} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.userId);
    }
  }
}
```

### 3. Monitor Performance

Vercel Dashboard cung cấp:
- ✅ Real-time analytics
- ✅ Performance metrics
- ✅ Error tracking
- ✅ Build logs

---

## 🚀 Auto Deploy

Vercel tự động deploy khi bạn push code mới:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel tự động detect và deploy!
```

---

## 💡 Pro Tips

1. **Preview Deployments**: Mỗi PR trên GitHub tạo preview URL riêng
2. **Rollback**: Rollback về version cũ chỉ trong 1 click
3. **Environment Variables**: Dev/Preview/Production có thể có env khác nhau
4. **Edge Functions**: Vercel tự động optimize Next.js API routes

---

## 📊 So sánh với Cloud Run

| Feature | Vercel | Cloud Run |
|---------|--------|-----------|
| Setup time | 10 phút | 30 phút |
| Auto deploy | ✅ | ❌ |
| Preview URLs | ✅ | ❌ |
| Custom domains | ✅ Free | ✅ Free |
| Build time | 2-3 phút | 5-10 phút |
| Dashboard | Đẹp, dễ dùng | Phức tạp |

**Kết luận**: Vercel dễ hơn cho beginners, Cloud Run tốt cho advanced users muốn full control.

---

## 🆘 Cần trợ giúp?

**Check list:**
- [ ] Firebase project đã setup đúng chưa?
- [ ] All environment variables đã có trong Vercel chưa?
- [ ] GitHub repo có thể access được không?
- [ ] Build logs có lỗi gì không?

**Nếu vẫn lỗi**, gửi screenshot của:
1. Vercel build logs
2. Browser console (F12)
3. Firebase Console

---

**Happy Deploying! 🎉**
