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
      title: "Tổng tài xế",
      value: stats.total_drivers.toLocaleString(),
      icon: "👥",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Tài xế đã xác minh",
      value: stats.verified_drivers.toLocaleString(),
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Chờ xác minh",
      value: stats.pending_verification.toLocaleString(),
      icon: "⏳",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Tài xế bị từ chối",
      value: stats.rejected_drivers.toLocaleString(),
      icon: "❌",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Tài xế hoạt động",
      value: stats.active_drivers.toLocaleString(),
      icon: "🟢",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Tài xế không hoạt động",
      value: stats.inactive_drivers.toLocaleString(),
      icon: "⭕",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "Tài xế mới tháng này",
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
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Tổng tài xế
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.total_drivers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {verificationRate}% Đã xác minh (
                {stats.verified_drivers.toLocaleString()})
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Tài xế hoạt động
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.active_drivers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.inactive_drivers.toLocaleString()} tài xế không hoạt động
              </p>
            </div>
            <div className="text-4xl">🟢</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-l-yellow-500 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Chờ xác minh
              </h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.pending_verification.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {pendingRate}% tổng tài xế
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
