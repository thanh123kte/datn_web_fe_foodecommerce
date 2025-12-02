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
      title: "Total Categories",
      value: stats.total_categories,
      icon: "📁",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Categories",
      value: stats.active_categories,
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Inactive Categories",
      value: stats.inactive_categories,
      icon: "❌",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "Total Products",
      value: stats.total_products,
      icon: "🍽️",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "With Products",
      value: stats.categories_with_products,
      icon: "📊",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Empty Categories",
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

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Categories */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Most Popular Categories
          </h3>
          <div className="space-y-3">
            {stats.most_popular_categories.slice(0, 5).map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-category.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        📁
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {category.name}
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-[200px]">
                      {category.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">
                    {category.products_count || 0}
                  </div>
                  <div className="text-xs text-gray-500">products</div>
                </div>
              </div>
            ))}
            {stats.most_popular_categories.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No category data available
              </div>
            )}
          </div>
        </Card>

        {/* Recent Categories */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Categories</h3>
          <div className="space-y-3">
            {stats.recent_categories.slice(0, 5).map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-category.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      📁
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {category.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Created:{" "}
                    {new Date(category.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        category.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {stats.recent_categories.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No recent categories
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Category Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">
              Status Distribution
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
                          stats.total_categories > 0
                            ? (stats.active_categories /
                                stats.total_categories) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.active_categories}
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
                          stats.total_categories > 0
                            ? (stats.inactive_categories /
                                stats.total_categories) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.inactive_categories}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Distribution */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">
              Product Distribution
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">With Products</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.total_categories > 0
                            ? (stats.categories_with_products /
                                stats.total_categories) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.categories_with_products}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Empty</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.total_categories > 0
                            ? (stats.categories_without_products /
                                stats.total_categories) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.categories_without_products}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Average Products per Category */}
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-indigo-900">
                Average Products per Category
              </h4>
              <p className="text-sm text-indigo-700">
                Across all active categories
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">
                {stats.active_categories > 0
                  ? (stats.total_products / stats.active_categories).toFixed(1)
                  : "0"}
              </div>
              <div className="text-sm text-indigo-600">products/category</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
