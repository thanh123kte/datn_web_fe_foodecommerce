"use client";

import { usePathname } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Các trang không sử dụng MainLayout (trang login, forgot-password)
  const publicPages = ["/seller/login", "/seller/forgot-password", "/seller"];
  const isPublicPage = publicPages.includes(pathname);

  // Nếu là trang public, không wrap với MainLayout và không check auth
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Các trang khác yêu cầu authentication với SELLER role
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isLoading, isAuthenticated } = useAuthGuard({
    requiredRole: "SELLER",
    redirectTo: "/seller/login",
  });

  // Hiển thị loading trong khi kiểm tra authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seller portal...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa authenticated, không render gì (đang redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Các trang khác sử dụng MainLayout với role seller
  return <div>{children}</div>;
}
