"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Voucher,
  DiscountStatus,
  DiscountType,
  formatDiscountValue,
  getVoucherStatusColor,
  isVoucherExpiringSoon,
  getUsagePercentage,
  formatCurrency,
} from "@/lib/mockData/promotions";
import {
  Ticket,
  Calendar,
  Users,
  Edit,
  Trash2,
  Copy,
  Clock,
  AlertTriangle,
  CheckCircle,
  Percent,
  DollarSign,
  Target,
  Eye,
} from "lucide-react";

interface VoucherListProps {
  vouchers: Voucher[];
  loading?: boolean;
  onEdit?: (voucher: Voucher) => void;
  onDelete?: (voucher: Voucher) => void;
  onDuplicate?: (voucher: Voucher) => void;
  onViewDetails?: (voucher: Voucher) => void;
}

interface VoucherItemProps {
  voucher: Voucher;
  onEdit?: (voucher: Voucher) => void;
  onDelete?: (voucher: Voucher) => void;
  onDuplicate?: (voucher: Voucher) => void;
  onViewDetails?: (voucher: Voucher) => void;
}

const VoucherItem: React.FC<VoucherItemProps> = ({
  voucher,
  onEdit,
  onDelete,
  onDuplicate,
  onViewDetails,
}) => {
  const isExpiringSoon = isVoucherExpiringSoon(voucher);
  const usagePercentage = getUsagePercentage(
    voucher.used_count,
    voucher.usage_limit
  );
  const isFullyUsed = voucher.used_count >= voucher.usage_limit;

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
    });
    const end = new Date(endDate).toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${start} - ${end}`;
  };

  const getStatusIcon = (status: DiscountStatus) => {
    switch (status) {
      case DiscountStatus.ACTIVE:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case DiscountStatus.EXPIRED:
        return <Clock className="h-4 w-4 text-gray-600" />;
      case DiscountStatus.DISABLED:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
            {voucher.discount_type === DiscountType.PERCENT ? (
              <Percent className="h-6 w-6" />
            ) : (
              <DollarSign className="h-6 w-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-lg font-semibold text-gray-900">
                {voucher.title}
              </h4>
              {voucher.is_created_by_admin && (
                <Badge
                  variant="outline"
                  className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                >
                  Admin Created
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Ticket className="h-4 w-4" />
                <span className="font-mono font-bold text-blue-600">
                  {voucher.code}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDateRange(voucher.start_date, voucher.end_date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isExpiringSoon && voucher.status === DiscountStatus.ACTIVE && (
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-200 text-xs"
            >
              <Clock className="h-3 w-3 mr-1" />
              Expiring Soon
            </Badge>
          )}
          {isFullyUsed && voucher.status === DiscountStatus.ACTIVE && (
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 border-red-200 text-xs"
            >
              <Target className="h-3 w-3 mr-1" />
              Limit Reached
            </Badge>
          )}
          <Badge className={getVoucherStatusColor(voucher.status)}>
            {getStatusIcon(voucher.status)}
            <span className="ml-1">{voucher.status}</span>
          </Badge>
        </div>
      </div>

      {/* Discount Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600 mb-1">Discount Value</p>
          <p className="text-lg font-bold text-blue-600">
            {formatDiscountValue(voucher)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Min. Order</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(voucher.min_order_value)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Max. Discount</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(voucher.max_discount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Usage</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {voucher.used_count}/{voucher.usage_limit}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[40px]">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  usagePercentage >= 90
                    ? "bg-red-500"
                    : usagePercentage >= 70
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="h-4 w-4" />
            <span>Usage Rate: {usagePercentage.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Target className="h-4 w-4" />
            <span>{voucher.usage_limit - voucher.used_count} remaining</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Created {new Date(voucher.created_at).toLocaleDateString("vi-VN")}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(voucher)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
          {onDuplicate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicate(voucher)}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
          )}
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(voucher)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Eye className="h-4 w-4" />
              Details
            </Button>
          )}
        </div>

        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(voucher)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
};

export const VoucherList: React.FC<VoucherListProps> = ({
  vouchers,
  loading = false,
  onEdit,
  onDelete,
  onDuplicate,
  onViewDetails,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="w-64 h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="w-48 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                    <div className="w-20 h-5 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4">
                <div className="flex gap-2">
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                  <div className="w-20 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Vouchers Found
        </h3>
        <p className="text-gray-600 mb-4">
          You haven&apos;t created any vouchers yet. Start by creating your
          first promotional voucher.
        </p>
        <Button>
          <Ticket className="h-4 w-4 mr-2" />
          Create Your First Voucher
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {vouchers.map((voucher) => (
        <VoucherItem
          key={voucher.id}
          voucher={voucher}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
