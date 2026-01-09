"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VoucherTable, VoucherDetailModal } from "@/components/admin/promotion";
import { Voucher, VoucherFilters, DiscountStatus } from "@/types/promotion";
import MainLayout from "@/components/layout/MainLayout";
import { voucherService } from "@/lib/services/voucherService";
import { toast } from "sonner";

export default function SellerVouchersPage() {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState<number | null>(null);

  // Filter states
  const [voucherFilters, setVoucherFilters] = useState<VoucherFilters>({});

  // Calculate stats from vouchers
  const stats = voucherService.calculateStats(vouchers);

  // Fetch store_id from localStorage and load vouchers
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storeId = localStorage.getItem("store_id");
        if (!storeId) {
          toast.error("Không tìm thấy thông tin cửa hàng");
          return;
        }

        const storeIdNum = parseInt(storeId);
        setStoreId(storeIdNum);

        // Fetch vouchers for this store
        setLoading(true);
        const vouchersData = await voucherService.getVouchersByStore(
          storeIdNum
        );
        setVouchers(vouchersData);
      } catch (error) {
        console.error("Error loading vouchers:", error);
        toast.error("Không thể tải danh sách voucher");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

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
      const voucher = vouchers.find((v) => v.id === voucherId);
      if (!voucher) return;

      await voucherService.updateVoucher(voucherId, { ...voucher, status });

      // Update local state
      setVouchers((prev) =>
        prev.map((v) => (v.id === voucherId ? { ...v, status } : v))
      );

      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleVoucherSave = async (updatedVoucher: Voucher) => {
    try {
      if (updatedVoucher.id) {
        // Update existing voucher
        await voucherService.updateVoucher(updatedVoucher.id, updatedVoucher);

        // Update local state
        setVouchers((prev) =>
          prev.map((v) => (v.id === updatedVoucher.id ? updatedVoucher : v))
        );

        toast.success("Cập nhật voucher thành công");
      }

      setShowVoucherModal(false);
      setSelectedVoucher(null);
    } catch (error) {
      console.error("Error saving voucher:", error);
      toast.error("Không thể lưu voucher");
    }
  };

  const handleDeleteVoucher = async (voucherId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      return;
    }

    try {
      await voucherService.softDeleteVoucher(voucherId);

      // Remove from local state
      setVouchers((prev) => prev.filter((v) => v.id !== voucherId));

      toast.success("Xóa voucher thành công");
    } catch (error) {
      console.error("Error deleting voucher:", error);
      toast.error("Không thể xóa voucher");
    }
  };

  // Filter vouchers
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
    if (voucherFilters.search) {
      const searchLower = voucherFilters.search.toLowerCase();
      return (
        voucher.code.toLowerCase().includes(searchLower) ||
        voucher.title.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <MainLayout userRole="seller" title="Quản Lý Voucher">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Voucher</h1>
          <p className="text-gray-600 mt-1">
            Tạo và quản lý voucher giảm giá của cửa hàng
          </p>
        </div>
        <Link href="/seller/vouchers/create">
          <Button>Tạo Voucher Mới</Button>
        </Link>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng Voucher</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total_vouchers}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Voucher Hoạt Động
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active_vouchers}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tổng Lượt Dùng
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.total_voucher_usage}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Voucher Hết Hạn
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.expired_vouchers}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Vouchers Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Danh Sách Voucher ({filteredVouchers.length})
          </h2>
        </div>

        <VoucherTable
          vouchers={filteredVouchers}
          loading={loading}
          onVoucherClick={handleVoucherClick}
          onStatusChange={handleStatusChange}
          onFilterChange={setVoucherFilters}
          onDelete={handleDeleteVoucher}
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
        isSeller={true}
      />
    </MainLayout>
  );
}
