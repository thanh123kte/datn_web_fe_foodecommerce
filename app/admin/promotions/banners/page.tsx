"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BannerTable,
  BannerDetailModal,
  PromotionStatsComponent,
} from "@/components/admin/promotion";
import {
  Banner,
  BannerFilters,
  BannerStatus,
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

const mockBanners: Banner[] = [
  {
    id: 1,
    title: "Summer Food Festival 2024",
    image_url:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&h=400&fit=crop",
    description:
      "Join our amazing summer food festival with discounts up to 50% on all orders. Fresh ingredients, amazing flavors, and unbeatable prices!",
    status: BannerStatus.ACTIVE,
    created_at: "2024-11-15T08:30:00Z",
    updated_at: "2024-11-28T14:45:00Z",
  },
  {
    id: 2,
    title: "Free Delivery Weekend",
    image_url:
      "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=1200&h=400&fit=crop",
    description:
      "Enjoy free delivery on all orders this weekend! No minimum order required. Fast and reliable delivery to your doorstep.",
    status: BannerStatus.ACTIVE,
    created_at: "2024-11-20T10:15:00Z",
    updated_at: "2024-11-25T16:20:00Z",
  },
  {
    id: 3,
    title: "New Restaurant Partners",
    image_url:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=400&fit=crop",
    description:
      "Discover our new restaurant partners offering authentic cuisines from around the world. Explore new flavors today!",
    status: BannerStatus.INACTIVE,
    created_at: "2024-11-10T14:22:00Z",
    updated_at: "2024-11-22T09:30:00Z",
  },
  {
    id: 4,
    title: "Black Friday Mega Sale",
    image_url:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&h=400&fit=crop",
    description:
      "Black Friday is here! Get up to 70% off on your favorite meals. Limited time offer, don't miss out!",
    status: BannerStatus.EXPIRED,
    created_at: "2024-11-25T00:00:00Z",
    updated_at: "2024-11-30T00:00:00Z",
  },
  {
    id: 5,
    title: "Healthy Options Available",
    image_url:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=400&fit=crop",
    description:
      "Discover our healthy menu options! Fresh salads, protein bowls, and nutritious meals to fuel your day.",
    status: BannerStatus.ACTIVE,
    created_at: "2024-10-05T12:00:00Z",
    updated_at: "2024-11-15T18:45:00Z",
  },
];

// Update stats with recent banners
mockStats.recent_banners = mockBanners
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  .slice(0, 3);

export default function BannersPage() {
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [stats, setStats] = useState<PromotionStats>(mockStats);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [bannerFilters, setBannerFilters] = useState<BannerFilters>({});

  // Handle banner actions
  const handleBannerClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setShowBannerModal(true);
  };

  const handleStatusChange = async (bannerId: number, status: BannerStatus) => {
    setBanners((prevBanners) =>
      prevBanners.map((banner) => {
        if (banner.id === bannerId) {
          return {
            ...banner,
            status: status,
            updated_at: new Date().toISOString(),
          };
        }
        return banner;
      })
    );

    // Update stats based on status change
    setStats((prevStats) => {
      const banner = banners.find((b) => b.id === bannerId);
      if (!banner) return prevStats;

      const newStats = { ...prevStats };

      // Decrease old status count
      if (banner.status === BannerStatus.ACTIVE) {
        newStats.active_banners--;
      } else if (banner.status === BannerStatus.INACTIVE) {
        newStats.inactive_banners--;
      }

      // Increase new status count
      if (status === BannerStatus.ACTIVE) {
        newStats.active_banners++;
      } else if (status === BannerStatus.INACTIVE) {
        newStats.inactive_banners++;
      }

      return newStats;
    });

    // TODO: Call API to update banner status
    console.log(`Banner ${bannerId} status changed to ${status}`);
  };

  const handleBannerSave = async (updatedBanner: Banner) => {
    setBanners((prevBanners) => {
      const existingIndex = prevBanners.findIndex(
        (b) => b.id === updatedBanner.id
      );
      if (existingIndex >= 0) {
        // Update existing banner
        const newBanners = [...prevBanners];
        newBanners[existingIndex] = updatedBanner;
        return newBanners;
      } else {
        // Add new banner
        return [...prevBanners, updatedBanner];
      }
    });

    // Update stats for new banner
    if (!banners.find((b) => b.id === updatedBanner.id)) {
      setStats((prevStats) => ({
        ...prevStats,
        total_banners: prevStats.total_banners + 1,
        active_banners:
          updatedBanner.status === BannerStatus.ACTIVE
            ? prevStats.active_banners + 1
            : prevStats.active_banners,
        inactive_banners:
          updatedBanner.status === BannerStatus.INACTIVE
            ? prevStats.inactive_banners + 1
            : prevStats.inactive_banners,
      }));
    }

    // TODO: Call API to save banner changes
    console.log("Banner updated:", updatedBanner);
  };

  // Filter functions
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
          <h1 className="text-3xl font-bold text-gray-900">
            Banner Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage promotional banners and advertisements
          </p>
        </div>
        <Link href="/admin/promotions/banners/create">
          <Button>Create New Banner</Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <PromotionStatsComponent stats={stats} loading={loading} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.active_banners}</div>
          <div className="text-blue-100">Active Banners</div>
          <div className="mt-2">
            <Button
              size="sm"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              View Active
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.inactive_banners}</div>
          <div className="text-gray-100">Inactive Banners</div>
          <div className="mt-2">
            <Button
              size="sm"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-600"
            >
              View Inactive
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.total_banners}</div>
          <div className="text-green-100">Total Banners</div>
          <div className="mt-2">
            <Button
              size="sm"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-green-600"
            >
              View All
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">
            {((stats.active_banners / stats.total_banners) * 100).toFixed(1)}%
          </div>
          <div className="text-purple-100">Active Rate</div>
          <div className="mt-2">
            <Link href="/admin/promotions/banners/create">
              <Button
                size="sm"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-purple-600"
              >
                Create New
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Banners Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            All Banners ({filteredBanners.length})
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Bulk Actions
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>

        <BannerTable
          banners={filteredBanners}
          loading={loading}
          onBannerClick={handleBannerClick}
          onStatusChange={handleStatusChange}
          onFilterChange={setBannerFilters}
        />
      </div>

      {/* Banner Performance Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4">
          Banner Management Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-indigo-800 mb-2">
              Design Best Practices
            </h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Use high-quality images (1200x400px recommended)</li>
              <li>• Keep text readable on all devices</li>
              <li>• Use contrasting colors for better visibility</li>
              <li>• Include clear call-to-action messages</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-indigo-800 mb-2">
              Performance Optimization
            </h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• A/B test different banner designs</li>
              <li>• Monitor click-through rates</li>
              <li>• Update banners regularly for freshness</li>
              <li>• Align banners with current promotions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Banner Detail Modal */}
      <BannerDetailModal
        banner={selectedBanner}
        isOpen={showBannerModal}
        onClose={() => {
          setShowBannerModal(false);
          setSelectedBanner(null);
        }}
        onSave={handleBannerSave}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
