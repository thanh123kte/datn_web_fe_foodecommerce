"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { RevenueStatsCards } from "./components/RevenueStatsCards";
import { RevenueChart } from "./components/RevenueChart";
import {
  RevenueFilters,
  RevenueFiltersState,
} from "./components/RevenueFilters";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RevenueStats,
  ChartData,
  RevenueReport,
  revenueAPI,
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/lib/mockData/revenue";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function RevenuePage() {
  // State management
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [revenueReports, setRevenueReports] = useState<RevenueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  // Default filter state
  const [filters, setFilters] = useState<RevenueFiltersState>(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    return {
      startDate: lastWeek.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
      reportType: "DAILY",
      type: "line",
      showRevenue: true,
      showOrders: true,
      showDiscount: true,
      showCommission: false,
    };
  });

  // Load data based on filters
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsResult, chartResult, reportsResult] = await Promise.all([
        revenueAPI.getRevenueStats(filters.startDate, filters.endDate),
        revenueAPI.getChartData(
          filters.startDate,
          filters.endDate,
          filters.reportType
        ),
        revenueAPI.getRevenueReports(1, 10, filters.reportType),
      ]);

      setRevenueStats(statsResult);
      setChartData(chartResult);
      setRevenueReports(reportsResult.reports);
    } catch (error) {
      console.error("Failed to load revenue data:", error);
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate, filters.reportType]);

  // Load data on component mount and filter changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: Partial<RevenueFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  // Handle refresh
  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // Handle export
  const handleExport = useCallback(
    async (format: "CSV" | "PDF") => {
      setExportLoading(true);
      try {
        const blob = await revenueAPI.exportRevenueData(
          filters.startDate,
          filters.endDate,
          format
        );

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `revenue-report-${filters.startDate}-${
          filters.endDate
        }.${format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to export data:", error);
      } finally {
        setExportLoading(false);
      }
    },
    [filters.startDate, filters.endDate]
  );

  // Calculate date range info
  const dateRangeInfo = useMemo(() => {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return {
      totalDays: diffDays,
      startDate: start.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      endDate: end.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  }, [filters.startDate, filters.endDate]);

  return (
    <MainLayout userRole="seller" title="Revenue Analytics">
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Revenue Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Track your store performance and revenue insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              {dateRangeInfo.totalDays} day
              {dateRangeInfo.totalDays > 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <RevenueFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
          onExport={handleExport}
          loading={loading || exportLoading}
        />

        {/* Stats Cards */}
        {revenueStats && (
          <RevenueStatsCards stats={revenueStats} loading={loading} />
        )}

        {/* Charts */}
        <RevenueChart
          data={chartData}
          loading={loading}
          chartType={filters.type}
          showRevenue={filters.showRevenue}
          showOrders={filters.showOrders}
          showDiscount={filters.showDiscount}
          showCommission={filters.showCommission}
        />

        {/* Revenue Reports Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Revenue Reports
            </h3>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View All Reports
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="w-20 h-4 bg-gray-200 rounded ml-auto"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded ml-auto"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {revenueReports.map((report) => {
                const netRevenue = report.total_revenue - report.total_discount;
                const discountRate =
                  (report.total_discount / report.total_revenue) * 100;

                return (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(report.report_date).toLocaleDateString(
                            "vi-VN",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            {formatNumber(report.total_orders)} orders
                          </span>
                          <span>•</span>
                          <span>
                            {formatPercentage(discountRate)} discount rate
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatCurrency(report.total_revenue)}
                        </span>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-sm text-gray-600">
                        Net: {formatCurrency(netRevenue)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {revenueReports.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No Revenue Data
                  </h4>
                  <p className="text-gray-600">
                    No revenue reports found for the selected date range.
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Additional Insights */}
        {revenueStats && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Performance Insights
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue Growth</span>
                  <div className="flex items-center gap-2">
                    {revenueStats.revenueGrowth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        revenueStats.revenueGrowth >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatPercentage(revenueStats.revenueGrowth)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Discount Impact</span>
                  <span className="text-sm font-medium">
                    -{formatCurrency(revenueStats.totalDiscount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Commission Fees</span>
                  <span className="text-sm font-medium">
                    -{formatCurrency(revenueStats.totalCommission)}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Quick Actions
              </h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Detailed Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
