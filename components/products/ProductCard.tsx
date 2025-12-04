"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  Tag,
  Package,
  TrendingUp,
} from "lucide-react";
import { API_BASE_URL, ASSET_BASE_URL, buildAbsoluteUrl } from "@/lib/config/env";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  status: "AVAILABLE" | "UNAVAILABLE" | "out_of_stock";
  inventory: number;
  sold: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  categoryName: string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const statusConfig = {
  AVAILABLE: {
    label: "Active",
    className: "bg-green-100 text-green-800",
  },
  UNAVAILABLE: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-800",
  },
  out_of_stock: {
    label: "Out of Stock",
    className: "bg-red-100 text-red-800",
  },
};

export default function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  status,
  inventory,
  sold,
  rating,
  reviewCount,
  tags,
  isFeature,
  categoryName,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  // Build a safe image URL: support absolute, API-relative, or uploaded paths
  const resolvedImage = useMemo(() => {
    if (!image) return "";

    // If already absolute (http/https/data), keep as is
    if (/^https?:\/\//i.test(image) || image.startsWith("data:")) {
      return image;
    }

    // If points to uploads/products/... convert to FileController route
    if (image.includes("/uploads/")) {
      const fileName = image.split("/").pop() || image;
      return buildAbsoluteUrl(`/api/files/products/${fileName}`, API_BASE_URL);
    }

    // Otherwise treat as API-relative path
    return buildAbsoluteUrl(image, ASSET_BASE_URL);
  }, [image]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const discountPercentage =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative bg-gray-100 w-full h-56">
        {!imageError && resolvedImage ? (
          <img
            src={resolvedImage}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isFeature && (
            <Badge className="bg-orange-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 text-white">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={statusConfig[status].className}>
            {statusConfig[status].label}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{categoryName}</span>
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-gray-900 mb-2 line-clamp-1"
          title={name}
        >
          {name}
        </h3>

        {/* Description */}
        <p
          className="text-sm text-gray-600 mb-3 line-clamp-2"
          title={description}
        >
          {description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{rating}</span>
            <span className="text-gray-500">({reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="font-medium">{sold}</span>
            <span className="text-gray-500">sold</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{inventory}</span>
            <span className="text-gray-500">left</span>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(id)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(id)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(id)}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
