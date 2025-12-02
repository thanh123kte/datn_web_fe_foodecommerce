"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PromotionStats, formatCurrency } from "@/lib/mockData/promotions";
import {
  Ticket,
  Image as ImageIcon,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  AlertTriangle,
  Award,
  Calendar,
  Target,
} from "lucide-react";

interface PromotionStatsCardsProps {
  stats: PromotionStats;
  loading?: boolean;
}

interface StatCard {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    color?: string;
  };
}

export const PromotionStatsCards: React.FC<PromotionStatsCardsProps> = ({
  stats,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-32 h-8 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const statCards: StatCard[] = [
    {
      title: "Total Vouchers",
      value: stats.totalVouchers.toString(),
      subtitle: `${stats.activeVouchers} currently active`,
      icon: <Ticket className="h-5 w-5" />,
      color: "bg-blue-500",
      badge: {
        text: `${((stats.activeVouchers / stats.totalVouchers) * 100).toFixed(
          0
        )}% active`,
        variant: "outline",
      },
    },
    {
      title: "Total Banners",
      value: stats.totalBanners.toString(),
      subtitle: `${stats.activeBanners} currently active`,
      icon: <ImageIcon className="h-5 w-5" />,
      color: "bg-purple-500",
      badge: {
        text: `${((stats.activeBanners / stats.totalBanners) * 100).toFixed(
          0
        )}% active`,
        variant: "outline",
      },
    },
    {
      title: "Total Usage",
      value: stats.totalUsage.toString(),
      subtitle: "vouchers redeemed",
      icon: <Users className="h-5 w-5" />,
      color: "bg-green-500",
      badge: {
        text: `${stats.voucherUsageRate.toFixed(1)}% usage rate`,
        variant: "outline",
      },
    },
    {
      title: "Total Savings",
      value: formatCurrency(stats.totalDiscount),
      subtitle: "customer savings provided",
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-emerald-500",
    },
    {
      title: "Top Performer",
      value: stats.topPerformingVoucher?.code || "N/A",
      subtitle: stats.topPerformingVoucher
        ? `${stats.topPerformingVoucher.used_count} uses`
        : "No active vouchers",
      icon: <Award className="h-5 w-5" />,
      color: "bg-yellow-500",
      badge: stats.topPerformingVoucher
        ? {
            text: `${formatCurrency(
              stats.topPerformingVoucher.discount_value
            )}`,
            variant: "outline",
            color: "text-yellow-700 bg-yellow-50",
          }
        : undefined,
    },
    {
      title: "Usage Rate",
      value: `${stats.voucherUsageRate.toFixed(1)}%`,
      subtitle: "of available vouchers used",
      icon: <Target className="h-5 w-5" />,
      color:
        stats.voucherUsageRate >= 70
          ? "bg-green-500"
          : stats.voucherUsageRate >= 40
          ? "bg-yellow-500"
          : "bg-red-500",
    },
    {
      title: "Expiring Soon",
      value: stats.expiringVouchers.toString(),
      subtitle: "vouchers expire in 3 days",
      icon: <Clock className="h-5 w-5" />,
      color: stats.expiringVouchers > 0 ? "bg-orange-500" : "bg-gray-500",
      badge:
        stats.expiringVouchers > 0
          ? {
              text: "Action needed",
              variant: "destructive",
            }
          : {
              text: "All good",
              variant: "outline",
            },
    },
    {
      title: "Recent Activity",
      value: stats.recentPromotions.toString(),
      subtitle: "new promotions this week",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color} text-white`}>
                {card.icon}
              </div>
              {card.badge && (
                <Badge
                  variant={card.badge.variant}
                  className={`text-xs ${card.badge.color || ""}`}
                >
                  {card.badge.text}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              {card.subtitle && (
                <p className="text-sm text-gray-500">{card.subtitle}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Voucher Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Vouchers</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (stats.activeVouchers / stats.totalVouchers) * 100
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {stats.activeVouchers}/{stats.totalVouchers}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Usage Rate</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stats.voucherUsageRate >= 70
                        ? "bg-green-500"
                        : stats.voucherUsageRate >= 40
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(stats.voucherUsageRate, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {stats.voucherUsageRate.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-900">
                Total Savings Provided
              </span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(stats.totalDiscount)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Alerts & Reminders
          </h3>
          <div className="space-y-3">
            {stats.expiringVouchers > 0 && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-900">
                    {stats.expiringVouchers} voucher
                    {stats.expiringVouchers > 1 ? "s" : ""} expiring soon
                  </p>
                  <p className="text-xs text-orange-700">
                    Review and extend if needed
                  </p>
                </div>
              </div>
            )}

            {stats.voucherUsageRate < 30 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <TrendingUp className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    Low usage rate detected
                  </p>
                  <p className="text-xs text-yellow-700">
                    Consider adjusting discount values or conditions
                  </p>
                </div>
              </div>
            )}

            {stats.activeVouchers === 0 && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <Ticket className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    No active vouchers
                  </p>
                  <p className="text-xs text-red-700">
                    Create vouchers to attract customers
                  </p>
                </div>
              </div>
            )}

            {stats.expiringVouchers === 0 &&
              stats.voucherUsageRate >= 30 &&
              stats.activeVouchers > 0 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Award className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      All promotions running smoothly
                    </p>
                    <p className="text-xs text-green-700">
                      Keep up the great work!
                    </p>
                  </div>
                </div>
              )}
          </div>
        </Card>
      </div>
    </div>
  );
};
