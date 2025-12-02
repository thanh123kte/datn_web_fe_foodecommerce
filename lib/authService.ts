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

      // Get ID token and send to API
      const idToken = await result.user.getIdToken();
      await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Đăng nhập bằng email và password
  async signIn({ email, password }: SignInData): Promise<UserCredential> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Get ID token and send to API
      const idToken = await result.user.getIdToken();
      await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

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
      // Call API to clear cookies
      await fetch("/api/auth/logout", {
        method: "POST",
      });

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
