"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  WalletTransactionResponseDto,
  TransactionStatus,
} from "@/lib/services/walletService";
import {
  ArrowDownCircle,
  Calendar,
  User,
  Hash,
  CreditCard,
  Eye,
} from "lucide-react";

interface WithdrawalRequestsListProps {
  requests: WalletTransactionResponseDto[];
  loading?: boolean;
  onApprove: (transactionId: number) => void;
  onReject: (transactionId: number) => void;
  onViewDetails: (request: WalletTransactionResponseDto) => void;
}

const formatCurrency = (amount: string | number): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numAmount);
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

export const WithdrawalRequestsList: React.FC<WithdrawalRequestsListProps> = ({
  requests,
  loading,

  onViewDetails,
}) => {
  const [processingId] = useState<number | null>(null);



  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-12 text-center">
        <ArrowDownCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không có yêu cầu rút tiền
        </h3>
        <p className="text-gray-600">
          Hiện tại không có yêu cầu rút tiền nào cần xử lý
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card
          key={request.id}
          className="p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-6">
            {/* Left Section - Request Info */}
            <div className="flex items-start gap-4 flex-1">
              {/* Icon */}
              <div className="p-3 bg-orange-100 rounded-lg">
                <ArrowDownCircle className="h-6 w-6 text-orange-600" />
              </div>

              {/* Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-gray-900">
                    Yêu cầu rút tiền #{request.id}
                  </h4>
                  <Badge
                    className={`text-xs ${
                      request.status === TransactionStatus.PENDING
                        ? "bg-yellow-100 text-yellow-700"
                        : request.status === TransactionStatus.SUCCESSFUL
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {request.status === TransactionStatus.PENDING
                      ? "Chờ duyệt"
                      : request.status === TransactionStatus.SUCCESSFUL
                      ? "Đã duyệt"
                      : "Đã từ chối"}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600">{request.description}</p>

                {/* Additional Info Grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>User ID: {request.userId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(request.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    <span>Ví ID: {request.walletId}</span>
                  </div>
                  {request.referenceId && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Hash className="h-4 w-4" />
                      <span>Ref: {request.referenceId}</span>
                    </div>
                  )}
                </div>

                {/* Balance Info */}
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <span className="font-medium">Số dư trước:</span>{" "}
                  {formatCurrency(request.balanceBefore)} →{" "}
                  <span className="font-medium">Sau:</span>{" "}
                  {formatCurrency(request.balanceAfter)}
                </div>
              </div>
            </div>

            {/* Right Section - Amount and Actions */}
            <div className="flex flex-col items-end gap-4">
              {/* Amount */}
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Số tiền rút</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(request.amount)}
                </p>
              </div>

              {/* Actions */}
              {request.status === TransactionStatus.PENDING && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(request)}
                    disabled={processingId === request.id}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Xem & Xử lý
                  </Button>
                </div>
              )}

              {request.status !== TransactionStatus.PENDING && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(request)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Xem chi tiết
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
