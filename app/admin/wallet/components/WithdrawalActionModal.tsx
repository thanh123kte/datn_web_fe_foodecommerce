"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  WalletTransactionResponseDto,
  TransactionStatus,
} from "@/lib/services/walletService";
import {
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  CreditCard,
  Hash,
} from "lucide-react";

interface WithdrawalActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: WalletTransactionResponseDto | null;
  onApprove: (transactionId: number) => Promise<void>;
  onReject: (transactionId: number, reason: string) => Promise<void>;
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
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const WithdrawalActionModal: React.FC<WithdrawalActionModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}) => {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApprove = async () => {
    if (!request) return;
    setError("");
    setLoading(true);

    try {
      await onApprove(request.id);
      onClose();
      setAction(null);
    } catch (err) {
      setError("Không thể duyệt yêu cầu. Vui lòng thử lại.");
      console.error("Approve error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!request) return;

    if (!rejectReason.trim()) {
      setError("Vui lòng nhập lý do từ chối");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await onReject(request.id, rejectReason);
      onClose();
      setAction(null);
      setRejectReason("");
    } catch (err) {
      setError("Không thể từ chối yêu cầu. Vui lòng thử lại.");
      console.error("Reject error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setAction(null);
      setRejectReason("");
      setError("");
    }
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Chi tiết yêu cầu rút tiền
              </h2>
              <p className="text-sm text-gray-600">ID: #{request.id}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Trạng thái:
            </span>
            <Badge
              className={`${
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

          {/* Amount Card */}
          <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Số tiền yêu cầu rút</p>
              <p className="text-4xl font-bold text-red-600">
                {formatCurrency(request.amount)}
              </p>
            </div>
          </Card>

          {/* Transaction Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Thông tin giao dịch</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium">User ID:</span>
                </div>
                <p className="text-gray-900 ml-6">{request.userId}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">Wallet ID:</span>
                </div>
                <p className="text-gray-900 ml-6">{request.walletId}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Thời gian tạo:</span>
                </div>
                <p className="text-gray-900 ml-6">
                  {formatDate(request.createdAt)}
                </p>
              </div>

              {request.referenceId && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">Reference ID:</span>
                  </div>
                  <p className="text-gray-900 ml-6">{request.referenceId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Balance Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Số dư ví</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Số dư trước:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(request.balanceBefore)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Số tiền rút:</span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(request.amount)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">
                  Số dư sau:
                </span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(request.balanceAfter)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {request.description && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Mô tả</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {request.description}
              </p>
            </div>
          )}

          {/* Action Selection */}
          {request.status === TransactionStatus.PENDING && !action && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold text-gray-900">
                Chọn hành động xử lý
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setAction("reject")}
                  className="h-auto py-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <XCircle className="h-6 w-6" />
                    <span className="font-semibold">Từ chối yêu cầu</span>
                  </div>
                </Button>
                <Button
                  size="lg"
                  onClick={() => setAction("approve")}
                  className="h-auto py-4 bg-green-600 hover:bg-green-700"
                >
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-semibold">Duyệt yêu cầu</span>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Approve Confirmation */}
          {action === "approve" && (
            <div className="space-y-4 pt-4 border-t">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900 mb-1">
                      Xác nhận duyệt yêu cầu
                    </p>
                    <p className="text-sm text-green-700">
                      Bạn đang chuẩn bị duyệt yêu cầu rút tiền{" "}
                      {formatCurrency(request.amount)} cho user {request.userId}
                      . Tiền sẽ được chuyển vào tài khoản ngân hàng của họ.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setAction(null)}
                  disabled={loading}
                  className="flex-1"
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận duyệt"}
                </Button>
              </div>
            </div>
          )}

          {/* Reject Form */}
          {action === "reject" && (
            <div className="space-y-4 pt-4 border-t">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900 mb-1">
                      Từ chối yêu cầu rút tiền
                    </p>
                    <p className="text-sm text-red-700">
                      Số tiền {formatCurrency(request.amount)} sẽ được hoàn lại
                      vào ví của user. Vui lòng nhập lý do từ chối.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="reject-reason">
                  Lý do từ chối <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reject-reason"
                  placeholder="Nhập lý do từ chối yêu cầu rút tiền..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  disabled={loading}
                  className="mt-1"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {rejectReason.length}/500 ký tự
                </p>
              </div>

              {error && (
                <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAction(null);
                    setRejectReason("");
                  }}
                  disabled={loading}
                  className="flex-1"
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={loading || !rejectReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận từ chối"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
