"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  VoucherTable,
  VoucherDetailModal,
  VoucherStatsCards,
} from "@/components/admin/promotion";
import {
  Voucher,
  VoucherFilters,
  DiscountStatus,
  DiscountType,
  PromotionStats,
} from "@/types/promotion";
import { voucherService } from "@/lib/services/voucherService";
import { toast } from "sonner";

type TabType = "admin" | "store";

export default function VouchersPage() {
  const [activeTab, setActiveTab] = useState<TabType>("admin");
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [adminVouchers, setAdminVouchers] = useState<Voucher[]>([]);
  const [storeVouchers, setStoreVouchers] = useState<Voucher[]>([]);
  const [stats, setStats] = useState<PromotionStats>({
    total_vouchers: 0,
    active_vouchers: 0,
    expired_vouchers: 0,
    disabled_vouchers: 0,
    admin_vouchers: 0,
    seller_vouchers: 0,
    total_banners: 0,
    active_banners: 0,
    inactive_banners: 0,
    total_voucher_usage: 0,
    most_used_vouchers: [],
    recent_vouchers: [],
    recent_banners: [],
  });
  const [loading, setLoading] = useState(false);

  // Filter states
  const [voucherFilters, setVoucherFilters] = useState<VoucherFilters>({});

  // Fetch data on mount
  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const [adminData, storeData] = await Promise.all([
        voucherService.getAdminVouchers(),
        voucherService.getStoreVouchers(),
      ]);

      setAdminVouchers(adminData);
      setStoreVouchers(storeData);

      // Calculate stats from all vouchers
      const allVouchers = [...adminData, ...storeData];
      const calculatedStats = voucherService.calculateStats(allVouchers);
      setStats((prev) => ({
        ...prev,
        ...calculatedStats,
        most_used_vouchers: allVouchers
          .sort((a, b) => b.used_count - a.used_count)
          .slice(0, 5),
        recent_vouchers: allVouchers
          .sort(
            (a, b) =>
              new Date(b.start_date).getTime() -
              new Date(a.start_date).getTime()
          )
          .slice(0, 3),
      }));

      toast.success("Đã tải danh sách voucher");
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      toast.error("Không thể tải danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  // Handle voucher actions
  const handleVoucherClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowVoucherModal(true);
  };

  const handleStatusChange = async (
    voucherId: number,
    status: DiscountStatus
  ) => {
    try {
      // TODO: Call API to update voucher status
      await voucherService.updateVoucher(voucherId, { status });
      toast.success("Cập nhật trạng thái voucher thành công");

      // Refresh vouchers after status change
      fetchVouchers();
    } catch (error) {
      console.error("Error updating voucher status:", error);
      toast.error("Không thể cập nhật trạng thái voucher");
    }
  };

  const handleVoucherSave = async (updatedVoucher: Voucher) => {
    try {
      // TODO: Call API to save voucher changes
      // if (updatedVoucher.id) {
      if (updatedVoucher.id && updatedVoucher.id > 0) {
        await voucherService.updateVoucher(updatedVoucher.id, updatedVoucher);
        toast.success("Cập nhật voucher thành công");
      } else {
        await voucherService.createVoucher(updatedVoucher);
        toast.success("Tạo voucher thành công");
      }

      // Refresh vouchers after save
      fetchVouchers();
    } catch (error) {
      console.error("Error saving voucher:", error);
      toast.error("Không thể lưu voucher");
    }
  };

  const handleVoucherDelete = async (voucherId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      return;
    }

    try {
      await voucherService.softDeleteVoucher(voucherId);

      // Remove from local state immediately
      setAdminVouchers((prev) => prev.filter((v) => v.id !== voucherId));
      setStoreVouchers((prev) => prev.filter((v) => v.id !== voucherId));

      // Recalculate stats
      const updatedAdminVouchers = adminVouchers.filter(
        (v) => v.id !== voucherId
      );
      const updatedStoreVouchers = storeVouchers.filter(
        (v) => v.id !== voucherId
      );
      const allVouchers = [...updatedAdminVouchers, ...updatedStoreVouchers];
      const calculatedStats = voucherService.calculateStats(allVouchers);
      setStats((prev) => ({
        ...prev,
        ...calculatedStats,
        most_used_vouchers: allVouchers
          .sort((a, b) => b.used_count - a.used_count)
          .slice(0, 5),
        recent_vouchers: allVouchers
          .sort(
            (a, b) =>
              new Date(b.start_date).getTime() -
              new Date(a.start_date).getTime()
          )
          .slice(0, 3),
      }));

      toast.success("Xóa voucher thành công");
    } catch (error) {
      console.error("Error deleting voucher:", error);
      toast.error("Không thể xóa voucher");
    }
  };

  // Get current vouchers based on active tab
  const currentVouchers = activeTab === "admin" ? adminVouchers : storeVouchers;

  // Filter functions
  const filteredVouchers = currentVouchers.filter((voucher) => {
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
      voucherFilters.store_id &&
      voucher.store_id !== voucherFilters.store_id
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
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Voucher</h1>
          <p className="text-gray-600 mt-1">Tạo và quản lý voucher giảm giá</p>
        </div>
        <Link href="/admin/promotions/vouchers/create">
          <Button>Tạo Voucher Mới</Button>
        </Link>
      </div>
      {/* Quick Stats Cards */}
      <VoucherStatsCards stats={stats} />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("admin")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "admin"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Voucher Admin ({adminVouchers.length})
          </button>
          <button
            onClick={() => setActiveTab("store")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "store"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Voucher Cửa Hàng ({storeVouchers.length})
          </button>
        </nav>
      </div>

      {/* Vouchers Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {activeTab === "admin" ? "Voucher Admin" : "Voucher Cửa Hàng"} (
            {filteredVouchers.length})
          </h2>
        </div>

        <VoucherTable
          vouchers={filteredVouchers}
          loading={loading}
          onVoucherClick={handleVoucherClick}
          onStatusChange={handleStatusChange}
          onFilterChange={setVoucherFilters}
          onDelete={handleVoucherDelete}
        />
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
