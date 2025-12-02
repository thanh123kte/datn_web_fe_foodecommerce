"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  X,
  Star,
  Calendar,
  User,
  Package,
  Tag,
  MapPin,
  Clock,
  Shield,
  ShieldX,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ban,
} from "lucide-react";
import { Product, ProductStatus, AdminStatus } from "@/types/product";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onBan?: (product: Product) => void;
  onUnban?: (product: Product) => void;
}

const getStatusColor = (status: ProductStatus) => {
  switch (status) {
    case ProductStatus.APPROVED:
      return "text-green-600 bg-green-50";
    case ProductStatus.PENDING:
      return "text-yellow-600 bg-yellow-50";
    case ProductStatus.REJECTED:
      return "text-red-600 bg-red-50";
    case ProductStatus.OUT_OF_STOCK:
      return "text-orange-600 bg-orange-50";
    case ProductStatus.DISCONTINUED:
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getStatusIcon = (status: ProductStatus) => {
  switch (status) {
    case ProductStatus.APPROVED:
      return <CheckCircle className="w-4 h-4" />;
    case ProductStatus.PENDING:
      return <Clock className="w-4 h-4" />;
    case ProductStatus.REJECTED:
      return <XCircle className="w-4 h-4" />;
    case ProductStatus.OUT_OF_STOCK:
      return <AlertCircle className="w-4 h-4" />;
    case ProductStatus.DISCONTINUED:
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
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

const getAdminStatusColor = (adminStatus: AdminStatus) => {
  switch (adminStatus) {
    case AdminStatus.NORMAL:
      return "text-green-600 bg-green-50";
    case AdminStatus.BANNED:
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getAdminStatusIcon = (adminStatus: AdminStatus) => {
  switch (adminStatus) {
    case AdminStatus.NORMAL:
      return <Shield className="w-4 h-4" />;
    case AdminStatus.BANNED:
      return <ShieldX className="w-4 h-4" />;
    default:
      return <Shield className="w-4 h-4" />;
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

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onBan,
  onUnban,
}) => {
  if (!isOpen || !product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chi tiết sản phẩm
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[0] || "/images/product-placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/product-placeholder.jpg";
                  }}
                />
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/product-placeholder.jpg";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </div>

                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="text-lg font-medium">
                      {product.rating}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({product.reviewCount} đánh giá)
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Trạng thái sản phẩm:
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {getStatusIcon(product.status)}
                      <span className="ml-1">
                        {getStatusText(product.status)}
                      </span>
                    </span>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Trạng thái quản lý:
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAdminStatusColor(
                        product.admin_status
                      )}`}
                    >
                      {getAdminStatusIcon(product.admin_status)}
                      <span className="ml-1">
                        {getAdminStatusText(product.admin_status)}
                      </span>
                    </span>
                  </div>
                </Card>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Tag className="w-4 h-4 mr-2" />
                  <span className="font-medium mr-2">Danh mục:</span>
                  <span>{product.categoryName}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium mr-2">Cửa hàng:</span>
                  <span>{product.sellerName}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium mr-2">Ngày tạo:</span>
                  <span>{formatDate(product.createdAt)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium mr-2">Cập nhật:</span>
                  <span>{formatDate(product.updatedAt)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-2" />
                  <span className="font-medium mr-2">ID sản phẩm:</span>
                  <span className="font-mono">{product.id}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {product.admin_status === AdminStatus.NORMAL ? (
                  <Button
                    onClick={() => {
                      onBan?.(product);
                      onClose();
                    }}
                    variant="outline"
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Ban className="w-4 h-4" />
                    Cấm sản phẩm
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      onUnban?.(product);
                      onClose();
                    }}
                    variant="outline"
                    className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Bỏ cấm sản phẩm
                  </Button>
                )}

                <Button onClick={onClose} variant="outline">
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
