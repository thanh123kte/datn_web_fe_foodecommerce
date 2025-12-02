"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ReviewFilters } from "@/lib/mockData/reviews";
import {
  Filter,
  Search,
  Star,
  Calendar,
  MessageCircle,
  RefreshCw,
  SortAsc,
  SortDesc,
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");

  // Quick filter presets
  const ratingFilters = [
    { stars: [5], label: "5 Stars", color: "bg-green-100 text-green-800" },
    { stars: [4, 5], label: "4+ Stars", color: "bg-blue-100 text-blue-800" },
    { stars: [3], label: "3 Stars", color: "bg-yellow-100 text-yellow-800" },
    { stars: [1, 2], label: "1-2 Stars", color: "bg-red-100 text-red-800" },
  ];

  const responseFilters = [
    { value: true, label: "Responded", color: "bg-green-100 text-green-800" },
    { value: false, label: "Pending", color: "bg-orange-100 text-orange-800" },
  ];

  const sortOptions = [
    {
      value: "newest",
      label: "Newest First",
      icon: <SortDesc className="h-4 w-4" />,
    },
    {
      value: "oldest",
      label: "Oldest First",
      icon: <SortAsc className="h-4 w-4" />,
    },
    {
      value: "highest_rating",
      label: "Highest Rating",
      icon: <Star className="h-4 w-4" />,
    },
    {
      value: "lowest_rating",
      label: "Lowest Rating",
      icon: <Star className="h-4 w-4" />,
    },
  ];

  // Date presets
  const datePresets = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    return [
      {
        label: "Today",
        startDate: today.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
      },
      {
        label: "Last 7 days",
        startDate: lastWeek.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
      },
      {
        label: "Last 30 days",
        startDate: lastMonth.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
      },
    ];
  }, []);

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

  const handleDatePreset = useCallback(
    (preset: (typeof datePresets)[0]) => {
      onFiltersChange({
        dateRange: {
          startDate: preset.startDate,
          endDate: preset.endDate,
        },
      });
    },
    [onFiltersChange]
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide" : "Show"} Advanced
            </Button>
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
                Refresh
              </Button>
            )}
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Search Reviews</Label>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                placeholder="Search reviews or customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Sort Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sort By</Label>
            <div className="flex gap-2 flex-wrap">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    filters.sortBy === option.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    handleSortChange(option.value as ReviewFilters["sortBy"])
                  }
                  className="flex items-center gap-2"
                >
                  {option.icon}
                  <span className="hidden sm:inline">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Stats</Label>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{totalReviews} Total</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {filters.sortBy} sort
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-6 space-y-4">
          {/* Rating Filters */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Filter by Rating
            </Label>
            <div className="flex gap-2 flex-wrap">
              {ratingFilters.map((filter, index) => {
                const isActive =
                  filters.rating &&
                  filters.rating.length === filter.stars.length &&
                  filters.rating.every((r) => filter.stars.includes(r));

                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRatingFilter(filter.stars)}
                    className={isActive ? filter.color : ""}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    {filter.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Response Status Filters */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Response Status
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

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card className="p-6">
          <h4 className="text-md font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range Filter
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Custom Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="startDate" className="text-xs text-gray-600">
                    From
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.dateRange?.startDate || ""}
                    onChange={(e) =>
                      handleDateRangeChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-xs text-gray-600">
                    To
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.dateRange?.endDate || ""}
                    onChange={(e) =>
                      handleDateRangeChange("endDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Date Presets</Label>
              <div className="flex gap-2 flex-wrap">
                {datePresets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDatePreset(preset)}
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

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
