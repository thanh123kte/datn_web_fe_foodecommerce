"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useBackendAuth } from "@/hooks/useBackendAuth";
import dashboardService from "@/lib/services/dashboardService";
import {
  SalesStatsDto,
  TopProductDto,
  OrderResponseDto,
} from "@/lib/services/orderService";
import { Notification } from "@/types/notification";
import {
  Package,
  ShoppingCart,
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

  const [stats, setStats] = useState<SalesStatsDto | null>(null);
  const [topProduct, setTopProduct] = useState<TopProductDto | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderResponseDto[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const loading = firebaseLoading || backendLoading;
  const user = backendUser || firebaseUser;

  // Fetch dashboard data when user is available
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.uid) return;
      
      // Get store_id from localStorage
      const storeIdStr = localStorage.getItem("store_id");
      if (!storeIdStr) {
        console.error("No store_id found in localStorage");
        setDataLoading(false);
        return;
      }
      
      // Get user_id from localStorage
      const userInfoStr = localStorage.getItem("user_info");
      let userId: string | null = null;
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          userId = userInfo.id;
        } catch (error) {
          console.error("Failed to parse user_info from localStorage:", error);
        }
      }
      
      const storeId = parseInt(storeIdStr, 10);
      setDataLoading(true);
      
      try {
        // Fetch all dashboard data via service layer
        const data = await dashboardService.getDashboardData(storeId, userId);
        
        setStats(data.stats);
        setTopProduct(data.topProduct);
        setRecentOrders(data.recentOrders);
        setNotifications(data.notifications);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/seller/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getOrderStatusBadge = (status?: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PENDING: { label: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-800" },
      CONFIRMED: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-800" },
      PREPARING: { label: "Đang chuẩn bị", className: "bg-blue-100 text-blue-800" },
      SHIPPING: { label: "Đang giao", className: "bg-yellow-100 text-yellow-800" },
      DELIVERED: { label: "Hoàn thành", className: "bg-green-100 text-green-800" },
      CANCELLED: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
    };
    return statusMap[status || "PENDING"] || statusMap.PENDING;
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
            {/* <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Đăng xuất
            </Button> */}
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
            {dataLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Đơn hàng mới</span>
                  <span className="font-semibold">{stats?.orderCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doanh thu</span>
                  <span className="font-semibold text-green-600">
                    {stats ? formatCurrency(stats.totalRevenue) : "0 ₫"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sản phẩm bán chạy</span>
                  <span className="font-semibold text-sm">
                    {topProduct?.productName || "Chưa có dữ liệu"}
                  </span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900">Đơn hàng gần đây</h3>
            </div>
            {dataLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const statusInfo = getOrderStatusBadge(order.orderStatus);
                  return (
                    <div key={order.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">#{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {order.items?.[0]?.productName || "Đơn hàng"} {order.items && order.items.length > 1 ? `+${order.items.length - 1}` : ""}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-400 text-sm">Chưa có đơn hàng</p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Thông báo</h3>
            </div>
            {dataLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg ${
                      notif.is_read ? "bg-gray-50" : "bg-blue-50"
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-400 text-sm">Chưa có thông báo mới</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
