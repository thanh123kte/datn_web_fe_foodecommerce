"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownCircle, X, AlertCircle, AlertTriangle } from "lucide-react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (
    amount: number,
    bankAccount: string,
    description: string
  ) => Promise<void>;
  currentBalance?: string | number;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onWithdraw,
  currentBalance = 0,
}) => {
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const minWithdraw = 50000; // 50k VND minimum
  const balanceNum =
    typeof currentBalance === "string"
      ? parseFloat(currentBalance)
      : currentBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amountValue = parseFloat(amount);

    // Validation
    if (!amount || amountValue <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (amountValue < minWithdraw) {
      setError(`Số tiền tối thiểu là ${minWithdraw.toLocaleString("vi-VN")}đ`);
      return;
    }

    if (amountValue > balanceNum) {
      setError(
        `Số dư không đủ. Số dư hiện tại: ${balanceNum.toLocaleString("vi-VN")}đ`
      );
      return;
    }

    if (!bankAccount.trim()) {
      setError("Vui lòng nhập số tài khoản ngân hàng");
      return;
    }

    if (bankAccount.length < 8) {
      setError("Số tài khoản phải có ít nhất 8 ký tự");
      return;
    }

    try {
      setLoading(true);
      await onWithdraw(
        amountValue,
        bankAccount.trim(),
        description || "Rút tiền về ngân hàng"
      );

      // Reset form
      setAmount("");
      setBankAccount("");
      setDescription("");
      onClose();
    } catch (err) {
      setError("Không thể rút tiền. Vui lòng thử lại.");
      console.error("Withdraw error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ArrowDownCircle className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Rút tiền từ ví
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Current Balance Info */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-600 mb-1">Số dư hiện tại</p>
          <p className="text-2xl font-bold text-blue-900">
            {balanceNum.toLocaleString("vi-VN")}đ
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <Label htmlFor="withdraw-amount">
              Số tiền rút <span className="text-red-500">*</span>
            </Label>
            <Input
              id="withdraw-amount"
              type="number"
              placeholder={`Tối thiểu ${minWithdraw.toLocaleString("vi-VN")}đ`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              className="mt-1"
              min={minWithdraw}
              max={currentBalance}
              step="1000"
            />
          </div>

          {/* Bank Account */}
          <div>
            <Label htmlFor="withdraw-bank">
              Số tài khoản ngân hàng <span className="text-red-500">*</span>
            </Label>
            <Input
              id="withdraw-bank"
              type="text"
              placeholder="Nhập số tài khoản"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              disabled={loading}
              className="mt-1"
              minLength={8}
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-1">
              Tiền sẽ được chuyển vào tài khoản này
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="withdraw-description">Ghi chú (tùy chọn)</Label>
            <Input
              id="withdraw-description"
              type="text"
              placeholder="Ví dụ: Rút về tài khoản Vietcombank"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="mt-1"
              maxLength={200}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-800">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>
                    Số tiền sẽ bị trừ ngay khỏi ví và chuyển sang trạng thái{" "}
                    <strong>&quot;Chờ duyệt&quot;</strong>
                  </li>
                  <li>
                    Admin sẽ xét duyệt yêu cầu rút tiền trong vòng 1-3 ngày làm
                    việc
                  </li>
                  <li>Kiểm tra kỹ số tài khoản trước khi xác nhận</li>
                  <li>Nếu bị từ chối, tiền sẽ được hoàn lại vào ví của bạn</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {loading ? "Đang xử lý..." : "Xác nhận rút tiền"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
