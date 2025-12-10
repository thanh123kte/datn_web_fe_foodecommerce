"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpCircle, X, AlertCircle } from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, description: string) => Promise<void>;
  currentBalance?: string | number;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDeposit,
  currentBalance = 0,
}) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const minDeposit = 10000; // 10k VND minimum

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amountValue = parseFloat(amount);

    // Validation
    if (!amount || amountValue <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (amountValue < minDeposit) {
      setError(
        "Số tiền tối thiểu là " + minDeposit.toLocaleString("vi-VN") + "đ"
      );
      return;
    }

    try {
      setLoading(true);
      await onDeposit(amountValue, description || "Nạp tiền vào ví");

      // Reset form
      setAmount("");
      setDescription("");
      onClose();
    } catch (err) {
      setError("Không thể nạp tiền. Vui lòng thử lại.");
      console.error("Deposit error:", err);
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
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowUpCircle className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Nạp tiền vào ví
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
            {(typeof currentBalance === "string"
              ? parseFloat(currentBalance)
              : currentBalance
            ).toLocaleString("vi-VN")}
            đ
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <Label htmlFor="deposit-amount">
              Số tiền nạp <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deposit-amount"
              type="number"
              placeholder={`Tối thiểu ${minDeposit.toLocaleString("vi-VN")}đ`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              className="mt-1"
              min={minDeposit}
              step="1000"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="deposit-description">Ghi chú (tùy chọn)</Label>
            <Input
              id="deposit-description"
              type="text"
              placeholder="Ví dụ: Nạp tiền từ ngân hàng"
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

          {/* Info */}
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Lưu ý:</strong> Sau khi nạp tiền, số dư sẽ được cập nhật
              ngay lập tức.
            </p>
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
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? "Đang xử lý..." : "Xác nhận nạp tiền"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
