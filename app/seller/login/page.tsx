"use client";

import { AuthLayout, LoginForm, GoogleLoginButton } from "@/components/auth";
import TestAccountsInfo from "@/components/dev/TestAccountsInfo";

export default function SellerLogin() {
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
          signupLink={{
            text: "Đăng ký bán hàng",
            href: "/seller/register",
          }}
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

      <TestAccountsInfo />
    </AuthLayout>
  );
}
