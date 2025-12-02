# Firebase Authentication Setup Guide

## Các bước đã thực hiện:

### 1. Cài đặt Firebase SDK ✅

- Đã cài đặt package `firebase` vào dự án

### 2. Cấu hình Firebase ✅

- Tạo file `lib/firebase.ts` với cấu hình Firebase
- Tạo file `.env.local` để lưu trữ Firebase keys

### 3. Tạo Authentication Service ✅

- File `lib/authService.ts` chứa các method:
  - `signIn()` - Đăng nhập
  - `signUp()` - Đăng ký
  - `signOut()` - Đăng xuất
  - `resetPassword()` - Quên mật khẩu
  - `getCurrentUser()` - Lấy thông tin user hiện tại

### 4. Tạo Auth Context ✅

- File `contexts/AuthContext.tsx` để quản lý state authentication
- Đã wrap toàn bộ app trong `AuthProvider`

### 5. Cập nhật LoginForm ✅

- Component `LoginForm` đã tích hợp Firebase Authentication
- Xử lý các lỗi Firebase với thông báo tiếng Việt
- Tự động redirect sau khi đăng nhập thành công

### 6. Tạo API Routes ✅

- `/api/auth/login` - Xử lý đăng nhập
- `/api/auth/logout` - Xử lý đăng xuất
- `/api/auth/verify` - Verify authentication token

### 7. Middleware bảo vệ routes ✅

- File `middleware.ts` để bảo vệ các protected routes
- Tự động redirect đến login nếu chưa đăng nhập

## Cách sử dụng:

### 1. Cấu hình Firebase Console:

1. Tạo project mới tại https://console.firebase.google.com
2. Thêm ứng dụng web
3. Copy các keys vào file `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 2. Enable Authentication trong Firebase:

1. Vào Firebase Console > Authentication
2. Chọn tab "Sign-in method"
3. Enable "Email/Password"
4. Enable "Google" - Thêm email hỗ trợ dự án

### 3. Sử dụng trong components:

```tsx
import { useAuth } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div>
        <p>Xin chào {user.displayName}</p>
        <button onClick={signOut}>Đăng xuất</button>
      </div>
    );
  }

  return <p>Chưa đăng nhập</p>;
}
```

### 4. Bảo vệ pages:

```tsx
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function ProtectedPage() {
  const { user, loading } = useAuthGuard("/admin/login");

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

## Tính năng chính:

- ✅ Đăng nhập/đăng ký bằng email & password
- ✅ Quên mật khẩu
- ✅ Persistent authentication với cookies
- ✅ Protected routes
- ✅ Error handling với thông báo tiếng Việt
- ✅ Loading states
- ✅ Auto redirect
- ✅ Logout functionality

## Chạy ứng dụng:

```bash
pnpm run dev
```

Truy cập http://localhost:3000 để test authentication!
