"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  dashboardService,
  AdminDashboardStats,
  PlatformSalesStats,
  RecentUser,
} from "@/lib/services/dashboardService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email || "Admin";
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [revenueStats, setRevenueStats] = useState<PlatformSalesStats | null>(
    null
  );
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRevenueStats = async () => {
      try {
        setRevenueLoading(true);
        const data = await dashboardService.getPlatformSalesStats("monthly");
        setRevenueStats(data);
      } catch (error) {
        console.error("Error fetching revenue stats:", error);
      } finally {
        setRevenueLoading(false);
      }
    };

    const fetchRecentUsers = async () => {
      try {
        setUsersLoading(true);
        const data = await dashboardService.getRecentUsers(5);
        setRecentUsers(data);
      } catch (error) {
        console.error("Error fetching recent users:", error);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchStats();
    fetchRevenueStats();
    fetchRecentUsers();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bảng điều khiển Admin
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Chào mừng trở lại, {displayName}! Đây là những gì đang diễn ra với QTI
          Food hôm nay.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tổng người dùng
            </CardTitle>
            <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                stats?.totalUsers.toLocaleString("vi-VN") || "0"
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Người dùng hoạt động
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tổng sản phẩm
            </CardTitle>
            <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                stats?.totalProducts.toLocaleString("vi-VN") || "0"
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Sản phẩm trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tổng đơn hàng
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                stats?.totalOrders.toLocaleString("vi-VN") || "0"
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Đơn hàng đã tạo
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                formatCurrency(stats?.totalRevenue || 0)
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tổng doanh thu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tổng quan doanh thu
            </CardTitle>
            <CardDescription>
              Doanh thu theo ngày trong tháng hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4 animate-pulse" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Đang tải dữ liệu...
                  </p>
                </div>
              </div>
            ) : revenueStats && revenueStats.points.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Tổng đơn hàng
                    </p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {revenueStats.totalOrders.toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Tổng doanh thu
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(revenueStats.totalRevenue)}
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={revenueStats.points.map((point) => ({
                      date: new Date(point.label).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      }),
                      revenue: point.revenue,
                      orders: point.orders,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-300 dark:stroke-gray-700"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "currentColor" }}
                      className="text-xs text-gray-600 dark:text-gray-400"
                    />
                    <YAxis
                      tick={{ fill: "currentColor" }}
                      className="text-xs text-gray-600 dark:text-gray-400"
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(1)}M`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === "revenue") {
                          return [formatCurrency(value), "Doanh thu"];
                        }
                        return [value, "Đơn hàng"];
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: "20px" }}
                      formatter={(value) =>
                        value === "revenue" ? "Doanh thu" : "Đơn hàng"
                      }
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                      name="revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Chưa có dữ liệu doanh thu
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Người dùng mới nhất
            </CardTitle>
            <CardDescription>5 người dùng đăng ký gần đây nhất</CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4 animate-pulse" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Đang tải dữ liệu...
                  </p>
                </div>
              </div>
            ) : recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.displayName || user.email}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                          {(user.displayName || user.email)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.displayName || "Chưa có tên"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      {user.phoneNumber && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {user.phoneNumber}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex gap-1 mt-1 justify-end">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Chưa có người dùng nào
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
