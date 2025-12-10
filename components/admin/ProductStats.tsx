"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  Package,
  Shield,
  ShieldX,
  CheckCircle,
  XCircle,
  Users,
  Tag,
  Loader2,
} from "lucide-react";
import {
  ProductResponseDto,
  ProductStatus,
  AdminStatus,
} from "@/lib/services/productService";

interface ProductStatsComponentProps {
  products: ProductResponseDto[];
  isLoading?: boolean;
}

export const ProductStatsComponent: React.FC<ProductStatsComponentProps> = ({
  products,
  isLoading = false,
}) => {
  // Calculate statistics from products
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter(
      (p) => p.adminStatus === AdminStatus.ACTIVE
    ).length;
    const bannedProducts = products.filter(
      (p) => p.adminStatus === AdminStatus.BANNED
    ).length;

    // Category distribution
    const categoryMap = new Map<number, { name: string; count: number }>();
    products.forEach((product) => {
      if (product.categoryId && product.categoryName) {
        const existing = categoryMap.get(product.categoryId);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(product.categoryId, {
            name: product.categoryName,
            count: 1,
          });
        }
      }
    });
    const categoryDistribution = Array.from(categoryMap.entries())
      .map(([id, data]) => ({
        categoryId: id,
        categoryName: data.name,
        count: data.count,
        percentage: totalProducts > 0 ? (data.count / totalProducts) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Store distribution
    const storeMap = new Map<number, { name: string; count: number }>();
    products.forEach((product) => {
      if (product.storeName) {
        const existing = storeMap.get(product.storeId);
        if (existing) {
          existing.count++;
        } else {
          storeMap.set(product.storeId, {
            name: product.storeName,
            count: 1,
          });
        }
      }
    });
    const storeDistribution = Array.from(storeMap.entries())
      .map(([id, data]) => ({
        storeId: id,
        storeName: data.name,
        count: data.count,
        percentage: totalProducts > 0 ? (data.count / totalProducts) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Status distribution
    const availableCount = products.filter(
      (p) => p.status === ProductStatus.AVAILABLE
    ).length;
    const unavailableCount = products.filter(
      (p) => p.status === ProductStatus.UNAVAILABLE
    ).length;

    return {
      totalProducts,
      activeProducts,
      bannedProducts,
      categoryDistribution,
      storeDistribution,
      availableCount,
      unavailableCount,
    };
  }, [products]);
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const getStatusText = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.AVAILABLE:
        return "Có sẵn";
      case ProductStatus.UNAVAILABLE:
        return "Không có sẵn";
      default:
        return "Không rõ";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <Card className="p-6 gap-0">
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
            <span className="text-blue-600 font-medium">Tất cả sản phẩm</span>
          </div>
        </Card>

        <Card className="p-6 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Sản phẩm hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.activeProducts)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">
              {stats.totalProducts > 0
                ? Math.round((stats.activeProducts / stats.totalProducts) * 100)
                : 0}
              %
            </span>
            <span className="text-gray-600 ml-1">của tổng số</span>
          </div>
        </Card>

        <Card className="p-6 gap-0">
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
              {stats.totalProducts > 0
                ? Math.round((stats.bannedProducts / stats.totalProducts) * 100)
                : 0}
              %
            </span>
            <span className="text-gray-600 ml-1">bị cấm</span>
          </div>
        </Card>

        <Card className="p-6 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Có sẵn</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.availableCount)}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-medium">
              {stats.totalProducts > 0
                ? Math.round((stats.availableCount / stats.totalProducts) * 100)
                : 0}
              %
            </span>
            <span className="text-gray-600 ml-1">còn hàng</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
