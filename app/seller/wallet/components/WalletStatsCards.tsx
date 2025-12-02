"use client";

import { Card } from "@/components/ui/card";
import { WalletStats, formatCurrency } from "@/lib/mockData/wallet";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  Activity,
} from "lucide-react";

interface WalletStatsCardsProps {
  stats: WalletStats;
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorClass: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorClass,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="w-24 h-8 bg-gray-200 rounded"></div>
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClass}`}>{icon}</div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {trend.value}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">
          {typeof value === "number" ? formatCurrency(value) : value}
        </h3>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
};

export const WalletStatsCards: React.FC<WalletStatsCardsProps> = ({
  stats,
  loading = false,
}) => {
  // Calculate trend percentages (mock calculation)
  const monthlyGrowth = (
    (stats.monthly_earnings / (stats.total_earned - stats.monthly_earnings)) *
    100
  ).toFixed(1);
  const weeklyGrowth = (
    (stats.weekly_earnings / stats.monthly_earnings) *
    100 *
    4.3
  ).toFixed(1);

  const statCards: StatCardProps[] = [
    {
      title: "Số dư hiện tại",
      value: stats.current_balance,
      subtitle: "Số tiền có thể rút",
      icon: <Wallet className="h-5 w-5 text-blue-600" />,
      colorClass: "bg-blue-100",
      trend: {
        value: "+12.5%",
        isPositive: true,
      },
      isLoading: loading,
    },
    {
      title: "Tổng thu nhập",
      value: stats.total_earned,
      subtitle: "Từ tất cả đơn hàng",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      colorClass: "bg-green-100",
      trend: {
        value: `+${monthlyGrowth}%`,
        isPositive: true,
      },
      isLoading: loading,
    },
    {
      title: "Thu nhập tháng này",
      value: stats.monthly_earnings,
      subtitle: `Từ ${new Date().toLocaleDateString("vi-VN", {
        month: "long",
        year: "numeric",
      })}`,
      icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
      colorClass: "bg-purple-100",
      trend: {
        value: `+${weeklyGrowth}%`,
        isPositive: parseFloat(weeklyGrowth) > 0,
      },
      isLoading: loading,
    },
    {
      title: "Thu nhập tuần này",
      value: stats.weekly_earnings,
      subtitle: "7 ngày qua",
      icon: <Activity className="h-5 w-5 text-orange-600" />,
      colorClass: "bg-orange-100",
      trend: {
        value: "+8.2%",
        isPositive: true,
      },
      isLoading: loading,
    },
    {
      title: "Tổng đã rút",
      value: stats.total_withdrawn,
      subtitle: "Đã chuyển về ngân hàng",
      icon: <ArrowDownCircle className="h-5 w-5 text-red-600" />,
      colorClass: "bg-red-100",
      trend: {
        value: "+5.3%",
        isPositive: false,
      },
      isLoading: loading,
    },
    {
      title: "Đang chờ rút",
      value: stats.pending_withdrawals,
      subtitle: "Đang xử lý",
      icon: <Clock className="h-5 w-5 text-yellow-600" />,
      colorClass: "bg-yellow-100",
      isLoading: loading,
    },
    {
      title: "Tổng hoàn tiền",
      value: stats.total_refunded,
      subtitle: "Đã hoàn lại khách hàng",
      icon: <ArrowUpCircle className="h-5 w-5 text-indigo-600" />,
      colorClass: "bg-indigo-100",
      trend: {
        value: "-2.1%",
        isPositive: true, // Lower refunds is better
      },
      isLoading: loading,
    },
    {
      title: "Tổng giao dịch",
      value: stats.total_transactions.toLocaleString("vi-VN"),
      subtitle: `${stats.recent_transaction_count} giao dịch gần đây`,
      icon: <CreditCard className="h-5 w-5 text-teal-600" />,
      colorClass: "bg-teal-100",
      trend: {
        value: "+15.4%",
        isPositive: true,
      },
      isLoading: loading,
    },
  ];

  return (
    <>
      {/* Main Balance Card */}
      <div className="col-span-full">
        <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-blue-100 text-sm font-medium">
                Số dư QtiWallet
              </p>
              <h2 className="text-4xl font-bold">
                {loading ? (
                  <div className="w-48 h-10 bg-white/20 rounded animate-pulse"></div>
                ) : (
                  formatCurrency(stats.current_balance)
                )}
              </h2>
              <p className="text-blue-100 text-sm">
                Có thể rút:{" "}
                {loading
                  ? "---"
                  : formatCurrency(
                      stats.current_balance - stats.pending_withdrawals
                    )}
              </p>
            </div>
            <div className="text-right">
              <div className="p-4 bg-white/20 rounded-xl">
                <Wallet className="h-8 w-8" />
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-sm text-blue-100">Tăng trưởng tháng này</p>
                <div className="flex items-center gap-1 text-green-300">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-semibold">+12.5%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics Grid */}
      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Quick Summary */}
      <div className="col-span-full">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tóm tắt tài chính
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Earning Summary */}
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Thu nhập trung bình/ngày
                </p>
                <p className="text-lg font-bold text-green-700">
                  {loading
                    ? "---"
                    : formatCurrency(Math.round(stats.monthly_earnings / 30))}
                </p>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Giao dịch trung bình/tháng
                </p>
                <p className="text-lg font-bold text-blue-700">
                  {loading
                    ? "---"
                    : Math.round(stats.total_transactions / 11).toLocaleString(
                        "vi-VN"
                      )}
                </p>
              </div>
            </div>

            {/* Withdrawal Summary */}
            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ArrowDownCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">
                  Tỷ lệ rút tiền
                </p>
                <p className="text-lg font-bold text-orange-700">
                  {loading
                    ? "---"
                    : `${(
                        (stats.total_withdrawn / stats.total_earned) *
                        100
                      ).toFixed(1)}%`}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};
