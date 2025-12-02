"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Banner, BannerFilters, BannerStatus } from "@/types/promotion";

interface BannerTableProps {
  banners: Banner[];
  loading?: boolean;
  onBannerClick?: (banner: Banner) => void;
  onStatusChange?: (bannerId: number, status: BannerStatus) => void;
  onFilterChange?: (filters: BannerFilters) => void;
  showFilters?: boolean;
}

export function BannerTable({
  banners,
  loading = false,
  onBannerClick,
  onStatusChange,
  onFilterChange,
  showFilters = true,
}: BannerTableProps) {
  const [filters, setFilters] = useState<BannerFilters>({});
  const [sortField, setSortField] = useState<keyof Banner>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleFilterChange = (newFilters: Partial<BannerFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleSort = (field: keyof Banner) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  const getStatusBadgeClass = (status: BannerStatus) => {
    switch (status) {
      case BannerStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case BannerStatus.INACTIVE:
        return "bg-gray-100 text-gray-800";
      case BannerStatus.EXPIRED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search banners by title, description..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  handleFilterChange({
                    status: (e.target.value as BannerStatus) || undefined,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value={BannerStatus.ACTIVE}>Active</option>
                <option value={BannerStatus.INACTIVE}>Inactive</option>
                <option value={BannerStatus.EXPIRED}>Expired</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700">
                Banner
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                <button
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Title
                  {sortField === "title" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Description
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                <button
                  onClick={() => handleSort("created_at")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Created
                  {sortField === "created_at" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Status
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr
                key={banner.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onBannerClick?.(banner)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {banner.image_url ? (
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-banner.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-900">
                    {banner.title}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    {banner.description || "No description"}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <div className="font-medium">
                      {formatDate(banner.created_at)}
                    </div>
                    <div className="text-gray-600">
                      Updated: {formatDate(banner.updated_at)}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      banner.status
                    )}`}
                  >
                    {banner.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {onStatusChange && (
                      <>
                        {banner.status !== BannerStatus.ACTIVE && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(banner.id, BannerStatus.ACTIVE);
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            Activate
                          </Button>
                        )}
                        {banner.status !== BannerStatus.INACTIVE && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(banner.id, BannerStatus.INACTIVE);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            Deactivate
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {banners.length === 0 && (
        <div className="text-center py-8 text-gray-500">No banners found</div>
      )}
    </Card>
  );
}
