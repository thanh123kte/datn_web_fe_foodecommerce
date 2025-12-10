"use client";

import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { WalletStatsCards } from "../../seller/wallet/components/WalletStatsCards";
import { TransactionList } from "../../seller/wallet/components/TransactionList";
import { DepositModal } from "../../seller/wallet/components/DepositModal";
import { WithdrawModal } from "../../seller/wallet/components/WithdrawModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  walletService,
  WalletResponseDto,
  WalletTransactionResponseDto,
  TransactionType,
  PageResponse,
} from "@/lib/services/walletService";
import { authApiService } from "@/lib/services/authApiService";
import {
  CreditCard,
  RefreshCw,
  Download,
  AlertTriangle,
  PlusCircle,
  MinusCircle,
} from "lucide-react";

export default function AdminWalletPage() {
  // State management
  const [wallet, setWallet] = useState<WalletResponseDto | null>(null);
  const [transactions, setTransactions] = useState<
    PageResponse<WalletTransactionResponseDto>
  >({ content: [], totalElements: 0, totalPages: 0, size: 20, number: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [transactionPage, setTransactionPage] = useState(0);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Get current user
  const currentUser = authApiService.getCurrentUser();
  const userId = currentUser?.id;

  // Load data
  const loadData = useCallback(async () => {
    if (!userId) {
      setError("Không tìm thấy thông tin người dùng");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [walletResult, transactionsResult] = await Promise.all([
        walletService.getWallet(userId),
        walletService.getTransactions(userId, {
          page: transactionPage,
          size: 20,
        }),
      ]);

      setWallet(walletResult);
      setTransactions(transactionsResult);
    } catch (error) {
      console.error("Failed to load wallet data:", error);
      setError("Không thể tải dữ liệu ví. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [userId, transactionPage]);

  // Load data on component mount and when pages change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // Handle transaction view
  const handleViewTransaction = useCallback(
    (transaction: WalletTransactionResponseDto) => {
      console.log("View transaction details:", transaction);
      // TODO: Open transaction details modal
    },
    []
  );

  // Handle page changes
  const handleTransactionPageChange = useCallback((newPage: number) => {
    setTransactionPage(newPage);
  }, []);

  // Handle deposit
  const handleDeposit = useCallback(
    async (amount: number, description: string) => {
      if (!userId) return;

      try {
        await walletService.deposit(String(userId), {
          amount,
          description,
        });
        await loadData(); // Refresh data after deposit
        setShowDepositModal(false);
      } catch (err) {
        console.error("Deposit failed:", err);
        throw err;
      }
    },
    [userId, loadData]
  );

  // Handle withdraw
  const handleWithdraw = useCallback(
    async (amount: number, bankAccount: string, description: string) => {
      if (!userId) return;

      try {
        await walletService.withdraw(String(userId), {
          amount,
          bankAccount,
          description,
        });
        await loadData(); // Refresh data after withdraw
        setShowWithdrawModal(false);
      } catch (err) {
        console.error("Withdraw failed:", err);
        throw err;
      }
    },
    [userId, loadData]
  );

  // Show error if no user ID
  if (!userId) {
    return (
      <MainLayout userRole="admin">
        <div className="p-6">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy thông tin người dùng
            </h2>
            <p className="text-gray-600">Vui lòng đăng nhập lại để tiếp tục.</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
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
              variant="default"
              size="sm"
              onClick={() => setShowDepositModal(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <PlusCircle className="h-4 w-4" />
              Nạp tiền
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
            >
              <MinusCircle className="h-4 w-4" />
              Rút tiền
            </Button>
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
            {/* TODO: Export report functionality not implemented in backend */}
            <Button
              variant="outline"
              size="sm"
              disabled
              className="flex items-center gap-2"
              title="Chức năng đang phát triển"
            >
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-900">{error}</p>
            </div>
          </Card>
        )}

        {/* Wallet Statistics */}
        <div className="grid grid-cols-1 gap-6">
          <WalletStatsCards wallet={wallet} loading={loading} />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
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
                    <p className="text-sm text-gray-600">Giao dịch trang đầu</p>
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
                ) : transactions.content.slice(0, 5).length > 0 ? (
                  transactions.content.slice(0, 5).map((transaction) => {
                    const isPositive = [
                      TransactionType.DEPOSIT,
                      TransactionType.EARN,
                    ].includes(transaction.transactionType);
                    return (
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
                                transaction.createdAt
                              ).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`font-semibold text-sm ${
                            isPositive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isPositive ? "+" : "-"}
                          {parseFloat(transaction.amount).toLocaleString(
                            "vi-VN"
                          )}
                          đ
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Chưa có giao dịch nào</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6 mt-6">
            <TransactionList
              transactions={transactions.content}
              loading={loading}
              onViewDetails={handleViewTransaction}
              showPagination={true}
              onPageChange={handleTransactionPageChange}
              currentPage={transactionPage}
              totalPages={transactions.totalPages}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit}
        currentBalance={wallet?.balance || "0"}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleWithdraw}
        currentBalance={wallet?.balance || "0"}
      />
    </>
  );
}
