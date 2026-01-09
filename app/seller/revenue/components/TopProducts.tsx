"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopProduct } from "@/lib/services/sellerRevenueService";
import { TrendingUp, Package, DollarSign } from "lucide-react";
import sellerRevenueService from "@/lib/services/sellerRevenueService";

interface TopProductsProps {
  products: TopProduct[];
  loading?: boolean;
}

export const TopProducts: React.FC<TopProductsProps> = ({
  products,
  loading = false,
}) => {
  // Guard against undefined or non-array products
  const safeProducts = Array.isArray(products) ? products : [];

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Top Sản Phẩm Bán Chạy
        </h3>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-24 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (safeProducts.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Top Sản Phẩm Bán Chạy
        </h3>
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Chưa Có Dữ Liệu
          </h4>
          <p className="text-gray-600">
            Chưa có sản phẩm nào được bán trong thời gian này.
          </p>
        </div>
      </Card>
    );
  }

  // Find max values for progress bars
  const maxSold = Math.max(...safeProducts.map((p) => p.totalSold));
  const maxRevenue = Math.max(...safeProducts.map((p) => p.totalRevenue));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Top Sản Phẩm Bán Chạy
        </h3>
        <Badge variant="outline" className="text-sm">
          <TrendingUp className="h-4 w-4 mr-2" />
          Top {safeProducts.length}
        </Badge>
      </div>

      <div className="space-y-4">
        {safeProducts.map((product, index) => {
          const soldPercentage = (product.totalSold / maxSold) * 100;
          const revenuePercentage = (product.totalRevenue / maxRevenue) * 100;

          return (
            <div
              key={product.productId}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {product.productName}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Package className="h-4 w-4 mr-1" />
                        {sellerRevenueService.formatNumber(
                          product.totalSold
                        )}{" "}
                        đã bán
                      </span>
                      <span className="flex items-center">
                        {sellerRevenueService.formatCurrency(
                          product.totalRevenue
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Số lượng bán</span>
                    <span>{soldPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${soldPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Doanh thu</span>
                    <span>{revenuePercentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${revenuePercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
