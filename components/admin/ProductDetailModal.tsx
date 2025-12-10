"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  X,
  Calendar,
  User,
  Package,
  Tag,
  Clock,
  Shield,
  ShieldX,
  CheckCircle,
  XCircle,
  Ban,
  Store,
} from "lucide-react";
import {
  ProductResponseDto,
  ProductStatus,
  AdminStatus,
} from "@/lib/services/productService";

interface ProductDetailModalProps {
  product: ProductResponseDto | null;
  images?: string[];
  isOpen: boolean;
  onClose: () => void;
  onBan?: (product: ProductResponseDto) => void;
  onUnban?: (product: ProductResponseDto) => void;
}

const getStatusColor = (status: ProductStatus) => {
  switch (status) {
    case ProductStatus.AVAILABLE:
      return "text-green-600 bg-green-50";
    case ProductStatus.UNAVAILABLE:
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getStatusIcon = (status: ProductStatus) => {
  switch (status) {
    case ProductStatus.AVAILABLE:
      return <CheckCircle className="w-4 h-4" />;
    case ProductStatus.UNAVAILABLE:
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusText = (status: ProductStatus) => {
  switch (status) {
    case ProductStatus.AVAILABLE:
      return "Available";
    case ProductStatus.UNAVAILABLE:
      return "Unavailable";
    default:
      return "Unknown";
  }
};

const getAdminStatusColor = (adminStatus: AdminStatus) => {
  switch (adminStatus) {
    case AdminStatus.ACTIVE:
      return "text-green-600 bg-green-50";
    case AdminStatus.BANNED:
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getAdminStatusIcon = (adminStatus: AdminStatus) => {
  switch (adminStatus) {
    case AdminStatus.ACTIVE:
      return <Shield className="w-4 h-4" />;
    case AdminStatus.BANNED:
      return <ShieldX className="w-4 h-4" />;
    default:
      return <Shield className="w-4 h-4" />;
  }
};

const getAdminStatusText = (adminStatus: AdminStatus) => {
  switch (adminStatus) {
    case AdminStatus.ACTIVE:
      return "Active";
    case AdminStatus.BANNED:
      return "Banned";
    default:
      return "Unknown";
  }
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  images = [],
  isOpen,
  onClose,
  onBan,
  onUnban,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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
            Product Details
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
              {/* Main Image Display */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/product-placeholder.jpg";
                      }}
                    />
                    {/* Primary Badge on Main Image */}
                    {selectedImageIndex === 0 && (
                      <div className="absolute top-3 left-3 bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded shadow-lg">
                        Primary Image
                      </div>
                    )}
                    {/* Image Counter */}
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                ) : (
                  <Package className="w-16 h-16 text-gray-300" />
                )}
              </div>

              {/* Thumbnail Gallery - Show ALL images */}
              {images.length > 1 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    All Images ({images.length})
                  </p>
                  <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-2">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all ${
                          index === selectedImageIndex
                            ? "ring-2 ring-orange-500"
                            : index === 0
                            ? "ring-2 ring-blue-300"
                            : ""
                        }`}
                        title={
                          index === 0
                            ? "Primary Image (Click to view)"
                            : `Image ${index + 1} (Click to view)`
                        }
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/product-placeholder.jpg";
                          }}
                        />
                        {/* Primary Badge */}
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded font-semibold">
                            Primary
                          </div>
                        )}
                        {/* Selected Indicator */}
                        {index === selectedImageIndex && (
                          <div className="absolute inset-0 bg-orange-500 bg-opacity-20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white drop-shadow" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Images Message */}
              {images.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">
                    No images available for this product
                  </p>
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
                <p className="text-gray-600 mb-4">
                  {product.description || "No description available"}
                </p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </div>
                  {product.discountPrice &&
                    product.discountPrice < product.price && (
                      <div className="text-xl text-gray-500 line-through">
                        {formatPrice(product.discountPrice)}
                      </div>
                    )}
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Product Status:
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
                      Admin Status:
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAdminStatusColor(
                        product.adminStatus
                      )}`}
                    >
                      {getAdminStatusIcon(product.adminStatus)}
                      <span className="ml-1">
                        {getAdminStatusText(product.adminStatus)}
                      </span>
                    </span>
                  </div>
                </Card>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Tag className="w-4 h-4 mr-2" />
                  <span className="font-medium mr-2">Category:</span>
                  <span>{product.categoryName || "-"}</span>
                </div>

                {product.storeCategoryName && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="w-4 h-4 mr-2" />
                    <span className="font-medium mr-2">Store Category:</span>
                    <span>{product.storeCategoryName}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <Store className="w-4 h-4 mr-2" />
                  <span className="font-medium mr-2">Store:</span>
                  <span>{product.storeName || "-"}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium mr-2">Created:</span>
                  <span>{formatDate(product.createdAt)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium mr-2">Updated:</span>
                  <span>{formatDate(product.updatedAt)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-2" />
                  <span className="font-medium mr-2">Product ID:</span>
                  <span className="font-mono">{product.id}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {product.adminStatus === AdminStatus.ACTIVE ? (
                  <Button
                    onClick={() => {
                      onBan?.(product);
                    }}
                    variant="outline"
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Ban className="w-4 h-4" />
                    Ban Product
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      onUnban?.(product);
                    }}
                    variant="outline"
                    className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Unban Product
                  </Button>
                )}

                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
