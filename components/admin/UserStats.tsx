"use client";

import { UserStats as UserStatsType } from "@/types/user";
import { Card } from "@/components/ui/card";

interface UserStatsProps {
  stats: UserStatsType;
  loading?: boolean;
}

export function UserStats({ stats, loading = false }: UserStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Users",
      value: stats.total_users.toLocaleString(),
      icon: "👥",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Users",
      value: stats.active_users.toLocaleString(),
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Sellers",
      value: stats.total_sellers.toLocaleString(),
      icon: "🏪",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Sellers",
      value: stats.pending_sellers.toLocaleString(),
      icon: "⏳",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Active Sellers",
      value: stats.active_sellers.toLocaleString(),
      icon: "🟢",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Banned Sellers",
      value: stats.banned_sellers.toLocaleString(),
      icon: "🚫",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "New Users This Month",
      value: stats.new_users_this_month.toLocaleString(),
      icon: "📈",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "New Sellers This Month",
      value: stats.new_sellers_this_month.toLocaleString(),
      icon: "🆕",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const activeUserPercentage =
    stats.total_users > 0
      ? Math.round((stats.active_users / stats.total_users) * 100)
      : 0;

  const activeSellerPercentage =
    stats.total_sellers > 0
      ? Math.round((stats.active_sellers / stats.total_sellers) * 100)
      : 0;

  const pendingSellerPercentage =
    stats.total_sellers > 0
      ? Math.round((stats.pending_sellers / stats.total_sellers) * 100)
      : 0;

  return (
    <div className="space-y-6 mb-8">
      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                User Overview
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.total_users.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {activeUserPercentage}% Active (
                {stats.active_users.toLocaleString()})
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Seller Overview
              </h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats.total_sellers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {activeSellerPercentage}% Active (
                {stats.active_sellers.toLocaleString()})
              </p>
            </div>
            <div className="text-4xl">🏪</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Pending Approval
              </h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.pending_sellers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {pendingSellerPercentage}% of sellers
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </Card>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <span className="text-xl">{item.icon}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  {item.title}
                </p>
                <p className={`text-2xl font-bold ${item.color}`}>
                  {item.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            This Month's Growth
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">New Users</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-600">
                  +{stats.new_users_this_month}
                </span>
                <span className="text-sm text-gray-500">
                  (
                  {stats.total_users > 0
                    ? Math.round(
                        (stats.new_users_this_month / stats.total_users) * 100
                      )
                    : 0}
                  %)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">New Sellers</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">
                  +{stats.new_sellers_this_month}
                </span>
                <span className="text-sm text-gray-500">
                  (
                  {stats.total_sellers > 0
                    ? Math.round(
                        (stats.new_sellers_this_month / stats.total_sellers) *
                          100
                      )
                    : 0}
                  %)
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Seller Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Sellers</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${activeSellerPercentage}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-green-600">
                  {activeSellerPercentage}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending Approval</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${pendingSellerPercentage}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-yellow-600">
                  {pendingSellerPercentage}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Banned Sellers</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-red-600">
                  {stats.banned_sellers}
                </span>
                <span className="text-sm text-gray-500">
                  (
                  {stats.total_sellers > 0
                    ? Math.round(
                        (stats.banned_sellers / stats.total_sellers) * 100
                      )
                    : 0}
                  %)
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
