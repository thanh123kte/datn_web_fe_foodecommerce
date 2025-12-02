"use client";

import { DriverStats as DriverStatsType } from "@/types/driver";
import { Card } from "@/components/ui/card";

interface DriverStatsProps {
  stats: DriverStatsType;
  loading?: boolean;
}

export function DriverStats({ stats, loading = false }: DriverStatsProps) {
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

  const verificationRate =
    stats.total_drivers > 0
      ? Math.round((stats.verified_drivers / stats.total_drivers) * 100)
      : 0;

  const pendingRate =
    stats.total_drivers > 0
      ? Math.round((stats.pending_verification / stats.total_drivers) * 100)
      : 0;

  const rejectionRate =
    stats.total_drivers > 0
      ? Math.round((stats.rejected_drivers / stats.total_drivers) * 100)
      : 0;

  const statItems = [
    {
      title: "Total Drivers",
      value: stats.total_drivers.toLocaleString(),
      icon: "👥",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Verified Drivers",
      value: stats.verified_drivers.toLocaleString(),
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Verification",
      value: stats.pending_verification.toLocaleString(),
      icon: "⏳",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Rejected Drivers",
      value: stats.rejected_drivers.toLocaleString(),
      icon: "❌",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Active Drivers",
      value: stats.active_drivers.toLocaleString(),
      icon: "🟢",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Inactive Drivers",
      value: stats.inactive_drivers.toLocaleString(),
      icon: "⭕",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "New Drivers This Month",
      value: stats.new_drivers_this_month.toLocaleString(),
      icon: "🆕",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Total Drivers
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.total_drivers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {verificationRate}% Verified (
                {stats.verified_drivers.toLocaleString()})
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Active Drivers
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.active_drivers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.inactive_drivers.toLocaleString()} inactive drivers
              </p>
            </div>
            <div className="text-4xl">🟢</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Pending Verification
              </h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.pending_verification.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {pendingRate}% of all drivers
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

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Verification Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Verified Drivers</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${verificationRate}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-green-600">
                  {verificationRate}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending Verification</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${pendingRate}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-yellow-600">
                  {pendingRate}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Rejected Drivers</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-red-600">
                  {stats.rejected_drivers}
                </span>
                <span className="text-sm text-gray-500">
                  ({rejectionRate}%)
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Driver Account Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Drivers</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-600">
                  {stats.active_drivers}
                </span>
                <span className="text-sm text-gray-500">verified & active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Inactive Drivers</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-600">
                  {stats.inactive_drivers}
                </span>
                <span className="text-sm text-gray-500">
                  suspended/disabled
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Verification Rate</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">
                  {verificationRate}%
                </span>
                <span className="text-sm text-gray-500">success rate</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Monthly Growth</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-purple-600">
                  +{stats.new_drivers_this_month}
                </span>
                <span className="text-sm text-gray-500">new drivers</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Growth Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Account Management Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              +{stats.new_drivers_this_month}
            </div>
            <div className="text-sm text-gray-600 mt-1">New Registrations</div>
            <div className="text-xs text-gray-500">
              {stats.total_drivers > 0
                ? Math.round(
                    (stats.new_drivers_this_month / stats.total_drivers) * 100
                  )
                : 0}
              % growth
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {verificationRate}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Verification Rate</div>
            <div className="text-xs text-gray-500">Account approval rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.active_drivers}
            </div>
            <div className="text-sm text-gray-600 mt-1">Active Drivers</div>
            <div className="text-xs text-gray-500">Currently operational</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
