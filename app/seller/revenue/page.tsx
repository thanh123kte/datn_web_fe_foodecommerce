"use client";

import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { RevenueChart } from "./components/RevenueChart";
import { TopProducts } from "./components/TopProducts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import sellerRevenueService, {
  RevenueStats,
  ChartData,
  TopProduct,
} from "@/lib/services/sellerRevenueService";
import {
  ShoppingCart,
  DollarSign,
  AlertCircle,
  Loader2,
  RefreshCw,
  CircleDollarSign,
} from "lucide-react";

export default function RevenuePage() {
  // State management
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [storeId, setStoreId] = useState<number | null>(null);

  // Filter state
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | null>(
    "daily"
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Get store ID from localStorage
  useEffect(() => {
    const storedStoreId = localStorage.getItem("store_id");
    if (storedStoreId) {
      setStoreId(parseInt(storedStoreId));
    } else {
      console.error("No store_id found in localStorage");
      setInitialLoading(false);
    }
  }, []);

  // Load data based on filters
  const loadData = useCallback(
    async (isInitial = false) => {
      if (!storeId) return;

      if (isInitial) {
        setInitialLoading(true);
      } else {
        setRefreshing(true);
      }

      try {
        let salesStats;

        // Check if both dates are provided, use custom date range API
        if (startDate && endDate) {
          salesStats = await sellerRevenueService.getSalesStatsByDateRange(
            storeId,
            startDate,
            endDate
          );
        } else if (period) {
          // Otherwise use period-based API if period is set
          salesStats = await sellerRevenueService.getSalesStats(
            storeId,
            period
          );
        } else {
          // Default to daily if nothing is selected
          salesStats = await sellerRevenueService.getSalesStats(
            storeId,
            "daily"
          );
        }

        // Calculate revenue stats from sales data
        const revenueStatsData =
          sellerRevenueService.calculateRevenueStats(salesStats);
        setRevenueStats(revenueStatsData);

        // Convert to chart data
        const chartDataConverted =
          sellerRevenueService.convertToChartData(salesStats);
        setChartData(chartDataConverted);

        // Fetch top products
        const topProductsData = await sellerRevenueService.getTopProducts(
          storeId,
          5
        );
        setTopProducts(topProductsData);
      } catch (error: unknown) {
        console.error("Failed to load revenue data:", error);

        // Set empty fallback data to prevent UI crashes
        setRevenueStats({
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          totalDiscount: 0,
          totalShippingFee: 0,
          totalCommission: 0,
          netRevenue: 0,
          previousPeriodRevenue: 0,
          revenueGrowth: 0,
        });
        setChartData([]);
        setTopProducts([]);
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [storeId, period, startDate, endDate]
  );

  // Load data on component mount and when filters change
  useEffect(() => {
    if (storeId) {
      loadData(initialLoading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, period, startDate, endDate]);

  // Handle refresh
  const handleRefresh = () => {
    loadData(false);
  };

  // Handle period change - clear date range when selecting period
  const handlePeriodChange = (newPeriod: "daily" | "weekly" | "monthly") => {
    setPeriod(newPeriod);
    setStartDate("");
    setEndDate("");
  };

  // Handle date change - clear period when entering dates
  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    if (date) {
      setPeriod(null);
    }
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    if (date) {
      setPeriod(null);
    }
  };

  if (initialLoading) {
    return (
      <MainLayout userRole="seller" title="Revenue Analytics">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </MainLayout>
    );
  }

  if (!storeId) {
    return (
      <MainLayout userRole="seller" title="Revenue Analytics">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">
              No store found. Please contact administrator.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout userRole="seller" title="Thống Kê Doanh Thu">
      <div className="space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Orders Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng Đơn Hàng
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {refreshing ? (
                    <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    sellerRevenueService.formatNumber(
                      revenueStats?.totalOrders || 0
                    )
                  )}
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Total Revenue Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng Doanh Thu
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {refreshing ? (
                    <div className="h-9 w-32 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    sellerRevenueService.formatCurrency(
                      revenueStats?.totalRevenue || 0
                    )
                  )}
                </h3>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <CircleDollarSign className="h-6 w-6 text-yellow-600" />
              </div>
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

        {/* Charts */}
        <RevenueChart
          data={chartData}
          loading={false}
          chartType="line"
          showRevenue={true}
          showOrders={true}
          showDiscount={false}
          showCommission={false}
        />

        {/* Top Products */}
        <TopProducts products={topProducts} loading={false} />
      </div>
    </MainLayout>
  );
}
