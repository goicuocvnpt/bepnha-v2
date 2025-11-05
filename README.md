# 🍳 Bếp Nhà - Ứng dụng Quản lý Thực đơn Gia đình

Ứng dụng web hiện đại giúp các gia đình Việt Nam quản lý thực đơn hàng ngày một cách thông minh và dễ dàng.

## ✨ Tính năng chính

### 🎯 Quản lý Công thức nấu ăn
- Thêm, sửa, xóa công thức nấu ăn
- Upload ảnh món ăn
- Phân loại theo danh mục (món chính, canh, tráng miệng...)
- Lưu công thức yêu thích
- Tìm kiếm công thức theo tên và tags

### 📅 Lập kế hoạch Thực đơn
- Lên thực đơn cho từng bữa (sáng, trưa, tối)
- Xem lịch thực đơn theo tuần
- Dễ dàng thêm món ăn từ thư viện công thức
- Điều chỉnh thực đơn linh hoạt

### 🛒 Danh sách Mua sắm
- Tự động tạo danh sách từ thực đơn
- Quản lý nhiều danh sách
- Đánh dấu đã mua
- Phân loại nguyên liệu theo danh mục

### 🤖 AI Gợi ý món ăn (Google Gemini)
- Gợi ý món ăn dựa trên nguyên liệu có sẵn
- Tự động tạo thực đơn cân bằng dinh dưỡng
- Phân tích giá trị dinh dưỡng
- Gợi ý theo sở thích gia đình

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React Framework với App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Hook Form + Zod** - Form validation

### Backend & Database
- **Firebase Firestore** - NoSQL Database
- **Firebase Authentication** - User authentication
- **Firebase Storage** - Image storage
- **Next.js API Routes** - Backend API

### AI & ML
- **Google Gemini AI** - Recipe suggestions & meal planning

### Deployment
- **Google Cloud Run** - Container hosting
- **Firebase Hosting** - Static hosting
- **Cloud Build** - CI/CD

## 📋 Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn
- Firebase account (free tier)
- Google Cloud account (free trial)
- Google Gemini API key

## 🚀 Cài đặt và Chạy Local

### 1. Clone repository

```bash
git clone <repository-url>
cd bepnha-v2
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Firebase

#### 3.1. Tạo Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới
3. Kích hoạt **Authentication** (Email/Password)
4. Tạo **Firestore Database** (chế độ test)
5. Kích hoạt **Storage**

#### 3.2. Lấy Firebase Config
1. Vào **Project Settings** > **General**
2. Cuộn xuống **Your apps** > Chọn **Web app**
3. Copy config object

#### 3.3. Tạo file .env.local

```bash
cp .env.local.example .env.local
```

Điền thông tin Firebase vào file `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Lấy Google Gemini API Key

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tạo API key mới
3. Copy và paste vào `.env.local`

### 5. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 🌐 Deployment lên Google Cloud

### Option 1: Firebase Hosting (Khuyến nghị cho bắt đầu)

#### 1. Cài đặt Firebase CLI

```bash
npm install -g firebase-tools
```

#### 2. Login Firebase

```bash
firebase login
```

#### 3. Initialize Firebase

```bash
firebase init hosting
```

Chọn:
- Existing project: [your-project-id]
- Public directory: `out`
- Configure as single-page app: Yes
- Set up automatic builds: No

#### 4. Build và Deploy

```bash
npm run build
npx next export
firebase deploy --only hosting
```

### Option 2: Google Cloud Run (Cho production)

Xem hướng dẫn chi tiết trong file [DEPLOYMENT.md](DEPLOYMENT.md)

## 📊 Database Schema (Firestore)

### Collections

#### users
```typescript
{
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  familyId?: string;
  createdAt: Timestamp;
}
```

#### recipes
```typescript
{
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: 'main-dish' | 'soup' | 'appetizer' | 'dessert' | ...;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition?: NutritionInfo;
  tags: string[];
  isFavorite: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### menuItems
```typescript
{
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner';
  recipeId: string;
  notes?: string;
  createdAt: Timestamp;
}
```

#### shoppingLists
```typescript
{
  id: string;
  userId: string;
  title: string;
  items: ShoppingItem[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 💰 Chi phí ước tính (Google Cloud Free Tier)

### Firebase (Miễn phí)
- ✅ Authentication: 10,000 phone auths/month
- ✅ Firestore: 1GB storage, 50K reads, 20K writes/day
- ✅ Storage: 5GB storage, 1GB downloads/day

### Cloud Run (Miễn phí)
- ✅ 2 million requests/month
- ✅ 360,000 GB-seconds memory
- ✅ 180,000 vCPU-seconds

### Gemini API
- ✅ 60 requests/minute (free tier)

**Kết luận**: Ứng dụng có thể chạy hoàn toàn MIỄN PHÍ trên Google Cloud Free Tier cho đến khi có ~1000 users active.

## 📱 Responsive Design

Ứng dụng được thiết kế responsive, hoạt động tốt trên:
- 📱 Mobile (375px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type check
npm run type-check
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 👨‍💻 Author

Được xây dựng với ❤️ cho các gia đình Việt Nam

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Chia sẻ công thức với bạn bè
- [ ] Tính năng gia đình (Family sharing)
- [ ] Tích hợp với grocery stores
- [ ] Voice assistant
- [ ] Nutritionist AI advisor

---

**Happy Cooking! 🍳👨‍🍳👩‍🍳**
