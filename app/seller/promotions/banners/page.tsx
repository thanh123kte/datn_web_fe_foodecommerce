"use client";

import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { BannerList } from "../components/BannerList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Banner, BannerStatus, promotionsAPI } from "@/lib/mockData/promotions";
import { Plus, Search, Filter, Download, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BannerStatus | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load banners
  const loadBanners = useCallback(async () => {
    setLoading(true);
    try {
      const result = await promotionsAPI.getBanners(currentPage, 10);
      setBanners(result.banners);
      setTotalPages(Math.ceil(result.total / 10));
    } catch (error) {
      console.error("Failed to load banners:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  // Filter banners based on search and status
  const filteredBanners = banners.filter((banner) => {
    const matchesSearch =
      banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || banner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle actions
  const handleRefresh = useCallback(() => {
    loadBanners();
  }, [loadBanners]);

  const handleViewBanner = useCallback((banner: Banner) => {
    console.log("View banner:", banner);
    // Navigate to banner details or open modal
  }, []);

  const handleEditBanner = useCallback(async (banner: Banner) => {
    console.log("Edit banner:", banner);
    // Open edit modal or navigate to edit page
  }, []);

  const handleDeleteBanner = useCallback(
    async (bannerId: string) => {
      if (confirm("Are you sure you want to delete this banner?")) {
        try {
          await promotionsAPI.deleteBanner(bannerId);
          loadBanners(); // Refresh the list
        } catch (error) {
          console.error("Failed to delete banner:", error);
        }
      }
    },
    [loadBanners]
  );

  const handleToggleStatus = useCallback(
    async (bannerId: string, currentStatus: BannerStatus) => {
      try {
        const newStatus =
          currentStatus === BannerStatus.ACTIVE
            ? BannerStatus.INACTIVE
            : BannerStatus.ACTIVE;
        await promotionsAPI.updateBanner(bannerId, { status: newStatus });
        loadBanners(); // Refresh the list
      } catch (error) {
        console.error("Failed to toggle banner status:", error);
      }
    },
    [loadBanners]
  );

  return (
    <MainLayout userRole="seller">
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Banner Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage promotional banners to showcase your offerings
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
            <Link href="/seller/promotions/banners/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Banner
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
                placeholder="Search banners by title or description..."
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
                  setStatusFilter(e.target.value as BannerStatus | "ALL")
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value={BannerStatus.ACTIVE}>Active</option>
                <option value={BannerStatus.INACTIVE}>Inactive</option>
                <option value={BannerStatus.SCHEDULED}>Scheduled</option>
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

        {/* Banners List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              All Banners ({filteredBanners.length})
            </h2>
          </div>

          <BannerList
            banners={filteredBanners}
            loading={loading}
            onViewDetails={handleViewBanner}
            onEdit={handleEditBanner}
            onDelete={handleDeleteBanner}
            onToggleStatus={handleToggleStatus}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredBanners.length} of {banners.length} banners
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
