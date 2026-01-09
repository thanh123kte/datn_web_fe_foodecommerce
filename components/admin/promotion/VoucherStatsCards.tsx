"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Ticket, CheckCircle, Users, Store } from "lucide-react";
import { PromotionStats } from "@/types/promotion";

interface VoucherStatsCardsProps {
  stats: PromotionStats;
}

export const VoucherStatsCards: React.FC<VoucherStatsCardsProps> = ({
  stats,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      <Card className="p-6 gap-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Voucher Hoạt Động
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.active_vouchers}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-600 font-medium">
            {stats.total_vouchers > 0
              ? Math.round((stats.active_vouchers / stats.total_vouchers) * 100)
              : 0}
            %
          </span>
          <span className="text-gray-600 ml-1">đang hoạt động</span>
        </div>
      </Card>

      <Card className="p-6 gap-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Tổng Lượt Dùng</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.total_voucher_usage}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-blue-600 font-medium">Tất cả voucher</span>
        </div>
      </Card>

      <Card className="p-6 gap-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Admin Tạo</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.admin_vouchers}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Ticket className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-purple-600 font-medium">
            {stats.total_vouchers > 0
              ? Math.round((stats.admin_vouchers / stats.total_vouchers) * 100)
              : 0}
            %
          </span>
          <span className="text-gray-600 ml-1">của tổng số</span>
        </div>
      </Card>

      <Card className="p-6 gap-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Người Bán Tạo</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.seller_vouchers}
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Store className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-orange-600 font-medium">
            {stats.total_vouchers > 0
              ? Math.round((stats.seller_vouchers / stats.total_vouchers) * 100)
              : 0}
            %
          </span>
          <span className="text-gray-600 ml-1">của tổng số</span>
        </div>
      </Card>
    </div>
  );
};
