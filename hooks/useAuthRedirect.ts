// hooks/useAuthRedirect.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface UseAuthRedirectOptions {
  /** Role yêu cầu cho trang login (ADMIN hoặc SELLER) */
  requiredRole: "ADMIN" | "SELLER";
  /** Đường dẫn redirect khi đã đăng nhập */
  redirectTo: string;
}

/**
 * Custom hook để kiểm tra phiên đăng nhập và tự động redirect
 * Sử dụng cho các trang login để ngăn người dùng đã đăng nhập truy cập lại
 */
export function useAuthRedirect({
  requiredRole,
  redirectTo,
}: UseAuthRedirectOptions) {
  const router = useRouter();
  const { user, loading, userRole } = useAuth();

  useEffect(() => {
    // Đợi Firebase auth hoàn tất kiểm tra
    if (loading) {
      return;
    }

    // Nếu có user và đã đăng nhập
    if (user && userRole) {
      // Kiểm tra role có khớp với yêu cầu không
      if (userRole === requiredRole) {
        // Redirect ngay lập tức vào dashboard
        router.replace(redirectTo);
      }
    }
  }, [user, loading, userRole, requiredRole, redirectTo, router]);

  // Return loading state để component có thể hiển thị loading UI nếu cần
  return { isChecking: loading };
}
