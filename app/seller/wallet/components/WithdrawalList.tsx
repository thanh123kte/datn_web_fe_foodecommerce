"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  WithdrawalRequest,
  PaymentStatus,
  formatCurrency,
  getPaymentStatusColor,
} from "@/lib/mockData/wallet";
import {
  ArrowDownCircle,
  CreditCard,
  Building2,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  AlertTriangle,
} from "lucide-react";

interface WithdrawalListProps {
  withdrawals: WithdrawalRequest[];
  loading?: boolean;
  onCancel?: (withdrawalId: string) => void;
}

interface WithdrawalFormProps {
  currentBalance: number;
  pendingAmount: number;
  onSubmit: (
    request: Omit<
      WithdrawalRequest,
      "id" | "status" | "requested_at" | "wallet_id"
    >
  ) => void;
  loading?: boolean;
  onClose: () => void;
}

interface WithdrawalItemProps {
  withdrawal: WithdrawalRequest;
  onCancel?: (withdrawalId: string) => void;
}

const WithdrawalItem: React.FC<WithdrawalItemProps> = ({
  withdrawal,
  onCancel,
}) => {
  const statusColor = getPaymentStatusColor(withdrawal.status);

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case PaymentStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case PaymentStatus.FAILED:
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
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
              <Badge className={`text-xs ${statusColor}`}>
                {withdrawal.status === PaymentStatus.SUCCESS
                  ? "Đã xử lý"
                  : withdrawal.status === PaymentStatus.PENDING
                  ? "Đang xử lý"
                  : "Thất bại"}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {withdrawal.bank_name}
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  ****{withdrawal.bank_account.slice(-4)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {withdrawal.account_holder}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Yêu cầu: {formatDate(withdrawal.requested_at)}
                </div>
                {withdrawal.processed_at && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Xử lý: {formatDate(withdrawal.processed_at)}
                  </div>
                )}
              </div>

              {withdrawal.notes && (
                <p className="text-xs text-gray-500 mt-1">
                  Ghi chú: {withdrawal.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {getStatusIcon(withdrawal.status)}
          {withdrawal.status === PaymentStatus.PENDING && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(withdrawal.id)}
              className="text-red-600 hover:text-red-700"
            >
              Hủy
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({
  currentBalance,
  pendingAmount,
  onSubmit,
  loading = false,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    bank_account: "",
    bank_name: "Vietcombank",
    account_holder: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableBalance = currentBalance - pendingAmount;
  const minWithdrawal = 100000; // 100k VND minimum

  const bankOptions = [
    "Vietcombank",
    "VietinBank",
    "BIDV",
    "Agribank",
    "Techcombank",
    "MB Bank",
    "ACB",
    "VPBank",
    "TPBank",
    "SHB",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Vui lòng nhập số tiền hợp lệ";
    } else if (parseFloat(formData.amount) < minWithdrawal) {
      newErrors.amount = `Số tiền tối thiểu là ${formatCurrency(
        minWithdrawal
      )}`;
    } else if (parseFloat(formData.amount) > availableBalance) {
      newErrors.amount = "Số tiền vượt quá số dư khả dụng";
    }

    if (!formData.bank_account || formData.bank_account.length < 8) {
      newErrors.bank_account =
        "Vui lòng nhập số tài khoản hợp lệ (tối thiểu 8 ký tự)";
    }

    if (!formData.account_holder.trim()) {
      newErrors.account_holder = "Vui lòng nhập tên chủ tài khoản";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        amount: parseFloat(formData.amount),
        bank_account: formData.bank_account,
        bank_name: formData.bank_name,
        account_holder: formData.account_holder.toUpperCase(),
        notes: formData.notes,
      });
      onClose();
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Yêu cầu rút tiền
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>

      {/* Balance Info */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ArrowDownCircle className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">Thông tin số dư</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-600">Số dư hiện tại:</span>
            <p className="font-semibold text-blue-900">
              {formatCurrency(currentBalance)}
            </p>
          </div>
          <div>
            <span className="text-blue-600">Đang chờ xử lý:</span>
            <p className="font-semibold text-blue-900">
              {formatCurrency(pendingAmount)}
            </p>
          </div>
          <div className="col-span-2">
            <span className="text-blue-600">Có thể rút:</span>
            <p className="font-semibold text-green-700 text-lg">
              {formatCurrency(availableBalance)}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <Label htmlFor="amount">Số tiền rút *</Label>
          <Input
            id="amount"
            type="number"
            placeholder={`Tối thiểu ${formatCurrency(minWithdrawal)}`}
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            className={errors.amount ? "border-red-300" : ""}
          />
          {errors.amount && (
            <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Bank Selection */}
        <div>
          <Label htmlFor="bank_name">Ngân hàng *</Label>
          <select
            id="bank_name"
            value={formData.bank_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bank_name: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {bankOptions.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        {/* Account Number */}
        <div>
          <Label htmlFor="bank_account">Số tài khoản *</Label>
          <Input
            id="bank_account"
            type="text"
            placeholder="Nhập số tài khoản ngân hàng"
            value={formData.bank_account}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bank_account: e.target.value }))
            }
            className={errors.bank_account ? "border-red-300" : ""}
          />
          {errors.bank_account && (
            <p className="text-sm text-red-600 mt-1">{errors.bank_account}</p>
          )}
        </div>

        {/* Account Holder */}
        <div>
          <Label htmlFor="account_holder">Tên chủ tài khoản *</Label>
          <Input
            id="account_holder"
            type="text"
            placeholder="Tên chủ tài khoản (viết hoa, không dấu)"
            value={formData.account_holder}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                account_holder: e.target.value,
              }))
            }
            className={errors.account_holder ? "border-red-300" : ""}
          />
          {errors.account_holder && (
            <p className="text-sm text-red-600 mt-1">{errors.account_holder}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
          <Input
            id="notes"
            type="text"
            placeholder="Ghi chú thêm cho yêu cầu rút tiền"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
          />
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Lưu ý quan trọng:</p>
              <ul className="space-y-1 text-xs">
                <li>• Thời gian xử lý: 1-3 ngày làm việc</li>
                <li>• Kiểm tra kỹ thông tin tài khoản trước khi gửi</li>
                <li>• Không thể chỉnh sửa sau khi gửi yêu cầu</li>
                <li>• Phí giao dịch có thể áp dụng tùy ngân hàng</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export const WithdrawalList: React.FC<WithdrawalListProps> = ({
  withdrawals,
  loading = false,
  onCancel,
}) => {
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
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
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Lịch sử rút tiền ({withdrawals.length})
        </h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Yêu cầu rút tiền
        </Button>
      </div>

      {showForm && (
        <WithdrawalForm
          currentBalance={15750000} // This should come from props
          pendingAmount={2500000} // This should come from props
          onSubmit={(request) => {
            console.log("New withdrawal request:", request);
            // Handle form submission
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      {withdrawals.length > 0 ? (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <WithdrawalItem
              key={withdrawal.id}
              withdrawal={withdrawal}
              onCancel={onCancel}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <ArrowDownCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Chưa có yêu cầu rút tiền nào</p>
          <p className="text-sm text-gray-500">
            Bắt đầu bằng cách tạo yêu cầu rút tiền đầu tiên
          </p>
        </Card>
      )}
    </div>
  );
};
