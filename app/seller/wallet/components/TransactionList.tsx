"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  WalletTransactionResponseDto,
  TransactionType,
} from "@/lib/services/walletService";
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

// Utility functions
const formatCurrency = (amount: string | number): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numAmount);
};

const getTransactionTypeLabel = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.DEPOSIT:
      return "Nạp tiền";
    case TransactionType.WITHDRAW:
      return "Rút tiền";
    case TransactionType.EARN:
      return "Thu nhập";
    case TransactionType.REFUND:
      return "Hoàn tiền";
    case TransactionType.PAYMENT:
      return "Thanh toán";
    default:
      return type;
  }
};

const getTransactionTypeColor = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.DEPOSIT:
      return "text-blue-600 bg-blue-100";
    case TransactionType.WITHDRAW:
      return "text-orange-600 bg-orange-100";
    case TransactionType.EARN:
      return "text-green-600 bg-green-100";
    case TransactionType.REFUND:
      return "text-red-600 bg-red-100";
    case TransactionType.PAYMENT:
      return "text-purple-600 bg-purple-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const isPositiveTransaction = (type: TransactionType): boolean => {
  return [TransactionType.DEPOSIT, TransactionType.EARN].includes(type);
};

interface TransactionListProps {
  transactions: WalletTransactionResponseDto[];
  loading?: boolean;
  onViewDetails?: (transaction: WalletTransactionResponseDto) => void;
  showPagination?: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

interface TransactionItemProps {
  transaction: WalletTransactionResponseDto;
  onViewDetails?: (transaction: WalletTransactionResponseDto) => void;
}

export interface TransactionFilters {
  type?: TransactionType | "ALL";
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onViewDetails,
}) => {
  const isPositive = isPositiveTransaction(transaction.transactionType);
  const typeColor = getTransactionTypeColor(transaction.transactionType);

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
            {getTransactionIcon(transaction.transactionType)}
          </div>

          {/* Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">
                {getTransactionTypeLabel(transaction.transactionType)}
              </h4>
              <Badge className={`text-xs ${typeColor}`}>
                {transaction.transactionType}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              {transaction.description}
            </p>

            {/* Additional info */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(transaction.createdAt)}
              </div>
              {transaction.referenceId && (
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {transaction.referenceType}: {transaction.referenceId}
                </div>
              )}
            </div>

            {/* Balance information */}
            <div className="text-xs text-gray-500">
              Số dư trước: {formatCurrency(transaction.balanceBefore)} → Sau:{" "}
              {formatCurrency(transaction.balanceAfter)}
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
              {formatCurrency(
                Math.abs(
                  typeof transaction.amount === "string"
                    ? parseFloat(transaction.amount)
                    : transaction.amount
                )
              )}
            </p>
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

// Simple transaction type filter component
interface SimpleTransactionFiltersProps {
  onFilterChange: (type: TransactionType | "ALL") => void;
  loading?: boolean;
}

const SimpleTransactionFilters: React.FC<SimpleTransactionFiltersProps> = ({
  onFilterChange,
  loading = false,
}) => {
  const [selectedType, setSelectedType] = useState<TransactionType | "ALL">(
    "ALL"
  );

  const handleChange = (type: TransactionType | "ALL") => {
    setSelectedType(type);
    onFilterChange(type);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            Lọc theo loại:
          </span>
        </div>

        <select
          value={selectedType}
          onChange={(e) =>
            handleChange(e.target.value as TransactionType | "ALL")
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

        {/* TODO: Date range filtering not implemented in backend API */}
      </div>
    </Card>
  );
};

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  loading = false,
  onViewDetails,
  showPagination = false,
  onPageChange,
  currentPage = 0,
  totalPages = 1,
}) => {
  const [typeFilter, setTypeFilter] = useState<TransactionType | "ALL">("ALL");

  // Apply client-side type filter (server already handles pagination)
  const filteredTransactions =
    typeFilter === "ALL"
      ? transactions
      : transactions.filter(
          (transaction) => transaction.transactionType === typeFilter
        );

  const handleFilterChange = (type: TransactionType | "ALL") => {
    setTypeFilter(type);
    // Note: In a real implementation, this should trigger a new API call with the filter
    // For now, we filter client-side from the already loaded page
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <SimpleTransactionFilters
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
      <SimpleTransactionFilters onFilterChange={handleFilterChange} />

      {/* Transaction List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Lịch sử giao dịch ({filteredTransactions.length})
          </h3>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
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
        {showPagination && totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Hiển thị {filteredTransactions.length} giao dịch (Trang{" "}
              {currentPage + 1})
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 0}
                onClick={() => onPageChange(currentPage - 1)}
              >
                Trước
              </Button>
              <span className="text-sm text-gray-600">
                Trang {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
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
