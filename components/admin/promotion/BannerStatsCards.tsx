"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Image, CheckCircle, PauseCircle, XCircle } from "lucide-react";
import { BannerStats } from "@/types/promotion";

interface BannerStatsCardsProps {
  stats: BannerStats;
}

export const BannerStatsCards: React.FC<BannerStatsCardsProps> = ({
  stats,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      <Card className="p-6 gap-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Tổng Banner</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalBanners}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Image className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-blue-600 font-medium">Tất cả banner</span>
        </div>
      </Card>

      <Card className="p-6 gap-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Banner Hoạt Động
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.activeBanners}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-600 font-medium">
            {stats.totalBanners > 0
              ? Math.round((stats.activeBanners / stats.totalBanners) * 100)
              : 0}
            %
          </span>
          <span className="text-gray-600 ml-1">đang hoạt động</span>
        </div>
      </Card>

      <Card className="p-6 gap-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Banner Tạm Dừng</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.inactiveBanners}
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <PauseCircle className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-orange-600 font-medium">
            {stats.totalBanners > 0
              ? Math.round((stats.inactiveBanners / stats.totalBanners) * 100)
              : 0}
            %
          </span>
          <span className="text-gray-600 ml-1">tạm dừng</span>
        </div>
      </Card>

      <Card className="p-6 gap-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Banner Hết Hạn</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.expiredBanners}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-red-600 font-medium">
            {stats.totalBanners > 0
              ? Math.round((stats.expiredBanners / stats.totalBanners) * 100)
              : 0}
            %
          </span>
          <span className="text-gray-600 ml-1">đã hết hạn</span>
        </div>
      </Card>
    </div>
  );
};
