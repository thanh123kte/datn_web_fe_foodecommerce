"use client";

import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { VoucherList } from "../components/VoucherList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Voucher,
  DiscountStatus,
  promotionsAPI,
} from "@/lib/mockData/promotions";
import { Plus, Search, Filter, Download, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DiscountStatus | "ALL">(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load vouchers
  const loadVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await promotionsAPI.getVouchers(currentPage, 10);
      setVouchers(result.vouchers);
      setTotalPages(Math.ceil(result.total / 10));
    } catch (error) {
      console.error("Failed to load vouchers:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  // Filter vouchers based on search and status
  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch =
      voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || voucher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle actions
  const handleRefresh = useCallback(() => {
    loadVouchers();
  }, [loadVouchers]);

  const handleViewVoucher = useCallback((voucher: Voucher) => {
    console.log("View voucher:", voucher);
    // Navigate to voucher details or open modal
  }, []);

  const handleEditVoucher = useCallback(async (voucher: Voucher) => {
    console.log("Edit voucher:", voucher);
    // Open edit modal or navigate to edit page
  }, []);

  const handleDeleteVoucher = useCallback(
    async (voucherId: string) => {
      if (confirm("Are you sure you want to delete this voucher?")) {
        try {
          await promotionsAPI.deleteVoucher(voucherId);
          loadVouchers(); // Refresh the list
        } catch (error) {
          console.error("Failed to delete voucher:", error);
        }
      }
    },
    [loadVouchers]
  );

  return (
    <MainLayout userRole="seller">
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Voucher Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage discount vouchers for your customers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Link href="/seller/promotions/vouchers/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Voucher
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vouchers by code or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as DiscountStatus | "ALL")
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value={DiscountStatus.ACTIVE}>Active</option>
                <option value={DiscountStatus.EXPIRED}>Expired</option>
                <option value={DiscountStatus.INACTIVE}>Inactive</option>
              </select>
            </div>

            {/* Export */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </Card>

        {/* Vouchers List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              All Vouchers ({filteredVouchers.length})
            </h2>
          </div>

          <VoucherList
            vouchers={filteredVouchers}
            loading={loading}
            onViewDetails={handleViewVoucher}
            onEdit={handleEditVoucher}
            onDelete={handleDeleteVoucher}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredVouchers.length} of {vouchers.length} vouchers
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
