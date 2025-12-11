"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ReviewFilters } from "@/lib/services/storeReviewService";
import {
  Filter,
  Search,
  Star,
  Calendar,
  MessageCircle,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

interface ReviewFiltersProps {
  filters: ReviewFilters;
  onFiltersChange: (filters: Partial<ReviewFilters>) => void;
  onRefresh?: () => void;
  loading?: boolean;
  totalReviews?: number;
}

export const ReviewFiltersComponent: React.FC<ReviewFiltersProps> = ({
  filters,
  onFiltersChange,
  onRefresh,
  loading = false,
  totalReviews = 0,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");

  // Quick filter presets
  const ratingFilters = [
    { stars: [5], label: "5 sao", value: "5" },
    { stars: [4, 5], label: "4+ sao", value: "4+" },
    { stars: [3], label: "3 sao", value: "3" },
    { stars: [1, 2], label: "1-2 sao", value: "1-2" },
  ];

  const responseFilters = [
    { value: true, label: "Đã phản hồi", color: "bg-green-100 text-green-800" },
    {
      value: false,
      label: "Chưa phản hồi",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "highest", label: "Đánh giá cao nhất" },
    { value: "lowest", label: "Đánh giá thấp nhất" },
  ];

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onFiltersChange({ searchTerm });
    },
    [searchTerm, onFiltersChange]
  );

  const handleRatingFilter = useCallback(
    (stars: number[]) => {
      const isActive =
        filters.rating &&
        filters.rating.length === stars.length &&
        filters.rating.every((r) => stars.includes(r));

      onFiltersChange({
        rating: isActive ? undefined : stars,
      });
    },
    [filters.rating, onFiltersChange]
  );

  const handleResponseFilter = useCallback(
    (hasResponse: boolean) => {
      const isActive = filters.hasResponse === hasResponse;
      onFiltersChange({
        hasResponse: isActive ? undefined : hasResponse,
      });
    },
    [filters.hasResponse, onFiltersChange]
  );

  const handleDateRangeChange = useCallback(
    (field: "startDate" | "endDate", value: string) => {
      onFiltersChange({
        dateRange: {
          ...filters.dateRange,
          [field]: value,
        } as { startDate: string; endDate: string },
      });
    },
    [filters.dateRange, onFiltersChange]
  );

  const handleSortChange = useCallback(
    (sortBy: ReviewFilters["sortBy"]) => {
      onFiltersChange({ sortBy });
    },
    [onFiltersChange]
  );

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    onFiltersChange({
      rating: undefined,
      dateRange: undefined,
      hasResponse: undefined,
      searchTerm: "",
      sortBy: "newest",
    });
  }, [onFiltersChange]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.rating && filters.rating.length > 0) count++;
    if (filters.hasResponse !== undefined) count++;
    if (filters.dateRange) count++;
    if (filters.searchTerm) count++;
    return count;
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Main Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Filters</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Làm mới
              </Button>
            )}
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tìm kiếm</Label>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                placeholder="Tìm đánh giá hoặc khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Sort Options - Dropdown */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sắp xếp theo</Label>
            <div className="relative">
              <select
                value={filters.sortBy || "newest"}
                onChange={(e) =>
                  handleSortChange(e.target.value as ReviewFilters["sortBy"])
                }
                className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Rating Filter - Dropdown */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Lọc theo đánh giá</Label>
            <div className="relative">
              <select
                value={
                  filters.rating
                    ? ratingFilters.find(
                        (f) =>
                          f.stars.length === filters.rating?.length &&
                          f.stars.every((s) => filters.rating?.includes(s))
                      )?.value || ""
                    : ""
                }
                onChange={(e) => {
                  const selected = ratingFilters.find(
                    (f) => f.value === e.target.value
                  );
                  if (selected) {
                    handleRatingFilter(selected.stars);
                  } else {
                    onFiltersChange({ rating: undefined });
                  }
                }}
                className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
              >
                <option value="">Tất cả đánh giá</option>
                {ratingFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Label className="text-sm font-medium mb-3 block">
            Lọc theo ngày
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="startDate"
                className="text-xs text-gray-600 mb-1 block"
              >
                Từ ngày
              </Label>
              <Input
                id="startDate"
                type="date"
                value={filters.dateRange?.startDate || ""}
                onChange={(e) =>
                  handleDateRangeChange("startDate", e.target.value)
                }
                className="w-full"
              />
            </div>
            <div>
              <Label
                htmlFor="endDate"
                className="text-xs text-gray-600 mb-1 block"
              >
                Đến ngày
              </Label>
              <Input
                id="endDate"
                type="date"
                value={filters.dateRange?.endDate || ""}
                onChange={(e) =>
                  handleDateRangeChange("endDate", e.target.value)
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-6 space-y-4">
          {/* Response Status Filters */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Trạng thái phản hồi
            </Label>
            <div className="flex gap-2 flex-wrap">
              {responseFilters.map((filter) => {
                const isActive = filters.hasResponse === filter.value;

                return (
                  <Button
                    key={filter.value.toString()}
                    variant="outline"
                    size="sm"
                    onClick={() => handleResponseFilter(filter.value)}
                    className={isActive ? filter.color : ""}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {filter.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.rating && (
            <Badge variant="outline">
              Rating: {filters.rating.join(", ")} stars
            </Badge>
          )}
          {filters.hasResponse !== undefined && (
            <Badge variant="outline">
              {filters.hasResponse ? "Responded" : "Pending Response"}
            </Badge>
          )}
          {filters.dateRange && (
            <Badge variant="outline">
              {new Date(filters.dateRange.startDate).toLocaleDateString(
                "vi-VN"
              )}{" "}
              -{" "}
              {new Date(filters.dateRange.endDate).toLocaleDateString("vi-VN")}
            </Badge>
          )}
          {filters.searchTerm && (
            <Badge variant="outline">Search: "{filters.searchTerm}"</Badge>
          )}
        </div>
      )}
    </div>
  );
};
