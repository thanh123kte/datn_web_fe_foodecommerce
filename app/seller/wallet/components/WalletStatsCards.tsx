"use client";

import { Card } from "@/components/ui/card";
import { WalletResponseDto } from "@/lib/services/walletService";
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

// Utility function to format currency (Vietnamese Dong)
const formatCurrency = (amount: string | number): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numAmount);
};

interface WalletStatsCardsProps {
  wallet: WalletResponseDto | null;
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
  wallet,
  loading = false,
}) => {
  // If wallet data is not available, show loading state
  if (!wallet) {
    return (
      <div className="space-y-6">
        <Card className="p-8 animate-pulse">
          <div className="h-24 bg-gray-200 rounded"></div>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // TODO: Trend percentages and time-based stats (monthly/weekly) are not available from backend
  // These would require historical data analysis or additional backend endpoints
  // Current implementation shows static trend values for UI consistency

  const statCards: StatCardProps[] = [
    {
      title: "Tổng thu nhập",
      value: wallet.totalEarned,
      subtitle: "Từ tất cả đơn hàng",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      colorClass: "bg-green-100",
      isLoading: loading,
    },
    {
      title: "Tổng đã nạp",
      value: wallet.totalDeposited,
      subtitle: "Đã nạp vào ví",
      icon: <ArrowUpCircle className="h-5 w-5 text-blue-600" />,
      colorClass: "bg-blue-100",
      isLoading: loading,
    },
    {
      title: "Tổng đã rút",
      value: wallet.totalWithdrawn,
      subtitle: "Đã chuyển về ngân hàng",
      icon: <ArrowDownCircle className="h-5 w-5 text-red-600" />,
      colorClass: "bg-red-100",
      isLoading: loading,
    },
    {
      title: "Số dư khả dụng",
      value: wallet.balance,
      subtitle: "Có thể rút ngay",
      icon: <Wallet className="h-5 w-5 text-purple-600" />,
      colorClass: "bg-purple-100",
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
                  formatCurrency(wallet.balance)
                )}
              </h2>
              <p className="text-blue-100 text-sm">
                Thay đổi lần cuối:{" "}
                {loading
                  ? "---"
                  : new Date(wallet.updatedAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </p>
            </div>
            <div className="text-right">
              <div className="p-4 bg-white/20 rounded-xl">
                <Wallet className="h-8 w-8" />
              </div>
              {/* TODO: Growth stats not available from backend - requires historical data analysis */}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Summary */}
      <div className="col-span-full">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tóm tắt tài chính
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Earned */}
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Tổng thu nhập
                </p>
                <p className="text-lg font-bold text-green-700">
                  {loading ? "---" : formatCurrency(wallet.totalEarned)}
                </p>
              </div>
            </div>

            {/* Total Deposited */}
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Tổng đã nạp</p>
                <p className="text-lg font-bold text-blue-700">
                  {loading ? "---" : formatCurrency(wallet.totalDeposited)}
                </p>
              </div>
            </div>

            {/* Total Withdrawn */}
            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ArrowDownCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">
                  Tổng đã rút
                </p>
                <p className="text-lg font-bold text-orange-700">
                  {loading ? "---" : formatCurrency(wallet.totalWithdrawn)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};
