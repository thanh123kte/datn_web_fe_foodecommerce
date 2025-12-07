// lib/authService.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";
import { authApiService } from "./services/authApiService";

export interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    // Optional: Add custom parameters
    this.googleProvider.setCustomParameters({
      prompt: "select_account",
    });
  }

  // Đăng nhập bằng Google
  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      const user = result.user;

      if (!user) {
        throw new Error("Không thể lấy thông tin user từ Firebase");
      }

      // Lấy access token từ Google credential
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      if (!accessToken) {
        throw new Error("Không thể lấy Google access token");
      }

      // Gửi Google token đến backend để kiểm tra user có role SELLER không
      const loginResponse = await authApiService.googleLogin(accessToken);

      // Lưu thông tin user vào localStorage
      authApiService.saveUserSession(loginResponse);

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Đăng nhập bằng email và password
  async signIn(
    { email, password }: SignInData,
    requiredRole: "ADMIN" | "SELLER" = "SELLER"
  ): Promise<UserCredential> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Get ID token and send to backend API
      const idToken = await result.user.getIdToken();

      // Call backend login endpoint to get user info and JWT token
      const loginResponse = await authApiService.firebaseLogin(
        idToken,
        requiredRole
      );

      // Save user session data to localStorage
      authApiService.saveUserSession(loginResponse);

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Đăng ký tài khoản mới
  async signUp({
    email,
    password,
    displayName,
  }: SignUpData): Promise<UserCredential> {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Cập nhật profile nếu có displayName
      if (displayName && result.user) {
        await updateProfile(result.user, {
          displayName: displayName,
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Đăng xuất
  async signOut(): Promise<void> {
    try {
      // Xóa session từ localStorage
      authApiService.clearUserSession();

      // Đăng xuất Firebase
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  // Gửi email reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  }

  // Lấy user hiện tại
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Lấy ID token của user hiện tại
  async getCurrentUserToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }
}

export const authService = new AuthService();
export default authService;
