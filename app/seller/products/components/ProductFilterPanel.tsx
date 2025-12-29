"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  X,
  Search,
  DollarSign,
  Package,
  Star,
  ArrowUpDown,
} from "lucide-react";
import { ProductFilters } from "@/lib/mockData/products";
import {
  storeCategoryService,
  StoreCategory,
} from "@/lib/services/storeCategoryService";
import { useAuth } from "@/contexts/AuthContext";

interface ProductFilterPanelProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onReset: () => void;
  totalProducts: number;
  isLoading?: boolean;
}

export default function ProductFilterPanel({
  filters,
  onFiltersChange,
  onReset,
  totalProducts,
  isLoading = false,
}: ProductFilterPanelProps) {
  const { currentStore } = useAuth();
  const storeId = currentStore?.id;
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (storeId) {
      loadCategories();
    }
  }, [storeId]);

  const loadCategories = async () => {
    if (!storeId) return;
    setLoadingCategories(true);
    try {
      const data = await storeCategoryService.getByStoreId(storeId);
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters: ProductFilters = {};
    setLocalFilters(resetFilters);
    onReset();
  };

  const hasActiveFilters = Object.values(localFilters).some(
    (value) => value !== undefined && value !== "" && value !== "all"
  );

  const activeFilterCount = Object.values(localFilters).filter(
    (value) => value !== undefined && value !== "" && value !== "all"
  ).length;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200"
              >
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {totalProducts} products
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-orange-600 hover:text-orange-700"
            >
              {showAdvanced ? "Simple" : "Advanced"}
            </Button>
          </div>
        </div>

        {/* Basic Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={localFilters.search || ""}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleApplyFilters();
                  }
                }}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <select
              value={localFilters.categoryId || ""}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  categoryId: e.target.value || undefined,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={localFilters.status || "all"}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: e.target.value === "all" ? undefined : e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="AVAILABLE">Hoạt động</option>
              <option value="UNAVAILABLE">Tạm ngưng</option>
            </select>
          </div>

          {/* Apply/Reset */}
          <div className="flex gap-2">
            <Button
              onClick={handleApplyFilters}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
              size="sm"
            >
              Apply
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Price Range (VND)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={localFilters.minPrice || ""}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                    disabled={isLoading}
                    min="0"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={localFilters.maxPrice || ""}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                    disabled={isLoading}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                <ArrowUpDown className="w-4 h-4 inline mr-1" />
                Sort By
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <select
                    value={localFilters.sortBy || ""}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value
                          ? (e.target.value as any)
                          : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={isLoading}
                  >
                    <option value="">Default</option>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="sold">Sales</option>
                    <option value="rating">Rating</option>
                    <option value="createdAt">Created Date</option>
                    <option value="updatedAt">Updated Date</option>
                  </select>
                </div>
                <div>
                  <select
                    value={localFilters.order || "desc"}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        order: e.target.value as "asc" | "desc",
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={isLoading || !localFilters.sortBy}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Price Filters */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Quick Price Filters
              </Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Under 50k", min: 0, max: 50000 },
                  { label: "50k - 100k", min: 50000, max: 100000 },
                  { label: "100k - 200k", min: 100000, max: 200000 },
                  { label: "Above 200k", min: 200000, max: undefined },
                ].map(({ label, min, max }) => (
                  <Button
                    key={label}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        minPrice: min,
                        maxPrice: max,
                      }))
                    }
                    className={
                      localFilters.minPrice === min &&
                      localFilters.maxPrice === max
                        ? "bg-orange-50 border-orange-300 text-orange-700"
                        : ""
                    }
                    disabled={isLoading}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Apply Filters Button for Advanced */}
            <div className="flex justify-end">
              <Button
                onClick={handleApplyFilters}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isLoading}
              >
                Apply Advanced Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
