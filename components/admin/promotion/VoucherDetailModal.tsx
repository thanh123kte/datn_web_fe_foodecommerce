"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Voucher,
  VoucherFormData,
  DiscountType,
  DiscountStatus,
} from "@/types/promotion";

interface VoucherDetailModalProps {
  voucher: Voucher | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (voucher: Voucher) => void;
  onStatusChange?: (voucherId: number, status: DiscountStatus) => void;
  isCreateMode?: boolean;
  isSeller?: boolean;
}

export function VoucherDetailModal({
  voucher,
  isOpen,
  onClose,
  onSave,
  onStatusChange,
  isCreateMode = false,
  isSeller = false,
}: VoucherDetailModalProps) {
  const [formData, setFormData] = useState<VoucherFormData>({
    code: "",
    title: "",
    discount_type: DiscountType.PERCENTAGE,
    discount_value: 0,
    min_order_value: 0,
    max_discount: 0,
    start_date: "",
    end_date: "",
    usage_limit: 1,
    seller_id: undefined,
    status: DiscountStatus.ACTIVE,
    is_created_by_admin: !isSeller,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (voucher) {
      setFormData({
        code: voucher.code,
        title: voucher.title,
        discount_type: voucher.discount_type,
        discount_value: voucher.discount_value,
        min_order_value: voucher.min_order_value,
        max_discount: voucher.max_discount,
        start_date: voucher.start_date.split("T")[0],
        end_date: voucher.end_date.split("T")[0],
        usage_limit: voucher.usage_limit,
        seller_id: voucher.seller_id,
        status: voucher.status,
        is_created_by_admin: voucher.is_created_by_admin,
      });
    } else if (isCreateMode) {
      setFormData({
        code: "",
        title: "",
        discount_type: DiscountType.PERCENTAGE,
        discount_value: 0,
        min_order_value: 0,
        max_discount: 0,
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        usage_limit: 1,
        seller_id: undefined,
        status: DiscountStatus.ACTIVE,
        is_created_by_admin: !isSeller,
      });
    }
  }, [voucher, isCreateMode]);

  const handleInputChange = (field: keyof VoucherFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    } else if (formData.code.length < 3) {
      newErrors.code = "Code must be at least 3 characters";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (formData.discount_value <= 0) {
      newErrors.discount_value = "Discount value must be greater than 0";
    }

    if (
      formData.discount_type === DiscountType.PERCENTAGE &&
      formData.discount_value > 100
    ) {
      newErrors.discount_value = "Percentage discount cannot exceed 100%";
    }

    if (formData.min_order_value < 0) {
      newErrors.min_order_value = "Minimum order value cannot be negative";
    }

    if (formData.max_discount < 0) {
      newErrors.max_discount = "Maximum discount cannot be negative";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }

    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_date >= formData.end_date
    ) {
      newErrors.end_date = "End date must be after start date";
    }

    if (formData.usage_limit <= 0) {
      newErrors.usage_limit = "Usage limit must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const updatedVoucher: Voucher = {
        ...voucher,
        id: voucher?.id || Date.now(),
        ...formData,
        start_date: formData.start_date + "T00:00:00Z",
        end_date: formData.end_date + "T23:59:59Z",
        used_count: voucher?.used_count || 0,
      };

      await onSave(updatedVoucher);
      onClose();
    } catch (error) {
      console.error("Error saving voucher:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getRemainingUses = () => {
    if (!voucher) return formData.usage_limit;
    return voucher.usage_limit - voucher.used_count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isCreateMode ? "Create Voucher" : "Voucher Details"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Voucher Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  handleInputChange("code", e.target.value.toUpperCase())
                }
                placeholder="e.g., SAVE20"
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., 20% Off All Orders"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
          </div>

          {/* Discount Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="discount_type">Discount Type *</Label>
              <select
                id="discount_type"
                value={formData.discount_type}
                onChange={(e) =>
                  handleInputChange(
                    "discount_type",
                    e.target.value as DiscountType
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={DiscountType.PERCENTAGE}>Phần Trăm</option>
                <option value={DiscountType.FIXED_AMOUNT}>Giá Cố Định</option>
              </select>
            </div>

            <div>
              <Label htmlFor="discount_value">
                Discount Value * (
                {formData.discount_type === DiscountType.PERCENTAGE ? "%" : "$"}
                )
              </Label>
              <Input
                id="discount_value"
                type="number"
                value={formData.discount_value}
                onChange={(e) =>
                  handleInputChange("discount_value", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                max={
                  formData.discount_type === DiscountType.PERCENTAGE
                    ? "100"
                    : undefined
                }
                step={
                  formData.discount_type === DiscountType.PERCENTAGE
                    ? "1"
                    : "0.01"
                }
                className={errors.discount_value ? "border-red-500" : ""}
              />
              {errors.discount_value && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discount_value}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="max_discount">Max Discount ($)</Label>
              <Input
                id="max_discount"
                type="number"
                value={formData.max_discount}
                onChange={(e) =>
                  handleInputChange("max_discount", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                step="0.01"
                className={errors.max_discount ? "border-red-500" : ""}
                disabled={formData.discount_type === DiscountType.FIXED_AMOUNT}
              />
              {errors.max_discount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.max_discount}
                </p>
              )}
            </div>
          </div>

          {/* Order and Usage Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min_order_value">Minimum Order Value ($)</Label>
              <Input
                id="min_order_value"
                type="number"
                value={formData.min_order_value}
                onChange={(e) =>
                  handleInputChange("min_order_value", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                step="0.01"
                className={errors.min_order_value ? "border-red-500" : ""}
              />
              {errors.min_order_value && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.min_order_value}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="usage_limit">Usage Limit *</Label>
              <Input
                id="usage_limit"
                type="number"
                value={formData.usage_limit}
                onChange={(e) =>
                  handleInputChange("usage_limit", Number(e.target.value))
                }
                placeholder="1"
                min="1"
                className={errors.usage_limit ? "border-red-500" : ""}
              />
              {errors.usage_limit && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.usage_limit}
                </p>
              )}
            </div>
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  handleInputChange("start_date", e.target.value)
                }
                className={errors.start_date ? "border-red-500" : ""}
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
              )}
            </div>

            <div>
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
                className={errors.end_date ? "border-red-500" : ""}
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Status and Creator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  handleInputChange("status", e.target.value as DiscountStatus)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={DiscountStatus.ACTIVE}>Active</option>
                <option value={DiscountStatus.DISABLED}>Disabled</option>
                <option value={DiscountStatus.EXPIRED}>Expired</option>
              </select>
            </div>

            <div>
              <Label>Creator</Label>
              <div className="mt-2">
                <span className="text-sm text-gray-600">
                  {isSeller ? "Seller Created" : "Admin Created"}
                </span>
              </div>
            </div>
          </div>

          {/* Usage Statistics (for existing vouchers) */}
          {voucher && !isCreateMode && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Usage Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Used</div>
                  <div className="font-semibold text-lg">
                    {voucher.used_count}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Remaining</div>
                  <div className="font-semibold text-lg">
                    {getRemainingUses()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Usage Rate</div>
                  <div className="font-semibold text-lg">
                    {((voucher.used_count / voucher.usage_limit) * 100).toFixed(
                      1
                    )}
                    %
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (voucher.used_count / voucher.usage_limit) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              {voucher && !isCreateMode && onStatusChange && (
                <>
                  {voucher.status !== DiscountStatus.ACTIVE && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        onStatusChange(voucher.id, DiscountStatus.ACTIVE)
                      }
                      className="text-green-600 hover:text-green-700"
                    >
                      Activate
                    </Button>
                  )}
                  {voucher.status !== DiscountStatus.DISABLED && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        onStatusChange(voucher.id, DiscountStatus.DISABLED)
                      }
                      className="text-red-600 hover:text-red-700"
                    >
                      Disable
                    </Button>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : isCreateMode
                  ? "Create"
                  : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
