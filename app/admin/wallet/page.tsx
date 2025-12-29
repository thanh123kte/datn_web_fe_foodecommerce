"use client";

import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { WalletStatsCards } from "../../seller/wallet/components/WalletStatsCards";
import { TransactionList } from "../../seller/wallet/components/TransactionList";
import { WithdrawalRequestsList } from "./components/WithdrawalRequestsList";
import { WithdrawalActionModal } from "./components/WithdrawalActionModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  walletService,
  WalletResponseDto,
  WalletTransactionResponseDto,
  TransactionType,
  TransactionStatus,
  PageResponse,
} from "@/lib/services/walletService";
import { authApiService } from "@/lib/services/authApiService";
import {
  CreditCard,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckSquare,
  Clock,
  PlusCircle,
  MinusCircle,
} from "lucide-react";

export default function AdminWalletPage() {
  // State management
  const [wallet, setWallet] = useState<WalletResponseDto | null>(null);
  const [transactions, setTransactions] = useState<
    PageResponse<WalletTransactionResponseDto>
  >({ content: [], totalElements: 0, totalPages: 0, size: 20, number: 0 });
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WalletTransactionResponseDto[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("withdrawals");
  const [transactionPage, setTransactionPage] = useState(0);
  const [selectedRequest, setSelectedRequest] =
    useState<WalletTransactionResponseDto | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

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
      const [walletResult, transactionsResult, withdrawalsResult] =
        await Promise.all([
          walletService.getWallet(userId),
          walletService.getTransactions(userId, {
            page: transactionPage,
            size: 20,
          }),
          // Load all withdrawal requests (all statuses) using new API
          walletService.getWithdrawalsByStatus(TransactionStatus.PENDING),
        ]);

      setWallet(walletResult);
      setTransactions(transactionsResult);

      // Set withdrawal requests from new API
      const withdrawals = Array.isArray(withdrawalsResult)
        ? withdrawalsResult
        : withdrawalsResult.content || [];
      setWithdrawalRequests(withdrawals);
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

  // Handle view withdrawal details
  const handleViewWithdrawal = useCallback(
    (request: WalletTransactionResponseDto) => {
      setSelectedRequest(request);
      setShowActionModal(true);
    },
    []
  );

  // Handle approve withdrawal
  const handleApproveWithdrawal = useCallback(
    async (transactionId: number) => {
      try {
        await walletService.approveWithdrawal(transactionId);
        await loadData(); // Refresh data
        setShowActionModal(false);
        setSelectedRequest(null);
      } catch (err) {
        console.error("Approve withdrawal failed:", err);
        throw err;
      }
    },
    [loadData]
  );

  // Handle reject withdrawal
  const handleRejectWithdrawal = useCallback(
    async (transactionId: number, reason: string) => {
      try {
        await walletService.rejectWithdrawal(transactionId, reason);
        await loadData(); // Refresh data
        setShowActionModal(false);
        setSelectedRequest(null);
      } catch (err) {
        console.error("Reject withdrawal failed:", err);
        throw err;
      }
    },
    [loadData]
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="withdrawals">
              <Clock className="h-4 w-4 mr-2" />
              Yêu cầu rút tiền
              {withdrawalRequests.filter(
                (r) => r.status === TransactionStatus.PENDING
              ).length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-500 text-white rounded-full">
                  {
                    withdrawalRequests.filter(
                      (r) => r.status === TransactionStatus.PENDING
                    ).length
                  }
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="overview">
              <CreditCard className="h-4 w-4 mr-2" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="transactions">Lịch sử giao dịch</TabsTrigger>
          </TabsList>

          {/* Withdrawal Requests Tab */}
          <TabsContent value="withdrawals" className="space-y-6 mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div></div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Làm mới
                </Button>
              </div>

              {/* Stats Cards */}

              {/* Withdrawal Requests List */}
              <WithdrawalRequestsList
                requests={withdrawalRequests}
                loading={loading}
                onApprove={handleApproveWithdrawal}
                onReject={(transactionId: number) => handleRejectWithdrawal(transactionId, "Rejected by admin")}
                onViewDetails={handleViewWithdrawal}
              />
            </Card>
          </TabsContent>

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

      {/* Withdrawal Action Modal */}
      <WithdrawalActionModal
        isOpen={showActionModal}
        onClose={() => {
          setShowActionModal(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onApprove={handleApproveWithdrawal}
        onReject={handleRejectWithdrawal}
      />
    </>
  );
}
