// lib/services/authApiService.ts
import axiosInstance from "@/lib/api/axiosConfig";

export interface BackendUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  id: string; // Firebase UID
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  isActive?: boolean;
  roles?: string[];
}

export interface LoginResponse {
  token: string;
  tokenType?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    role: string;
  };
}

export interface GoogleLoginRequest {
  googleToken: string;
}

class AuthApiService {
  private readonly basePath = "/api/auth";
  private readonly usersPath = "/api/users";

  // Tạo user từ Google login với role CUSTOMER
  async createUserFromGoogle(userData: {
    id: string; // Firebase UID
    fullName: string;
    email: string;
    avatarUrl?: string;
  }): Promise<BackendUser> {
    const createUserRequest: CreateUserRequest = {
      ...userData,
      password: "google_oauth_" + userData.id, // Dummy password cho Google users
      isActive: true,
      roles: ["CUSTOMER"], // Mặc định là CUSTOMER
    };

    const response = await axiosInstance.post(
      this.usersPath,
      createUserRequest
    );
    return response.data;
  }

  // Đăng nhập Google (fallback nếu cần)
  async googleLogin(googleToken: string): Promise<LoginResponse> {
    const response = await axiosInstance.post(`${this.basePath}/google`, {
      googleToken,
    });
    return response.data;
  }

  // Đăng ký
  async register(data: {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phone?: string;
  }): Promise<LoginResponse> {
    const response = await axiosInstance.post(
      `${this.basePath}/register`,
      data
    );
    return response.data;
  }

  // Đăng nhập bằng email/password
  async login(data: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    const response = await axiosInstance.post(`${this.basePath}/login`, data);
    return response.data;
  }

  // Đăng nhập bằng Firebase ID token
  async firebaseLogin(idToken: string): Promise<LoginResponse> {
    const response = await axiosInstance.post(`${this.basePath}/firebase`, {
      idToken,
    });
    return response.data;
  }

  // Lấy user theo ID
  async getUserById(userId: string): Promise<BackendUser> {
    const response = await axiosInstance.get(`${this.usersPath}/${userId}`);
    return response.data;
  }

  // Lưu user info vào localStorage (cho auth backend)
  saveUserSession(loginResponse: LoginResponse) {
    localStorage.setItem("auth_token", loginResponse.token);
    localStorage.setItem("user_info", JSON.stringify(loginResponse.user));
  }

  // Lưu backend user info vào localStorage
  saveBackendUserSession(user: BackendUser, token?: string) {
    if (token) {
      localStorage.setItem("auth_token", token);
    }
    localStorage.setItem("backend_user", JSON.stringify(user));
  }

  // Xóa user session
  clearUserSession() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("backend_user");
  }

  // Lấy user info từ localStorage
  getCurrentUser() {
    const userInfo = localStorage.getItem("user_info");
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Lấy backend user từ localStorage
  getBackendUser(): BackendUser | null {
    const userInfo = localStorage.getItem("backend_user");
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Lấy token từ localStorage
  getAuthToken() {
    return localStorage.getItem("auth_token");
  }
}

export const authApiService = new AuthApiService();
export default authApiService;
