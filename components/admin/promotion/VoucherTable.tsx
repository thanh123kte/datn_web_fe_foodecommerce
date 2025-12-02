"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Voucher,
  VoucherFilters,
  DiscountType,
  DiscountStatus,
} from "@/types/promotion";

interface VoucherTableProps {
  vouchers: Voucher[];
  loading?: boolean;
  onVoucherClick?: (voucher: Voucher) => void;
  onStatusChange?: (voucherId: number, status: DiscountStatus) => void;
  onFilterChange?: (filters: VoucherFilters) => void;
  showFilters?: boolean;
}

export function VoucherTable({
  vouchers,
  loading = false,
  onVoucherClick,
  onStatusChange,
  onFilterChange,
  showFilters = true,
}: VoucherTableProps) {
  const [filters, setFilters] = useState<VoucherFilters>({});
  const [sortField, setSortField] = useState<keyof Voucher>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleFilterChange = (newFilters: Partial<VoucherFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleSort = (field: keyof Voucher) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  const getStatusBadgeClass = (status: DiscountStatus) => {
    switch (status) {
      case DiscountStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case DiscountStatus.EXPIRED:
        return "bg-gray-100 text-gray-800";
      case DiscountStatus.DISABLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDiscountDisplay = (voucher: Voucher) => {
    if (voucher.discount_type === DiscountType.PERCENT) {
      return `${voucher.discount_value}%`;
    }
    return `$${voucher.discount_value.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getRemainingUses = (voucher: Voucher) => {
    return voucher.usage_limit - voucher.used_count;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search vouchers by code, title..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  handleFilterChange({
                    status: (e.target.value as DiscountStatus) || undefined,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value={DiscountStatus.ACTIVE}>Active</option>
                <option value={DiscountStatus.EXPIRED}>Expired</option>
                <option value={DiscountStatus.DISABLED}>Disabled</option>
              </select>
              <select
                value={filters.discount_type || ""}
                onChange={(e) =>
                  handleFilterChange({
                    discount_type:
                      (e.target.value as DiscountType) || undefined,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value={DiscountType.PERCENT}>Percentage</option>
                <option value={DiscountType.FIXED}>Fixed Amount</option>
              </select>
              <select
                value={
                  filters.is_created_by_admin === undefined
                    ? ""
                    : filters.is_created_by_admin.toString()
                }
                onChange={(e) =>
                  handleFilterChange({
                    is_created_by_admin:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Creators</option>
                <option value="true">Admin Created</option>
                <option value="false">Seller Created</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700">
                <button
                  onClick={() => handleSort("code")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Code
                  {sortField === "code" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Voucher Details
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Discount
              </th>
              <th className="text-left p-4 font-medium text-gray-700">Usage</th>
              <th className="text-left p-4 font-medium text-gray-700">
                Validity
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Status
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr
                key={voucher.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onVoucherClick?.(voucher)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {voucher.code}
                      </div>
                      {voucher.is_created_by_admin && (
                        <div className="text-xs text-blue-600 font-medium">
                          Admin Created
                        </div>
                      )}
                      {voucher.store_name && (
                        <div className="text-xs text-gray-500">
                          {voucher.store_name}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {voucher.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      Min order: ${voucher.min_order_value.toLocaleString()}
                    </div>
                    {voucher.max_discount > 0 && (
                      <div className="text-sm text-gray-600">
                        Max discount: ${voucher.max_discount.toLocaleString()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-lg text-blue-600">
                    {getDiscountDisplay(voucher)}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {voucher.discount_type.toLowerCase()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <div className="font-medium">
                      {voucher.used_count} / {voucher.usage_limit}
                    </div>
                    <div className="text-gray-600">
                      {getRemainingUses(voucher)} remaining
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
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
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <div className="font-medium">
                      {formatDate(voucher.start_date)}
                    </div>
                    <div className="text-gray-600">to</div>
                    <div
                      className={`font-medium ${
                        isExpired(voucher.end_date) ? "text-red-600" : ""
                      }`}
                    >
                      {formatDate(voucher.end_date)}
                    </div>
                    {isExpired(voucher.end_date) && (
                      <div className="text-xs text-red-600 font-medium">
                        Expired
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      voucher.status
                    )}`}
                  >
                    {voucher.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {onStatusChange && (
                      <>
                        {voucher.status !== DiscountStatus.ACTIVE && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(voucher.id, DiscountStatus.ACTIVE);
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            Activate
                          </Button>
                        )}
                        {voucher.status !== DiscountStatus.DISABLED && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(
                                voucher.id,
                                DiscountStatus.DISABLED
                              );
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            Disable
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vouchers.length === 0 && (
        <div className="text-center py-8 text-gray-500">No vouchers found</div>
      )}
    </Card>
  );
}
