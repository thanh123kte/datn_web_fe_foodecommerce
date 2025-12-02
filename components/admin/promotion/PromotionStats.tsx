"use client";

import { Card } from "@/components/ui/card";
import { PromotionStats } from "@/types/promotion";

interface PromotionStatsProps {
  stats: PromotionStats;
  loading?: boolean;
}

export function PromotionStatsComponent({
  stats,
  loading,
}: PromotionStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Vouchers",
      value: stats.total_vouchers,
      icon: "🎫",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Vouchers",
      value: stats.active_vouchers,
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Expired Vouchers",
      value: stats.expired_vouchers,
      icon: "⏰",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "Total Banners",
      value: stats.total_banners,
      icon: "🖼️",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Admin Vouchers",
      value: stats.admin_vouchers,
      icon: "👑",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Seller Vouchers",
      value: stats.seller_vouchers,
      icon: "🏪",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Active Banners",
      value: stats.active_banners,
      icon: "🎨",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Total Usage",
      value: stats.total_voucher_usage,
      icon: "📊",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Used Vouchers */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Most Used Vouchers</h3>
          <div className="space-y-3">
            {stats.most_used_vouchers.slice(0, 5).map((voucher) => (
              <div
                key={voucher.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {voucher.code}
                  </div>
                  <div className="text-sm text-gray-600">{voucher.title}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">
                    {voucher.used_count}
                  </div>
                  <div className="text-xs text-gray-500">uses</div>
                </div>
              </div>
            ))}
            {stats.most_used_vouchers.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No voucher usage data available
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {/* Recent Vouchers */}
            {stats.recent_vouchers.slice(0, 3).map((voucher) => (
              <div
                key={`voucher-${voucher.id}`}
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
              >
                <div className="p-2 bg-blue-100 rounded-full">
                  <span className="text-blue-600">🎫</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    New voucher: {voucher.code}
                  </div>
                  <div className="text-sm text-gray-600">{voucher.title}</div>
                </div>
              </div>
            ))}

            {/* Recent Banners */}
            {stats.recent_banners.slice(0, 2).map((banner) => (
              <div
                key={`banner-${banner.id}`}
                className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg"
              >
                <div className="p-2 bg-purple-100 rounded-full">
                  <span className="text-purple-600">🖼️</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    New banner: {banner.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {banner.description}
                  </div>
                </div>
              </div>
            ))}

            {stats.recent_vouchers.length === 0 &&
              stats.recent_banners.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No recent activity
                </div>
              )}
          </div>
        </Card>
      </div>

      {/* Usage Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Promotion Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Voucher Distribution */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">
              Voucher Distribution
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.active_vouchers / stats.total_vouchers) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.active_vouchers}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expired</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.expired_vouchers / stats.total_vouchers) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.expired_vouchers}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Disabled</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.disabled_vouchers / stats.total_vouchers) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.disabled_vouchers}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Status */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Banner Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.total_banners > 0
                            ? (stats.active_banners / stats.total_banners) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.active_banners}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inactive</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-500 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.total_banners > 0
                            ? (stats.inactive_banners / stats.total_banners) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.inactive_banners}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
