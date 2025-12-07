// hooks/useAuthGuard.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface UseAuthGuardOptions {
  /** Role yêu cầu để truy cập trang (ADMIN hoặc SELLER) */
  requiredRole?: "ADMIN" | "SELLER";
  /** Đường dẫn redirect khi chưa đăng nhập hoặc không đủ quyền */
  redirectTo?: string;
}

/**
 * Custom hook để bảo vệ các trang yêu cầu authentication
 * Redirect người dùng về trang login nếu chưa đăng nhập hoặc không có quyền
 */
export const useAuthGuard = (options?: UseAuthGuardOptions | string) => {
  const { user, loading, userRole } = useAuth();
  const router = useRouter();

  // Support both old API (string) and new API (object)
  const redirectTo =
    typeof options === "string" ? options : options?.redirectTo;
  const requiredRole =
    typeof options === "object" ? options?.requiredRole : undefined;

  useEffect(() => {
    // Đợi Firebase auth hoàn tất kiểm tra
    if (loading) {
      return;
    }

    // Nếu không có user, redirect về login
    if (!user) {
      const loginPath =
        redirectTo ||
        (requiredRole ? `/${requiredRole.toLowerCase()}/login` : "/login");
      router.replace(loginPath);
      return;
    }

    // Nếu yêu cầu role cụ thể, kiểm tra role
    if (requiredRole && userRole && userRole !== requiredRole) {
      const loginPath = redirectTo || `/${requiredRole.toLowerCase()}/login`;
      router.replace(loginPath);
    }
  }, [user, loading, userRole, requiredRole, redirectTo, router]);

  // Return các thông tin cần thiết
  return {
    user,
    loading,
    isLoading: loading,
    isAuthenticated: !!user && (!requiredRole || userRole === requiredRole),
    userRole,
  };
};
