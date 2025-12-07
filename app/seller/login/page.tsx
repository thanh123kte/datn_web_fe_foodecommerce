"use client";

import { AuthLayout, LoginForm, GoogleLoginButton } from "@/components/auth";
import TestAccountsInfo from "@/components/dev/TestAccountsInfo";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function SellerLogin() {
  // Kiểm tra phiên đăng nhập - tự động redirect nếu đã đăng nhập
  const { isChecking } = useAuthRedirect({
    requiredRole: "SELLER",
    redirectTo: "/seller/dashboard",
  });

  // Hiển thị loading trong khi kiểm tra phiên đăng nhập
  if (isChecking) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Đăng nhập Seller"
      subtitle="Đăng nhập để quản lý cửa hàng và đơn hàng của bạn"
      leftPanelContent={{
        title: "Chào mừng đến với QtiFood Seller",
        description: "Quản lý cửa hàng và bán hàng trực tuyến một cách dễ dàng",
        stats: [
          {
            value: "500+",
            label: "Nhà hàng đối tác",
          },
          {
            value: "50K+",
            label: "Đơn hàng thành công",
          },
          {
            value: "24/7",
            label: "Hỗ trợ bán hàng",
          },
        ],
      }}
    >
      <div className="space-y-4">
        <LoginForm
          submitButtonText="Đăng nhập Seller"
          redirectPath="/seller/dashboard"
          requiredRole="SELLER"
        />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Hoặc đăng nhập bằng
            </span>
          </div>
        </div>

        {/* Google Login */}
        <GoogleLoginButton redirectPath="/seller/dashboard" />
      </div>
    </AuthLayout>
  );
}
