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

        const sellerId = parseInt(storeId);
        setStoreId(sellerId);

        // Fetch vouchers for this seller
        setLoading(true);
        const vouchersData = await voucherService.getVouchersBySeller(sellerId);
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
    onDelete = { handleDeleteVoucher };

    try {
      await voucherService.deleteVoucher(voucherId);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.total_vouchers}</div>
          <div className="text-blue-100">Tổng Voucher</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.active_vouchers}</div>
          <div className="text-green-100">Voucher Hoạt Động</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.total_voucher_usage}</div>
          <div className="text-purple-100">Tổng Lượt Dùng</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.expired_vouchers}</div>
          <div className="text-orange-100">Voucher Hết Hạn</div>
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
