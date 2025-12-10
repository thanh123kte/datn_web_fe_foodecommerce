"use client";

import { Card } from "@/components/ui/card";
import { CategoryStats } from "@/types/category";

interface CategoryStatsProps {
  stats: CategoryStats;
  loading?: boolean;
}

export function CategoryStatsComponent({ stats, loading }: CategoryStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
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
      title: "Tổng danh mục",
      value: stats.total_categories,
      icon: "📁",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Danh mục hoạt động",
      value: stats.active_categories,
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Danh mục không hoạt động",
      value: stats.inactive_categories,
      icon: "❌",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "Tổng sản phẩm",
      value: stats.total_products,
      icon: "🍽️",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Có sản phẩm",
      value: stats.categories_with_products,
      icon: "📊",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Danh mục trống",
      value: stats.categories_without_products,
      icon: "📭",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
