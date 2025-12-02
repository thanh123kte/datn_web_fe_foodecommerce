"use client";

import { useState } from "react";
import { Seller, SellerFilters, StoreStatus, OpenStatus } from "@/types/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SellerManagementProps {
  sellers: Seller[];
  loading?: boolean;
  onSellerClick?: (seller: Seller) => void;
  onStoreStatusChange?: (
    sellerId: number,
    storeId: number,
    status: StoreStatus
  ) => void;
  onFilterChange?: (filters: SellerFilters) => void;
}

export function SellerManagement({
  sellers,
  loading = false,
  onSellerClick,
  onStoreStatusChange,
  onFilterChange,
}: SellerManagementProps) {
  const [filters, setFilters] = useState<SellerFilters>({});
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleFilterChange = (newFilters: Partial<SellerFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleSort = (field: string) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  const getStatusBadgeColor = (status: StoreStatus) => {
    switch (status) {
      case StoreStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case StoreStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case StoreStatus.INACTIVE:
        return "bg-gray-100 text-gray-800";
      case StoreStatus.BANNED:
        return "bg-red-100 text-red-800";
      case StoreStatus.MAINTENANCE:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOpenStatusBadgeColor = (status: OpenStatus) => {
    return status === OpenStatus.OPEN
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
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

  const formatTime = (timeString?: string) => {
    if (!timeString) return "N/A";
    return timeString.slice(0, 5); // HH:MM format
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search sellers by name, store name, or email..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.store_status || ""}
              onChange={(e) =>
                handleFilterChange({
                  store_status: (e.target.value as StoreStatus) || undefined,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Store Status</option>
              <option value={StoreStatus.PENDING}>Pending</option>
              <option value={StoreStatus.ACTIVE}>Active</option>
              <option value={StoreStatus.INACTIVE}>Inactive</option>
              <option value={StoreStatus.BANNED}>Banned</option>
              <option value={StoreStatus.MAINTENANCE}>Maintenance</option>
            </select>
            <select
              value={filters.open_status || ""}
              onChange={(e) =>
                handleFilterChange({
                  open_status: (e.target.value as OpenStatus) || undefined,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Open Status</option>
              <option value={OpenStatus.OPEN}>Open</option>
              <option value={OpenStatus.CLOSED}>Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700">
                <button
                  onClick={() => handleSort("id")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  ID
                  {sortField === "id" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Seller Info
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Store Info
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Status
              </th>
              <th className="text-left p-4 font-medium text-gray-700">Hours</th>
              <th className="text-left p-4 font-medium text-gray-700">
                <button
                  onClick={() => handleSort("created_at")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Joined
                  {sortField === "created_at" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sellers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-500">
                  No sellers found
                </td>
              </tr>
            ) : (
              sellers.map((seller) => (
                <tr
                  key={seller.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSellerClick?.(seller)}
                >
                  <td className="p-4 font-medium">#{seller.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {seller.avatar_url ? (
                        <img
                          src={seller.avatar_url}
                          alt={seller.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                          {seller.full_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{seller.full_name}</div>
                        <div className="text-sm text-gray-600">
                          {seller.email}
                        </div>
                        <div className="text-sm text-gray-600">
                          {seller.phone || "No phone"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {seller.store ? (
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {seller.store.image_url && (
                            <img
                              src={seller.store.image_url}
                              alt={seller.store.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          {seller.store.name}
                        </div>
                        {seller.store.description && (
                          <div className="text-sm text-gray-600 truncate max-w-[200px]">
                            {seller.store.description}
                          </div>
                        )}
                        {seller.store.address && (
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            📍 {seller.store.address}
                          </div>
                        )}
                        {seller.store.phone && (
                          <div className="text-xs text-gray-500">
                            📞 {seller.store.phone}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">
                        No store registered
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <Badge
                        className={getStatusBadgeColor(
                          seller.store?.store_status || StoreStatus.PENDING
                        )}
                      >
                        {seller.store?.store_status || "No Store"}
                      </Badge>
                      {seller.store && (
                        <Badge
                          className={getOpenStatusBadgeColor(
                            seller.store.open_status
                          )}
                        >
                          {seller.store.open_status}
                        </Badge>
                      )}
                      <Badge
                        className={
                          seller.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {seller.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    {seller.store ? (
                      <div>
                        <div>🕘 {formatTime(seller.store.open_time)}</div>
                        <div>🕘 {formatTime(seller.store.close_time)}</div>
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {formatDate(seller.created_at)}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSellerClick?.(seller);
                        }}
                      >
                        View Details
                      </Button>
                      {seller.store &&
                        seller.store.store_status === StoreStatus.PENDING && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStoreStatusChange?.(
                                  seller.id,
                                  seller.store!.id,
                                  StoreStatus.ACTIVE
                                );
                              }}
                              className="text-xs"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStoreStatusChange?.(
                                  seller.id,
                                  seller.store!.id,
                                  StoreStatus.BANNED
                                );
                              }}
                              className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      {seller.store &&
                        seller.store.store_status !== StoreStatus.PENDING && (
                          <select
                            value={seller.store.store_status}
                            onChange={(e) => {
                              onStoreStatusChange?.(
                                seller.id,
                                seller.store!.id,
                                e.target.value as StoreStatus
                              );
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value={StoreStatus.ACTIVE}>Active</option>
                            <option value={StoreStatus.INACTIVE}>
                              Inactive
                            </option>
                            <option value={StoreStatus.BANNED}>Banned</option>
                            <option value={StoreStatus.MAINTENANCE}>
                              Maintenance
                            </option>
                          </select>
                        )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
