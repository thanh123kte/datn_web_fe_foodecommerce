"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RevenueStats,
  formatCurrency,
  formatNumber,
  formatPercentage,
  getRevenueGrowthColor,
  getRevenueGrowthIcon,
} from "@/lib/mockData/revenue";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  ShoppingCart,
  Percent,
  Truck,
  Award,
  Calculator,
} from "lucide-react";

interface RevenueStatsCardsProps {
  stats: RevenueStats;
  loading?: boolean;
}

interface StatCard {
  title: string;
  value: string;
  subtitle?: string;
  growth?: number;
  icon: React.ReactNode;
  color: string;
}

export const RevenueStatsCards: React.FC<RevenueStatsCardsProps> = ({
  stats,
  loading = false,
}) => {
  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4" />;
    if (growth < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const statCards: StatCard[] = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      subtitle: `from ${formatNumber(stats.totalOrders)} orders`,
      growth: stats.revenueGrowth,
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      title: "Net Revenue",
      value: formatCurrency(stats.netRevenue),
      subtitle: `after discounts & commission`,
      icon: <Calculator className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(stats.averageOrderValue),
      subtitle: `per order`,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      title: "Total Orders",
      value: formatNumber(stats.totalOrders),
      subtitle: "completed orders",
      icon: <Award className="h-5 w-5" />,
      color: "bg-orange-500",
    },
    {
      title: "Total Discounts",
      value: formatCurrency(stats.totalDiscount),
      subtitle: `${((stats.totalDiscount / stats.totalRevenue) * 100).toFixed(
        1
      )}% of revenue`,
      icon: <Percent className="h-5 w-5" />,
      color: "bg-red-500",
    },
    {
      title: "Shipping Fees",
      value: formatCurrency(stats.totalShippingFee),
      subtitle: "delivery charges",
      icon: <Truck className="h-5 w-5" />,
      color: "bg-indigo-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((card, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.color} text-white`}>
              {card.icon}
            </div>
            {card.growth !== undefined && (
              <Badge
                variant="outline"
                className={`${getRevenueGrowthColor(
                  card.growth
                )} border-current`}
              >
                <div className="flex items-center gap-1">
                  {getGrowthIcon(card.growth)}
                  {formatPercentage(card.growth)}
                </div>
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            {card.subtitle && (
              <p className="text-sm text-gray-500">{card.subtitle}</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
