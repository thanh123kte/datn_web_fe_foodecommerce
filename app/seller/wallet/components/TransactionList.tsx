"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  WalletTransaction,
  TransactionType,
  PaymentStatus,
  formatCurrency,
  getTransactionTypeLabel,
  getTransactionTypeColor,
  getPaymentStatusColor,
  isPositiveTransaction,
  isNegativeTransaction,
} from "@/lib/mockData/wallet";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Eye,
  Filter,
  Calendar,
  User,
  Hash,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface TransactionListProps {
  transactions: WalletTransaction[];
  loading?: boolean;
  onViewDetails?: (transaction: WalletTransaction) => void;
  showPagination?: boolean;
  pageSize?: number;
}

interface TransactionItemProps {
  transaction: WalletTransaction;
  onViewDetails?: (transaction: WalletTransaction) => void;
}

interface TransactionFiltersProps {
  onFilterChange: (filters: TransactionFilters) => void;
  loading?: boolean;
}

export interface TransactionFilters {
  type?: TransactionType | "ALL";
  status?: PaymentStatus | "ALL";
  dateRange?: {
    start: string;
    end: string;
  };
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onViewDetails,
}) => {
  const isPositive = isPositiveTransaction(transaction.transaction_type);
  const typeColor = getTransactionTypeColor(transaction.transaction_type);
  const statusColor = getPaymentStatusColor(
    transaction.status || PaymentStatus.SUCCESS
  );

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.DEPOSIT:
      case TransactionType.EARN:
        return <ArrowUpCircle className="h-5 w-5 text-green-600" />;
      case TransactionType.WITHDRAW:
      case TransactionType.PAYMENT:
      case TransactionType.REFUND:
        return <ArrowDownCircle className="h-5 w-5 text-red-600" />;
      default:
        return <ArrowUpCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        {/* Transaction Info */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="p-2 bg-gray-50 rounded-lg">
            {getTransactionIcon(transaction.transaction_type)}
          </div>

          {/* Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">
                {getTransactionTypeLabel(transaction.transaction_type)}
              </h4>
              <Badge className={`text-xs ${typeColor}`}>
                {transaction.transaction_type}
              </Badge>
              {transaction.status &&
                transaction.status !== PaymentStatus.SUCCESS && (
                  <Badge className={`text-xs ${statusColor}`}>
                    {transaction.status}
                  </Badge>
                )}
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              {transaction.description}
            </p>

            {/* Additional info */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(transaction.created_at)}
              </div>
              {transaction.order_id && (
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {transaction.order_id}
                </div>
              )}
              {transaction.customer_name && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {transaction.customer_name}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Amount and Actions */}
        <div className="flex items-center gap-4">
          {/* Amount */}
          <div className="text-right">
            <p
              className={`text-lg font-semibold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : "-"}
              {formatCurrency(Math.abs(transaction.amount))}
            </p>

            {/* Status indicator */}
            {transaction.status && (
              <div className="flex items-center justify-end gap-1 mt-1">
                {transaction.status === PaymentStatus.SUCCESS ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : transaction.status === PaymentStatus.PENDING ? (
                  <Clock className="h-3 w-3 text-yellow-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
                <span className="text-xs text-gray-500">
                  {transaction.status === PaymentStatus.SUCCESS
                    ? "Thành công"
                    : transaction.status === PaymentStatus.PENDING
                    ? "Đang xử lý"
                    : "Thất bại"}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(transaction)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Xem
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  onFilterChange,
  loading = false,
}) => {
  const [filters, setFilters] = useState<TransactionFilters>({
    type: "ALL",
    status: "ALL",
  });

  const handleFilterChange = (newFilters: Partial<TransactionFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            Lọc giao dịch:
          </span>
        </div>

        {/* Transaction Type Filter */}
        <select
          value={filters.type}
          onChange={(e) =>
            handleFilterChange({
              type: e.target.value as TransactionType | "ALL",
            })
          }
          disabled={loading}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="ALL">Tất cả loại</option>
          <option value={TransactionType.EARN}>Thu nhập</option>
          <option value={TransactionType.WITHDRAW}>Rút tiền</option>
          <option value={TransactionType.DEPOSIT}>Nạp tiền</option>
          <option value={TransactionType.REFUND}>Hoàn tiền</option>
          <option value={TransactionType.PAYMENT}>Thanh toán</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) =>
            handleFilterChange({
              status: e.target.value as PaymentStatus | "ALL",
            })
          }
          disabled={loading}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value={PaymentStatus.SUCCESS}>Thành công</option>
          <option value={PaymentStatus.PENDING}>Đang xử lý</option>
          <option value={PaymentStatus.FAILED}>Thất bại</option>
        </select>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            onChange={(e) =>
              handleFilterChange({
                dateRange: {
                  start: e.target.value,
                  end: filters.dateRange?.end || "",
                },
              })
            }
            disabled={loading}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Từ ngày"
          />
          <span className="text-gray-400">đến</span>
          <input
            type="date"
            onChange={(e) =>
              handleFilterChange({
                dateRange: {
                  start: filters.dateRange?.start || "",
                  end: e.target.value,
                },
              })
            }
            disabled={loading}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Đến ngày"
          />
        </div>
      </div>
    </Card>
  );
};

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  loading = false,
  onViewDetails,
  showPagination = false,
  pageSize = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TransactionFilters>({});

  // Apply filters
  const filteredTransactions = transactions.filter((transaction) => {
    if (
      filters.type &&
      filters.type !== "ALL" &&
      transaction.transaction_type !== filters.type
    ) {
      return false;
    }
    if (
      filters.status &&
      filters.status !== "ALL" &&
      transaction.status !== filters.status
    ) {
      return false;
    }
    if (filters.dateRange) {
      const transactionDate = new Date(transaction.created_at);
      if (
        filters.dateRange.start &&
        transactionDate < new Date(filters.dateRange.start)
      ) {
        return false;
      }
      if (
        filters.dateRange.end &&
        transactionDate > new Date(filters.dateRange.end)
      ) {
        return false;
      }
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedTransactions = showPagination
    ? filteredTransactions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      )
    : filteredTransactions;

  const handleFilterChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <TransactionFilters
          onFilterChange={handleFilterChange}
          loading={true}
        />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="p-4">
              <div className="animate-pulse flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                    <div className="w-48 h-3 bg-gray-200 rounded"></div>
                    <div className="w-24 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <TransactionFilters onFilterChange={handleFilterChange} />

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Thu nhập</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(
                  filteredTransactions
                    .filter((t) => isPositiveTransaction(t.transaction_type))
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Chi phí</p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(
                  filteredTransactions
                    .filter((t) => isNegativeTransaction(t.transaction_type))
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Số giao dịch</p>
              <p className="text-lg font-semibold text-blue-600">
                {filteredTransactions.length.toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Lịch sử giao dịch ({filteredTransactions.length})
          </h3>
        </div>

        {paginatedTransactions.length > 0 ? (
          <div className="space-y-4">
            {paginatedTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Hash className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Không có giao dịch nào</p>
            <p className="text-sm text-gray-500">
              Thử thay đổi bộ lọc để xem các giao dịch khác
            </p>
          </Card>
        )}

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Hiển thị {paginatedTransactions.length} trong số{" "}
              {filteredTransactions.length} giao dịch
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Trước
              </Button>
              <span className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
