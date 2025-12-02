"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  VoucherTable,
  VoucherDetailModal,
  PromotionStatsComponent,
} from "@/components/admin/promotion";
import {
  Voucher,
  VoucherFilters,
  DiscountStatus,
  DiscountType,
  PromotionStats,
} from "@/types/promotion";

// Mock data - replace with real API calls
const mockStats: PromotionStats = {
  total_vouchers: 156,
  active_vouchers: 89,
  expired_vouchers: 34,
  disabled_vouchers: 33,
  admin_vouchers: 125,
  seller_vouchers: 31,
  total_banners: 12,
  active_banners: 8,
  inactive_banners: 4,
  total_voucher_usage: 2847,
  most_used_vouchers: [],
  recent_vouchers: [],
  recent_banners: [],
};

const mockVouchers: Voucher[] = [
  {
    id: 1,
    code: "WELCOME20",
    title: "20% Off First Order",
    discount_type: DiscountType.PERCENT,
    discount_value: 20,
    min_order_value: 25,
    max_discount: 50,
    start_date: "2024-12-01T00:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    usage_limit: 1000,
    used_count: 234,
    seller_id: undefined,
    status: DiscountStatus.ACTIVE,
    is_created_by_admin: true,
    store_name: undefined,
    remaining_uses: 766,
  },
  {
    id: 2,
    code: "SAVE10",
    title: "$10 Off Orders Above $50",
    discount_type: DiscountType.FIXED,
    discount_value: 10,
    min_order_value: 50,
    max_discount: 10,
    start_date: "2024-11-15T00:00:00Z",
    end_date: "2024-12-15T23:59:59Z",
    usage_limit: 500,
    used_count: 156,
    seller_id: 1,
    status: DiscountStatus.ACTIVE,
    is_created_by_admin: false,
    store_name: "Pizza Palace",
    remaining_uses: 344,
  },
  {
    id: 3,
    code: "BLACKFRIDAY",
    title: "Black Friday 50% Off",
    discount_type: DiscountType.PERCENT,
    discount_value: 50,
    min_order_value: 30,
    max_discount: 100,
    start_date: "2024-11-29T00:00:00Z",
    end_date: "2024-11-29T23:59:59Z",
    usage_limit: 200,
    used_count: 200,
    seller_id: undefined,
    status: DiscountStatus.EXPIRED,
    is_created_by_admin: true,
    store_name: undefined,
    remaining_uses: 0,
  },
  {
    id: 4,
    code: "STUDENT15",
    title: "15% Student Discount",
    discount_type: DiscountType.PERCENT,
    discount_value: 15,
    min_order_value: 20,
    max_discount: 25,
    start_date: "2024-09-01T00:00:00Z",
    end_date: "2025-06-30T23:59:59Z",
    usage_limit: 10000,
    used_count: 1456,
    seller_id: undefined,
    status: DiscountStatus.DISABLED,
    is_created_by_admin: true,
    store_name: undefined,
    remaining_uses: 8544,
  },
];

// Update stats with most used vouchers
mockStats.most_used_vouchers = mockVouchers
  .sort((a, b) => b.used_count - a.used_count)
  .slice(0, 5);

mockStats.recent_vouchers = mockVouchers
  .sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  )
  .slice(0, 3);

export default function VouchersPage() {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [stats, setStats] = useState<PromotionStats>(mockStats);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [voucherFilters, setVoucherFilters] = useState<VoucherFilters>({});

  // Handle voucher actions
  const handleVoucherClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowVoucherModal(true);
  };

  const handleStatusChange = async (
    voucherId: number,
    status: DiscountStatus
  ) => {
    setVouchers((prevVouchers) =>
      prevVouchers.map((voucher) => {
        if (voucher.id === voucherId) {
          return {
            ...voucher,
            status: status,
          };
        }
        return voucher;
      })
    );

    // Update stats based on status change
    setStats((prevStats) => {
      const voucher = vouchers.find((v) => v.id === voucherId);
      if (!voucher) return prevStats;

      let newStats = { ...prevStats };

      // Decrease old status count
      if (voucher.status === DiscountStatus.ACTIVE) {
        newStats.active_vouchers--;
      } else if (voucher.status === DiscountStatus.EXPIRED) {
        newStats.expired_vouchers--;
      } else if (voucher.status === DiscountStatus.DISABLED) {
        newStats.disabled_vouchers--;
      }

      // Increase new status count
      if (status === DiscountStatus.ACTIVE) {
        newStats.active_vouchers++;
      } else if (status === DiscountStatus.EXPIRED) {
        newStats.expired_vouchers++;
      } else if (status === DiscountStatus.DISABLED) {
        newStats.disabled_vouchers++;
      }

      return newStats;
    });

    // TODO: Call API to update voucher status
    console.log(`Voucher ${voucherId} status changed to ${status}`);
  };

  const handleVoucherSave = async (updatedVoucher: Voucher) => {
    setVouchers((prevVouchers) => {
      const existingIndex = prevVouchers.findIndex(
        (v) => v.id === updatedVoucher.id
      );
      if (existingIndex >= 0) {
        // Update existing voucher
        const newVouchers = [...prevVouchers];
        newVouchers[existingIndex] = updatedVoucher;
        return newVouchers;
      } else {
        // Add new voucher
        return [...prevVouchers, updatedVoucher];
      }
    });

    // Update stats for new voucher
    if (!vouchers.find((v) => v.id === updatedVoucher.id)) {
      setStats((prevStats) => ({
        ...prevStats,
        total_vouchers: prevStats.total_vouchers + 1,
        active_vouchers:
          updatedVoucher.status === DiscountStatus.ACTIVE
            ? prevStats.active_vouchers + 1
            : prevStats.active_vouchers,
        admin_vouchers: updatedVoucher.is_created_by_admin
          ? prevStats.admin_vouchers + 1
          : prevStats.admin_vouchers,
        seller_vouchers: !updatedVoucher.is_created_by_admin
          ? prevStats.seller_vouchers + 1
          : prevStats.seller_vouchers,
      }));
    }

    // TODO: Call API to save voucher changes
    console.log("Voucher updated:", updatedVoucher);
  };

  // Filter functions
  const filteredVouchers = vouchers.filter((voucher) => {
    if (voucherFilters.status && voucher.status !== voucherFilters.status) {
      return false;
    }
    if (
      voucherFilters.discount_type &&
      voucher.discount_type !== voucherFilters.discount_type
    ) {
      return false;
    }
    if (
      voucherFilters.is_created_by_admin !== undefined &&
      voucher.is_created_by_admin !== voucherFilters.is_created_by_admin
    ) {
      return false;
    }
    if (
      voucherFilters.seller_id &&
      voucher.seller_id !== voucherFilters.seller_id
    ) {
      return false;
    }
    if (voucherFilters.search) {
      const searchLower = voucherFilters.search.toLowerCase();
      return (
        voucher.code.toLowerCase().includes(searchLower) ||
        voucher.title.toLowerCase().includes(searchLower) ||
        voucher.store_name?.toLowerCase().includes(searchLower)
      );
    }
    if (voucherFilters.date_range) {
      const voucherStart = new Date(voucher.start_date);
      const voucherEnd = new Date(voucher.end_date);
      const filterStart = new Date(voucherFilters.date_range.start);
      const filterEnd = new Date(voucherFilters.date_range.end);

      return voucherStart >= filterStart && voucherEnd <= filterEnd;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Voucher Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage discount vouchers
          </p>
        </div>
        <Link href="/admin/promotions/vouchers/create">
          <Button>Create New Voucher</Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <PromotionStatsComponent stats={stats} loading={loading} />

      {/* Vouchers Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            All Vouchers ({filteredVouchers.length})
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button variant="outline" size="sm">
              Import
            </Button>
          </div>
        </div>

        <VoucherTable
          vouchers={filteredVouchers}
          loading={loading}
          onVoucherClick={handleVoucherClick}
          onStatusChange={handleStatusChange}
          onFilterChange={setVoucherFilters}
        />
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.active_vouchers}</div>
          <div className="text-blue-100">Active Vouchers</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.total_voucher_usage}</div>
          <div className="text-green-100">Total Usage</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.admin_vouchers}</div>
          <div className="text-purple-100">Admin Created</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.seller_vouchers}</div>
          <div className="text-orange-100">Seller Created</div>
        </div>
      </div>

      {/* Voucher Detail Modal */}
      <VoucherDetailModal
        voucher={selectedVoucher}
        isOpen={showVoucherModal}
        onClose={() => {
          setShowVoucherModal(false);
          setSelectedVoucher(null);
        }}
        onSave={handleVoucherSave}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
