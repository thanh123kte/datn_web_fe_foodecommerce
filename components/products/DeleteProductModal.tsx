"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, AlertTriangle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
  sold: number;
  status: "AVAILABLE" | "UNAVAILABLE" | "out_of_stock";
  categoryName: string;
  images: string[];
}

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
  isLoading?: boolean;
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  onConfirm,
  product,
  isLoading = false,
}: DeleteProductModalProps) {
  if (!isOpen || !product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const hasActiveSales = product.status === "active" && product.inventory > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Delete Product
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Product Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {product.categoryName}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-gray-600">{product.sold} sold</span>
                  <span className="text-gray-600">
                    {product.inventory} in stock
                  </span>
                </div>

                <div className="mt-2">
                  <Badge
                    className={
                      product.status === "active"
                        ? "bg-green-100 text-green-800"
                        : product.status === "inactive"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {product.status === "active"
                      ? "Active"
                      : product.status === "inactive"
                      ? "Inactive"
                      : "Out of Stock"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="mb-4">
            <p className="text-gray-600 mb-3">
              Are you sure you want to delete <strong>"{product.name}"</strong>?
            </p>

            {hasActiveSales && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Warning</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  This product is currently <strong>active</strong> and has{" "}
                  <strong>{product.inventory} items</strong> in stock. Deleting
                  it will remove it from your store immediately.
                </p>
              </div>
            )}

            {product.sold > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                <div className="flex items-center gap-2 text-blue-800 mb-1">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Sales History</span>
                </div>
                <p className="text-blue-700 text-sm">
                  This product has <strong>{product.sold} sales</strong>. The
                  sales data will be preserved for reporting purposes.
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Delete Product"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
