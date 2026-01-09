"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Store,
  Package,
  TrendingUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/layout/MainLayout";
import adminStatisticsService, {
  OverallStats,
  RevenueStats,
  ChartData,
  TopStore,
  TopProduct,
} from "@/lib/services/adminStatisticsService";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminReportsPage() {
  // States
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Data states
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [topStores, setTopStores] = useState<TopStore[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  // Load data
  const loadData = useCallback(
    async (isInitial = false) => {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setRefreshing(true);
      }

      try {
        // Fetch overall stats
        const overallData = await adminStatisticsService.getOverallStats();
        setOverallStats(overallData);

        // Fetch revenue stats with filters
        let revenueData;
        if (startDate && endDate) {
          revenueData = await adminStatisticsService.getRevenueStats(
            period,
            startDate,
            endDate
          );
        } else {
          revenueData = await adminStatisticsService.getRevenueStats(period);
        }
        setRevenueStats(revenueData);

        // Convert to chart data
        const chartDataConverted =
          adminStatisticsService.convertToChartData(revenueData);
        setChartData(chartDataConverted);

        // Fetch top stores and products
        const [topStoresData, topProductsData] = await Promise.all([
          adminStatisticsService.getTopStores(10),
          adminStatisticsService.getTopProducts(10),
        ]);
        setTopStores(topStoresData);
        setTopProducts(topProductsData);
      } catch (error) {
        console.error("Failed to load admin statistics:", error);
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [period, startDate, endDate]
  );

  // Initial load and auto-reload on filter change
  useEffect(() => {
    loadData(initialLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, startDate, endDate]);

  // Handle refresh
  const handleRefresh = () => {
    loadData(false);
  };

  // Handle period change
  const handlePeriodChange = (newPeriod: "daily" | "weekly" | "monthly") => {
    setPeriod(newPeriod);
    setStartDate("");
    setEndDate("");
  };

  // Handle date change
  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    if (date) {
      setPeriod("daily");
    }
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    if (date) {
      setPeriod("daily");
    }
  };

  if (initialLoading) {
    return (
      <MainLayout userRole="admin" title="Thống Kê Hệ Thống">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </MainLayout>
    );
  }

  return (
    <div>
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Thống Kê Hệ Thống
        </h1>
        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng Doanh Thu
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {adminStatisticsService.formatCurrency(
                    overallStats?.totalRevenue || 0
                  )}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Total Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng Đơn Hàng
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {adminStatisticsService.formatNumber(
                    overallStats?.totalOrders || 0
                  )}
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Total Users */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng Người Dùng
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {adminStatisticsService.formatNumber(
                    overallStats?.totalUsers || 0
                  )}
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          {/* Total Stores */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng Cửa Hàng
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {adminStatisticsService.formatNumber(
                    overallStats?.totalStores || 0
                  )}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {overallStats?.activeStores || 0} đang hoạt động
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Store className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng Sản Phẩm
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  {adminStatisticsService.formatNumber(
                    overallStats?.totalProducts || 0
                  )}
                </h3>
              </div>
              <Package className="h-8 w-8 text-gray-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Hoa Hồng Platform
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  {adminStatisticsService.formatCurrency(
                    overallStats?.totalCommission || 0
                  )}
                </h3>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Giá Trị Đơn TB
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  {adminStatisticsService.formatCurrency(
                    overallStats?.averageOrderValue || 0
                  )}
                </h3>
              </div>
              <DollarSign className="h-8 w-8 text-gray-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Period Filter */}
            <div className="flex-1">
              <Label
                htmlFor="period"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Loại Thống Kê
              </Label>
              <div className="flex gap-2">
                <Button
                  variant={period === "daily" ? "default" : "outline"}
                  onClick={() => handlePeriodChange("daily")}
                  className="flex-1"
                >
                  Theo Ngày
                </Button>
                <Button
                  variant={period === "weekly" ? "default" : "outline"}
                  onClick={() => handlePeriodChange("weekly")}
                  className="flex-1"
                >
                  Theo Tuần
                </Button>
                <Button
                  variant={period === "monthly" ? "default" : "outline"}
                  onClick={() => handlePeriodChange("monthly")}
                  className="flex-1"
                >
                  Theo Tháng
                </Button>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex-1">
              <Label
                htmlFor="startDate"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Từ Ngày
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex-1">
              <Label
                htmlFor="endDate"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Đến Ngày
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Refresh Button */}
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-10"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Làm Mới
            </Button>
          </div>
        </Card>

        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Biểu Đồ Doanh Thu & Đơn Hàng
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "revenue" || name === "commission") {
                    return adminStatisticsService.formatCurrency(value);
                  }
                  return adminStatisticsService.formatNumber(value);
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                name="Doanh Thu"
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="commission"
                stroke="#f59e0b"
                name="Hoa Hồng"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                name="Đơn Hàng"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Stores and Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Stores */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top 10 Cửa Hàng
            </h3>
            <div className="space-y-3">
              {topStores.map((store, index) => (
                <div
                  key={store.storeId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {store.storeName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {store.totalOrders} đơn hàng
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {adminStatisticsService.formatCurrency(
                        store.totalRevenue
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      HH:{" "}
                      {adminStatisticsService.formatCurrency(store.commission)}
                    </p>
                  </div>
                </div>
              ))}
              {topStores.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Không có dữ liệu
                </p>
              )}
            </div>
          </Card>

          {/* Top Products */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top 10 Sản Phẩm Bán Chạy
            </h3>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.productName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.storeName} • {product.categoryName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {adminStatisticsService.formatNumber(product.totalSold)}{" "}
                      đã bán
                    </p>
                    <p className="text-xs text-gray-500">
                      {adminStatisticsService.formatCurrency(
                        product.totalRevenue
                      )}
                    </p>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Không có dữ liệu
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
