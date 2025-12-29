"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { BannerTable, BannerDetailModal } from "@/components/admin/promotion";
import {
  Banner,
  BannerFilters,
  BannerStatus,
  BannerStats,
} from "@/types/promotion";
import { bannerService } from "@/lib/services/bannerService";
import { toast } from "sonner";

export default function BannersPage() {
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [stats, setStats] = useState<BannerStats>({
    totalBanners: 0,
    activeBanners: 0,
    inactiveBanners: 0,
    expiredBanners: 0,
  });
  const [loading, setLoading] = useState(false);
  const [bannerFilters, setBannerFilters] = useState<BannerFilters>({});

  // Fetch banners từ API
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await bannerService.getAllBanners();
      setBanners(data);

      // Calculate stats
      const calculatedStats = bannerService.calculateStats(data);
      setStats(calculatedStats);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Không thể tải danh sách banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle banner actions
  const handleBannerClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsCreateMode(false);
    setShowBannerModal(true);
  };

  const handleCreateNew = () => {
    setSelectedBanner(null);
    setIsCreateMode(true);
    setShowBannerModal(true);
  };

  const handleStatusChange = async (bannerId: number, status: BannerStatus) => {
    try {
      await bannerService.updateBanner(bannerId, { status });
      toast.success("Cập nhật trạng thái banner thành công");
      fetchBanners(); // Refresh data
    } catch (error) {
      console.error("Error updating banner status:", error);
      toast.error("Không thể cập nhật trạng thái banner");
    }
  };

  const handleBannerSave = async (banner: Banner, file?: File) => {
    try {
      if (isCreateMode) {
        // Create banner first
        const created = await bannerService.createBanner({
          title: banner.title,
          imageUrl: banner.imageUrl,
          description: banner.description,
          status: banner.status,
          startDate: banner.startDate,
          endDate: banner.endDate,
        });

        // Then upload image if file selected
        if (file && created.id) {
          await bannerService.uploadImage(created.id, file);
        }

        toast.success("Tạo banner thành công");
      } else {
        // Update banner
        await bannerService.updateBanner(banner.id, {
          title: banner.title,
          imageUrl: banner.imageUrl,
          description: banner.description,
          status: banner.status,
          startDate: banner.startDate,
          endDate: banner.endDate,
        });

        // Upload new image if file selected
        if (file && banner.id) {
          await bannerService.uploadImage(banner.id, file);
        }

        toast.success("Cập nhật banner thành công");
      }
      fetchBanners(); // Refresh data
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Không thể lưu banner");
    }
  };

  const handleBannerDelete = async (bannerId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa banner này?")) {
      return;
    }

    try {
      await bannerService.softDeleteBanner(bannerId);

      // Remove from local state immediately
      setBanners((prevBanners) =>
        prevBanners.filter((banner) => banner.id !== bannerId)
      );

      // Recalculate stats
      const updatedBanners = banners.filter((b) => b.id !== bannerId);
      const calculatedStats = bannerService.calculateStats(updatedBanners);
      setStats(calculatedStats);

      toast.success("Xóa banner thành công");
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Không thể xóa banner");
    }
  };

  // Filter banners
  const filteredBanners = banners.filter((banner) => {
    if (bannerFilters.status && banner.status !== bannerFilters.status) {
      return false;
    }
    if (bannerFilters.search) {
      const searchLower = bannerFilters.search.toLowerCase();
      return (
        banner.title.toLowerCase().includes(searchLower) ||
        banner.description.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Banner</h1>
          <p className="text-gray-600 mt-1">
            Quản lý banner quảng cáo và khuyến mãi
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBanners} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo Banner Mới
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Tổng Banner</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {stats.totalBanners}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Banner Hoạt Động</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {stats.activeBanners}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Banner Tạm Dừng</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">
            {stats.inactiveBanners}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Banner Hết Hạn</div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {stats.expiredBanners}
          </div>
        </div>
      </div>

      {/* Banners Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Tất cả Banner ({filteredBanners.length})
          </h2>
        </div>

        <BannerTable
          banners={filteredBanners}
          loading={loading}
          onBannerClick={handleBannerClick}
          onStatusChange={handleStatusChange}
          onFilterChange={setBannerFilters}
          onDelete={handleBannerDelete}
        />
      </div>

      {/* Banner Detail Modal */}
      <BannerDetailModal
        banner={selectedBanner}
        isOpen={showBannerModal}
        onClose={() => {
          setShowBannerModal(false);
          setSelectedBanner(null);
          setIsCreateMode(false);
        }}
        onSave={handleBannerSave}
        onStatusChange={handleStatusChange}
        isCreateMode={isCreateMode}
      />
    </div>
  );
}
