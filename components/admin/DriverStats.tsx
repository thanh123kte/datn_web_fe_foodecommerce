"use client";

import { DriverStats as DriverStatsType } from "@/types/driver";
import { Card } from "@/components/ui/card";
import { Users, UserCheck, Clock, Loader2 } from "lucide-react";

interface DriverStatsProps {
  stats: DriverStatsType;
  loading?: boolean;
}

export function DriverStats({ stats, loading = false }: DriverStatsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
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

  return (
    <div className="mb-8">
      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card className="p-6 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng tài xế</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total_drivers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">
              {verificationRate}%
            </span>
            <span className="text-gray-600 ml-1">
              Đã xác minh ({stats.verified_drivers.toLocaleString()})
            </span>
          </div>
        </Card>

        <Card className="p-6 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tài xế hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.active_drivers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600 font-medium">
              {stats.inactive_drivers.toLocaleString()}
            </span>
            <span className="text-gray-600 ml-1">tài xế không hoạt động</span>
          </div>
        </Card>

        <Card className="p-6 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chờ xác minh</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending_verification.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-yellow-600 font-medium">{pendingRate}%</span>
            <span className="text-gray-600 ml-1">tổng tài xế</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
