"use client";

import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { PromotionStatsCards } from "./components/PromotionStatsCards";
import { VoucherList } from "./components/VoucherList";
import { BannerList } from "./components/BannerList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Voucher,
  Banner,
  PromotionStats,
  DiscountStatus,
  BannerStatus,
  promotionsAPI,
} from "@/lib/mockData/promotions";
import { Plus, Ticket, Image, TrendingUp, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";

export default function PromotionsPage() {
  // State management
  const [promotionStats, setPromotionStats] = useState<PromotionStats | null>(
    null
  );
  const [recentVouchers, setRecentVouchers] = useState<Voucher[]>([]);
  const [recentBanners, setRecentBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsResult, vouchersResult, bannersResult] = await Promise.all([
        promotionsAPI.getPromotionStats(),
        promotionsAPI.getVouchers(1, 5), // Recent 5 vouchers for overview
        promotionsAPI.getBanners(1, 5), // Recent 5 banners for overview
      ]);

      setPromotionStats(statsResult);
      setRecentVouchers(vouchersResult.vouchers);
      setRecentBanners(bannersResult.banners);
    } catch (error) {
      console.error("Failed to load promotion data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // Quick actions
  const handleViewVoucher = useCallback((voucher: Voucher) => {
    console.log("View voucher details:", voucher);
    // Navigate to voucher details or open modal
  }, []);

  const handleViewBanner = useCallback((banner: Banner) => {
    console.log("View banner details:", banner);
    // Navigate to banner details or open modal
  }, []);

  return (
    <MainLayout userRole="seller">
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Promotion Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your vouchers and banners to attract more customers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/seller/promotions/vouchers/create">
              <Button className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Create Voucher
              </Button>
            </Link>
            <Link href="/seller/promotions/banners/create">
              <Button variant="outline" className="flex items-center gap-2">
                <Image className="h-4 w-4" alt="" />
                Create Banner
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Dashboard */}
        {promotionStats && (
          <PromotionStatsCards stats={promotionStats} loading={loading} />
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Vouchers */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Ticket className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Recent Vouchers
                      </h3>
                      <p className="text-sm text-gray-600">
                        Latest promotional vouchers
                      </p>
                    </div>
                  </div>
                  <Link href="/seller/promotions/vouchers">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div className="space-y-2">
                              <div className="w-32 h-4 bg-gray-200 rounded"></div>
                              <div className="w-24 h-3 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                          <div className="w-16 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentVouchers.length > 0 ? (
                  <div className="space-y-4">
                    {recentVouchers.map((voucher) => (
                      <div
                        key={voucher.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewVoucher(voucher)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Ticket className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {voucher.code}
                            </p>
                            <p className="text-sm text-gray-600">
                              Used {voucher.used_count}/{voucher.usage_limit}{" "}
                              times
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={
                            voucher.status === DiscountStatus.ACTIVE
                              ? "bg-green-100 text-green-800"
                              : voucher.status === DiscountStatus.EXPIRED
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {voucher.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      No vouchers created yet
                    </p>
                    <Link href="/seller/promotions/vouchers/create">
                      <Button size="sm">Create Your First Voucher</Button>
                    </Link>
                  </div>
                )}
              </Card>

              {/* Recent Banners */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Image className="h-5 w-5 text-purple-600" alt="" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Recent Banners
                      </h3>
                      <p className="text-sm text-gray-600">
                        Latest promotional banners
                      </p>
                    </div>
                  </div>
                  <Link href="/seller/promotions/banners">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 bg-gray-200 rounded-lg"></div>
                            <div className="space-y-2">
                              <div className="w-32 h-4 bg-gray-200 rounded"></div>
                              <div className="w-24 h-3 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                          <div className="w-16 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentBanners.length > 0 ? (
                  <div className="space-y-4">
                    {recentBanners.map((banner) => (
                      <div
                        key={banner.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewBanner(banner)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden">
                            <NextImage
                              src={banner.image_url}
                              alt={banner.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {banner.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Created{" "}
                              {new Date(banner.created_at).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={
                            banner.status === BannerStatus.ACTIVE
                              ? "bg-green-100 text-green-800"
                              : banner.status === BannerStatus.INACTIVE
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {banner.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Image
                      className="h-12 w-12 text-gray-400 mx-auto mb-4"
                      alt=""
                    />
                    <p className="text-gray-600 mb-4">No banners created yet</p>
                    <Link href="/seller/promotions/banners/create">
                      <Button size="sm">Create Your First Banner</Button>
                    </Link>
                  </div>
                )}
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/seller/promotions/vouchers/create">
                  <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Plus className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Create Voucher
                        </p>
                        <p className="text-sm text-gray-600">
                          Set up discount codes
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link href="/seller/promotions/banners/create">
                  <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Plus className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Create Banner
                        </p>
                        <p className="text-sm text-gray-600">
                          Design promotional banners
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Card
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={handleRefresh}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Eye className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        View Analytics
                      </p>
                      <p className="text-sm text-gray-600">Track performance</p>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          </TabsContent>

          {/* Vouchers Tab */}
          <TabsContent value="vouchers" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                All Vouchers
              </h2>
              <Link href="/seller/promotions/vouchers">
                <Button variant="outline">
                  Manage All Vouchers
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <VoucherList
              vouchers={filteredVouchers}
              loading={loading}
              onViewDetails={handleViewVoucher}
              onEdit={(voucher) => console.log("Edit voucher:", voucher)}
              onDelete={(voucher) => console.log("Delete voucher:", voucher)}
            />
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                All Banners
              </h2>
              <Link href="/seller/promotions/banners">
                <Button variant="outline">
                  Manage All Banners
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <BannerList
              banners={recentBanners}
              loading={loading}
              onViewDetails={handleViewBanner}
              onEdit={(banner) => console.log("Edit banner:", banner)}
              onDelete={(banner) => console.log("Delete banner:", banner)}
              onToggleStatus={(banner) => console.log("Toggle banner:", banner)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
