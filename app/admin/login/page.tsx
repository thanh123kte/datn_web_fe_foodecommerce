"use client";

import { AuthLayout, LoginForm } from "@/components/auth";

export default function AdminLogin() {
  return (
    <AuthLayout
      title="Đăng nhập Admin"
      subtitle="Đăng nhập để quản lý hệ thống QtiFood"
      leftPanelContent={{
        title: "Chào mừng đến với QtiFood Admin",
        description: "Quản lý toàn bộ hệ thống thực phẩm trực tuyến",
        stats: [
          {
            value: "1000+",
            label: "Nhà hàng đối tác",
          },
          {
            value: "100K+",
            label: "Người dùng hoạt động",
          },
          {
            value: "24/7",
            label: "Giám sát hệ thống",
          },
        ],
      }}
    >
      <LoginForm
        submitButtonText="Đăng nhập Admin"
        redirectPath="/admin/dashboard"
      />
    </AuthLayout>
  );
}
