"use client";

import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { WalletStatsCards } from "./components/WalletStatsCards";
import { TransactionList } from "./components/TransactionList";
import { WithdrawalList } from "./components/WithdrawalList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  // Wallet,
  WalletStats,
  WalletTransaction,
  WithdrawalRequest,
  MonthlyEarning,
  walletAPI,
} from "@/lib/mockData/wallet";
import {
  TrendingUp,
  CreditCard,
  RefreshCw,
  Download,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function WalletPage() {
  // State management
  // const [wallet, setWallet] = useState<Wallet | null>(null); // For future use
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        // walletResult,
        statsResult,
        transactionsResult,
        withdrawalsResult,
        monthlyResult,
      ] = await Promise.all([
        // walletAPI.getWallet(),
        walletAPI.getWalletStats(),
        walletAPI.getTransactions(1, 20),
        walletAPI.getWithdrawalRequests(),
        walletAPI.getMonthlyEarnings(),
      ]);

      // setWallet(walletResult);
      setWalletStats(statsResult);
      setTransactions(transactionsResult.transactions);
      setWithdrawals(withdrawalsResult);
      setMonthlyEarnings(monthlyResult);
    } catch (error) {
      console.error("Failed to load wallet data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // Handle transaction view
  const handleViewTransaction = useCallback(
    (transaction: WalletTransaction) => {
      console.log("View transaction details:", transaction);
      // Open transaction details modal or navigate
    },
    []
  );

  // Handle withdrawal cancellation
  const handleCancelWithdrawal = useCallback(
    async (withdrawalId: string) => {
      if (confirm("Bạn có chắc chắn muốn hủy yêu cầu rút tiền này?")) {
        try {
          const success = await walletAPI.cancelWithdrawalRequest(withdrawalId);
          if (success) {
            loadData(); // Refresh data
          }
        } catch (error) {
          console.error("Failed to cancel withdrawal:", error);
        }
      }
    },
    [loadData]
  );

  // Format chart data
  const chartData = monthlyEarnings.map((item) => ({
    month: item.month,
    earnings: item.total_earnings / 1000000, // Convert to millions
    orders: item.total_orders,
    avgOrder: item.average_order_value / 1000, // Convert to thousands
  }));

  return (
    <MainLayout userRole="seller">
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ví QtiWallet</h1>
            <p className="text-gray-600 mt-1">
              Quản lý số dư, giao dịch và rút tiền một cách dễ dàng
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Wallet Statistics */}
        <div className="grid grid-cols-1 gap-6">
          {walletStats && (
            <WalletStatsCards stats={walletStats} loading={loading} />
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
            <TabsTrigger value="withdrawals">Rút tiền</TabsTrigger>
            <TabsTrigger value="analytics">Thống kê</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Giao dịch gần đây
                      </h3>
                      <p className="text-sm text-gray-600">
                        5 giao dịch mới nhất
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("transactions")}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Xem tất cả →
                  </Button>
                </div>

                <div className="space-y-3">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                            <div className="space-y-1">
                              <div className="w-32 h-4 bg-gray-200 rounded"></div>
                              <div className="w-24 h-3 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                          <div className="w-16 h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))
                  ) : transactions.slice(0, 5).length > 0 ? (
                    transactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {transaction.description.length > 40
                                ? transaction.description.substring(0, 40) +
                                  "..."
                                : transaction.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(
                                transaction.created_at
                              ).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`font-semibold text-sm ${
                            ["DEPOSIT", "EARN"].includes(
                              transaction.transaction_type
                            )
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {["DEPOSIT", "EARN"].includes(
                            transaction.transaction_type
                          )
                            ? "+"
                            : "-"}
                          {transaction.amount.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Chưa có giao dịch nào</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Thống kê nhanh
                      </h3>
                      <p className="text-sm text-gray-600">
                        Hiệu suất tháng này
                      </p>
                    </div>
                  </div>
                </div>

                {loading || !walletStats ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm text-green-600">
                          Thu nhập tháng này
                        </p>
                        <p className="text-xl font-semibold text-green-700">
                          {(walletStats.monthly_earnings / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-green-600">Tăng trưởng</p>
                        <p className="text-sm font-semibold text-green-700">
                          +12.5%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm text-blue-600">Trung bình/ngày</p>
                        <p className="text-xl font-semibold text-blue-700">
                          {(walletStats.monthly_earnings / 30 / 1000).toFixed(
                            0
                          )}
                          K
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-blue-600">
                          So với tuần trước
                        </p>
                        <p className="text-sm font-semibold text-blue-700">
                          +8.2%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div>
                        <p className="text-sm text-orange-600">Đang chờ rút</p>
                        <p className="text-xl font-semibold text-orange-700">
                          {(walletStats.pending_withdrawals / 1000000).toFixed(
                            1
                          )}
                          M
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-orange-600">Yêu cầu</p>
                        <p className="text-sm font-semibold text-orange-700">
                          {
                            withdrawals.filter((w) => w.status === "PENDING")
                              .length
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Monthly Earnings Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Thu nhập theo tháng
                    </h3>
                    <p className="text-sm text-gray-600">
                      Biểu đồ thu nhập 11 tháng qua
                    </p>
                  </div>
                </div>
              </div>

              {loading || monthlyEarnings.length === 0 ? (
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === "earnings" ? `${value}M VND` : value,
                          name === "earnings" ? "Thu nhập" : "Đơn hàng",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="earnings"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6 mt-6">
            <TransactionList
              transactions={transactions}
              loading={loading}
              onViewDetails={handleViewTransaction}
              showPagination={true}
            />
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals" className="space-y-6 mt-6">
            <WithdrawalList
              withdrawals={withdrawals}
              loading={loading}
              onCancel={handleCancelWithdrawal}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Bar Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thu nhập & Đơn hàng
                </h3>
                {loading || monthlyEarnings.length === 0 ? (
                  <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="earnings"
                          fill="#3B82F6"
                          name="Thu nhập (M)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>

              {/* Performance Metrics */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Chỉ số hiệu suất
                </h3>
                {loading || !walletStats ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">Tổng thu nhập</span>
                      <span className="font-semibold">
                        {(walletStats.total_earned / 1000000).toFixed(1)}M VND
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">Tỷ lệ rút tiền</span>
                      <span className="font-semibold">
                        {(
                          (walletStats.total_withdrawn /
                            walletStats.total_earned) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">
                        Trung bình giao dịch
                      </span>
                      <span className="font-semibold">
                        {(
                          walletStats.total_earned /
                          walletStats.total_transactions /
                          1000
                        ).toFixed(0)}
                        K VND
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">Hoàn tiền</span>
                      <span className="font-semibold">
                        {(
                          (walletStats.total_refunded /
                            walletStats.total_earned) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
