"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useBackendAuth } from "@/hooks/useBackendAuth";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Star,
  TrendingUp,
  Bell,
} from "lucide-react";

export default function SellerDashboard() {
  const { user: firebaseUser, loading: firebaseLoading } =
    useAuthGuard("/seller/login");
  const { user: backendUser, loading: backendLoading } = useBackendAuth();
  const { signOut } = useAuth();
  const router = useRouter();

  const loading = firebaseLoading || backendLoading;
  const user = backendUser || firebaseUser;

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/seller/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // useAuthGuard sẽ redirect
  }

  return (
    <MainLayout userRole="seller" title="Seller Dashboard">
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-500 text-2xl font-bold">
                  {backendUser
                    ? backendUser.fullName.charAt(0)
                    : firebaseUser?.displayName?.charAt(0) ||
                      firebaseUser?.email?.charAt(0) ||
                      "U"}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Chào mừng trở lại,{" "}
                  {backendUser
                    ? backendUser.fullName
                    : firebaseUser?.displayName || "Seller"}
                  !
                </h2>
                <p className="text-gray-600">Cửa hàng của bạn</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>✉️ {user.email}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    {backendUser ? backendUser.role : "Seller"}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Đăng xuất
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Quản lý sản phẩm
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Thêm, sửa, xóa sản phẩm
              </p>
              <Button size="sm" className="w-full">
                Xem chi tiết
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Đơn hàng</h3>
              <p className="text-sm text-gray-600 mb-4">
                Theo dõi đơn hàng mới
              </p>
              <Button size="sm" className="w-full">
                Xem chi tiết
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Doanh thu</h3>
              <p className="text-sm text-gray-600 mb-4">
                Xem báo cáo doanh thu
              </p>
              <Button size="sm" className="w-full">
                Xem chi tiết
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Đánh giá</h3>
              <p className="text-sm text-gray-600 mb-4">
                Xem đánh giá khách hàng
              </p>
              <Button size="sm" className="w-full">
                Xem chi tiết
              </Button>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Thống kê hôm nay</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Đơn hàng mới</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Doanh thu</span>
                <span className="font-semibold text-green-600">
                  2,400,000 ₫
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sản phẩm bán chạy</span>
                <span className="font-semibold">Phở Bò</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900">Đơn hàng gần đây</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">#12345</p>
                  <p className="text-sm text-gray-600">Phở Bò Tái x2</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Hoàn thành
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">#12344</p>
                  <p className="text-sm text-gray-600">Bún Chả x1</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Đang giao
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">#12343</p>
                  <p className="text-sm text-gray-600">Bánh Mì x3</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Đang chuẩn bị
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Thông báo</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  Đơn hàng mới
                </p>
                <p className="text-xs text-blue-700">
                  Bạn có 3 đơn hàng mới cần xử lý
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">
                  Doanh thu tăng
                </p>
                <p className="text-xs text-green-700">
                  Doanh thu tuần này tăng 15%
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm font-medium text-orange-900">
                  Cập nhật menu
                </p>
                <p className="text-xs text-orange-700">
                  Hãy cập nhật menu mùa đông
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
