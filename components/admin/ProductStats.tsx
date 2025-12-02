"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  Package,
  Shield,
  ShieldX,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Users,
  Tag,
} from "lucide-react";
import { ProductStats, AdminStatus, ProductStatus } from "@/types/product";

interface ProductStatsComponentProps {
  stats?: ProductStats;
}

// Mock data với cấu trúc mới
const mockStats: ProductStats = {
  totalProducts: 1250,
  normalProducts: 987,
  bannedProducts: 263,
  categoryDistribution: [
    { categoryId: "1", categoryName: "Bánh mì", count: 315, percentage: 25.2 },
    { categoryId: "2", categoryName: "Phở", count: 225, percentage: 18.0 },
    { categoryId: "3", categoryName: "Cơm", count: 200, percentage: 16.0 },
    { categoryId: "4", categoryName: "Bún", count: 170, percentage: 13.6 },
    { categoryId: "5", categoryName: "Bánh xèo", count: 115, percentage: 9.2 },
    { categoryId: "6", categoryName: "Khác", count: 225, percentage: 18.0 },
  ],
  sellerDistribution: [
    {
      sellerId: "1",
      sellerName: "Quán Bánh Mì Sài Gòn",
      count: 45,
      percentage: 3.6,
    },
    {
      sellerId: "2",
      sellerName: "Phở Hà Nội Truyền Thống",
      count: 38,
      percentage: 3.0,
    },
    {
      sellerId: "3",
      sellerName: "Quán Ăn Miền Tây",
      count: 32,
      percentage: 2.6,
    },
    { sellerId: "4", sellerName: "Bún Chả Cô Ba", count: 28, percentage: 2.2 },
    {
      sellerId: "5",
      sellerName: "Cơm Tấm Sài Gòn",
      count: 25,
      percentage: 2.0,
    },
  ],
  statusDistribution: [
    { status: ProductStatus.APPROVED, count: 890, percentage: 71.2 },
    { status: ProductStatus.PENDING, count: 125, percentage: 10.0 },
    { status: ProductStatus.REJECTED, count: 85, percentage: 6.8 },
    { status: ProductStatus.OUT_OF_STOCK, count: 95, percentage: 7.6 },
    { status: ProductStatus.DISCONTINUED, count: 55, percentage: 4.4 },
  ],
  adminStatusDistribution: [
    { adminStatus: AdminStatus.NORMAL, count: 987, percentage: 79.0 },
    { adminStatus: AdminStatus.BANNED, count: 263, percentage: 21.0 },
  ],
};

export const ProductStatsComponent: React.FC<ProductStatsComponentProps> = ({
  stats = mockStats,
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const getStatusIcon = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.APPROVED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case ProductStatus.PENDING:
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case ProductStatus.REJECTED:
        return <XCircle className="w-4 h-4 text-red-500" />;
      case ProductStatus.OUT_OF_STOCK:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case ProductStatus.DISCONTINUED:
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Package className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusText = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.APPROVED:
        return "Đã duyệt";
      case ProductStatus.PENDING:
        return "Chờ duyệt";
      case ProductStatus.REJECTED:
        return "Bị từ chối";
      case ProductStatus.OUT_OF_STOCK:
        return "Hết hàng";
      case ProductStatus.DISCONTINUED:
        return "Ngừng KD";
      default:
        return "Không xác định";
    }
  };

  const getAdminStatusIcon = (adminStatus: AdminStatus) => {
    switch (adminStatus) {
      case AdminStatus.NORMAL:
        return <Shield className="w-4 h-4 text-green-500" />;
      case AdminStatus.BANNED:
        return <ShieldX className="w-4 h-4 text-red-500" />;
      default:
        return <Shield className="w-4 h-4 text-blue-500" />;
    }
  };

  const getAdminStatusText = (adminStatus: AdminStatus) => {
    switch (adminStatus) {
      case AdminStatus.NORMAL:
        return "Bình thường";
      case AdminStatus.BANNED:
        return "Bị cấm";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.totalProducts)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600 font-medium">Toàn hệ thống</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Sản phẩm bình thường
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.normalProducts)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">
              {Math.round((stats.normalProducts / stats.totalProducts) * 100)}%
            </span>
            <span className="text-gray-600 ml-1">của tổng số</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Sản phẩm bị cấm
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.bannedProducts)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <ShieldX className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600 font-medium">
              {Math.round((stats.bannedProducts / stats.totalProducts) * 100)}%
            </span>
            <span className="text-gray-600 ml-1">bị cấm</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Phân bố theo danh mục
            </h3>
            <Tag className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {stats.categoryDistribution.map((category, index) => (
              <div key={category.categoryId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {category.categoryName}
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatNumber(category.count)} ({category.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      index % 6 === 0
                        ? "bg-blue-500"
                        : index % 6 === 1
                        ? "bg-green-500"
                        : index % 6 === 2
                        ? "bg-yellow-500"
                        : index % 6 === 3
                        ? "bg-red-500"
                        : index % 6 === 4
                        ? "bg-purple-500"
                        : "bg-pink-500"
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Sellers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Top cửa hàng
            </h3>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            {stats.sellerDistribution.slice(0, 5).map((seller, index) => (
              <div
                key={seller.sellerId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : index === 1
                        ? "bg-gray-100 text-gray-800"
                        : index === 2
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                      {seller.sellerName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatNumber(seller.count)} sản phẩm
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {seller.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Phân bố trạng thái sản phẩm
            </h3>
            <Eye className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {stats.statusDistribution.map((status) => (
              <div
                key={status.status}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  {getStatusIcon(status.status)}
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {getStatusText(status.status)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">
                    {formatNumber(status.count)}
                  </span>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    {status.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Admin Status Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Trạng thái quản lý
            </h3>
            <Package className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            {stats.adminStatusDistribution.map((adminStatus) => (
              <div
                key={adminStatus.adminStatus}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  {getAdminStatusIcon(adminStatus.adminStatus)}
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {getAdminStatusText(adminStatus.adminStatus)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">
                    {formatNumber(adminStatus.count)}
                  </span>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    {adminStatus.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Tỷ lệ sản phẩm bình thường</span>
              <span>
                {
                  stats.adminStatusDistribution.find(
                    (s) => s.adminStatus === AdminStatus.NORMAL
                  )?.percentage
                }
                %
              </span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-3">
              <div
                className="h-3 bg-green-500 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    stats.adminStatusDistribution.find(
                      (s) => s.adminStatus === AdminStatus.NORMAL
                    )?.percentage || 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
