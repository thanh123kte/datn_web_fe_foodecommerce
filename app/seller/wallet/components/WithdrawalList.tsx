"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletTransactionResponseDto } from "@/lib/services/walletService";
import {
  ArrowDownCircle,
  Hash,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react";

// Utility function to format currency
const formatCurrency = (amount: string | number): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numAmount);
};

interface WithdrawalListProps {
  withdrawals: WalletTransactionResponseDto[];
  loading?: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

interface WithdrawalItemProps {
  withdrawal: WalletTransactionResponseDto;
}

const WithdrawalItem: React.FC<WithdrawalItemProps> = ({ withdrawal }) => {
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
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="p-2 bg-orange-50 rounded-lg">
            <ArrowDownCircle className="h-5 w-5 text-orange-600" />
          </div>

          {/* Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-lg text-gray-900">
                {formatCurrency(withdrawal.amount)}
              </h4>
              <Badge className="text-xs text-orange-600 bg-orange-100">
                Rút tiền
              </Badge>
            </div>

            <p className="text-sm text-gray-600 max-w-md">
              {withdrawal.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(withdrawal.createdAt)}
              </div>
              {withdrawal.referenceId && (
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {withdrawal.referenceType}: {withdrawal.referenceId}
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500">
              Số dư trước: {formatCurrency(withdrawal.balanceBefore)} → Sau:{" "}
              {formatCurrency(withdrawal.balanceAfter)}
            </div>
          </div>
        </div>

        {/* Amount Display */}
        <div className="text-right">
          <p className="text-lg font-semibold text-red-600">
            -{formatCurrency(withdrawal.amount)}
          </p>
        </div>
      </div>
    </Card>
  );
};

// TODO: Withdrawal request form not implemented - backend only supports direct withdrawal API
// This would require a separate withdrawal request/approval system in the backend

export const WithdrawalList: React.FC<WithdrawalListProps> = ({
  withdrawals,
  loading = false,
  onPageChange,
  currentPage = 0,
  totalPages = 1,
}) => {
  if (loading) {
    return (
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
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="p-4 bg-orange-50 border-orange-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <div>
            <p className="text-sm font-medium text-orange-900">
              Lịch sử rút tiền
            </p>
            <p className="text-xs text-orange-700">
              Hiển thị các lần rút tiền đã thực hiện. Liên hệ quản trị viên để
              thực hiện rút tiền mới.
            </p>
          </div>
        </div>
      </Card>

      {/* Withdrawal List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Các lần rút tiền ({withdrawals.length})
        </h3>

        {withdrawals.length > 0 ? (
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => (
              <WithdrawalItem key={withdrawal.id} withdrawal={withdrawal} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <ArrowDownCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Chưa có lần rút tiền nào</p>
            <p className="text-sm text-gray-500">
              Lịch sử rút tiền sẽ hiển thị ở đây
            </p>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Trang {currentPage + 1} / {totalPages}
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

// TODO: Withdrawal form functionality not implemented
