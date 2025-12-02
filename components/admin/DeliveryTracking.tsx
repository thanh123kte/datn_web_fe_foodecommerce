"use client";

import { useState } from "react";
import {
  DeliveryWithDetails,
  DeliveryStatus,
  DeliveryFilters,
} from "@/types/driver";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface DeliveryTrackingProps {
  deliveries: DeliveryWithDetails[];
  loading?: boolean;
  onDeliveryClick?: (delivery: DeliveryWithDetails) => void;
  onStatusUpdate?: (deliveryId: number, status: DeliveryStatus) => void;
  onFilterChange?: (filters: DeliveryFilters) => void;
}

export function DeliveryTracking({
  deliveries,
  loading = false,
  onDeliveryClick,
  onStatusUpdate,
  onFilterChange,
}: DeliveryTrackingProps) {
  const [filters, setFilters] = useState<DeliveryFilters>({});
  const [sortField, setSortField] = useState<string>("started_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleFilterChange = (newFilters: Partial<DeliveryFilters>) => {
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

  const getStatusBadgeColor = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.ASSIGNED:
        return "bg-blue-100 text-blue-800";
      case DeliveryStatus.PICKED_UP:
        return "bg-yellow-100 text-yellow-800";
      case DeliveryStatus.DELIVERING:
        return "bg-orange-100 text-orange-800";
      case DeliveryStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case DeliveryStatus.RETURNED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.ASSIGNED:
        return "📋";
      case DeliveryStatus.PICKED_UP:
        return "📦";
      case DeliveryStatus.DELIVERING:
        return "🚚";
      case DeliveryStatus.COMPLETED:
        return "✅";
      case DeliveryStatus.RETURNED:
        return "↩️";
      default:
        return "❓";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDistance = (distanceKm: number) => {
    return `${distanceKm.toFixed(1)} km`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getDeliveryDuration = (startedAt?: string, completedAt?: string) => {
    if (!startedAt) return "Not started";
    if (!completedAt) {
      const now = new Date();
      const started = new Date(startedAt);
      const diffMs = now.getTime() - started.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minutes ago`;
    }
    const started = new Date(startedAt);
    const completed = new Date(completedAt);
    const diffMs = completed.getTime() - started.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins} minutes`;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
              placeholder="Search by order ID, driver, or customer..."
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
                  status: (e.target.value as DeliveryStatus) || undefined,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value={DeliveryStatus.ASSIGNED}>Assigned</option>
              <option value={DeliveryStatus.PICKED_UP}>Picked Up</option>
              <option value={DeliveryStatus.DELIVERING}>Delivering</option>
              <option value={DeliveryStatus.COMPLETED}>Completed</option>
              <option value={DeliveryStatus.RETURNED}>Returned</option>
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
                  onClick={() => handleSort("order_id")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Order
                  {sortField === "order_id" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Driver
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Customer & Store
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Delivery Info
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Status
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Duration
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-500">
                  No deliveries found
                </td>
              </tr>
            ) : (
              deliveries.map((delivery) => (
                <tr
                  key={delivery.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => onDeliveryClick?.(delivery)}
                >
                  <td className="p-4">
                    <div>
                      <div className="font-medium">#{delivery.order_id}</div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(delivery.order.total_amount)}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {delivery.driver.avatar_url ? (
                        <img
                          src={delivery.driver.avatar_url}
                          alt={delivery.driver.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium">
                          {delivery.driver.full_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-sm">
                          {delivery.driver.full_name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {delivery.driver.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="text-sm">
                        <strong>Customer:</strong>{" "}
                        {delivery.order.customer_name}
                      </div>
                      <div className="text-sm">
                        <strong>Store:</strong> {delivery.order.store_name}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1 text-sm">
                      <div>
                        📍 <strong>From:</strong>{" "}
                        {delivery.order.pickup_address}
                      </div>
                      <div>
                        🏠 <strong>To:</strong>{" "}
                        {delivery.order.delivery_address}
                      </div>
                      <div className="text-blue-600">
                        📏 {formatDistance(delivery.distance_km)}
                      </div>
                      {delivery.order.expected_delivery_time && (
                        <div className="text-orange-600">
                          ⏰ Expected:{" "}
                          {formatDate(delivery.order.expected_delivery_time)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusBadgeColor(delivery.status)}>
                      <span className="mr-1">
                        {getStatusIcon(delivery.status)}
                      </span>
                      {delivery.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="space-y-1">
                      {delivery.started_at && (
                        <div>Started: {formatDate(delivery.started_at)}</div>
                      )}
                      {delivery.completed_at && (
                        <div>
                          Completed: {formatDate(delivery.completed_at)}
                        </div>
                      )}
                      <div className="font-medium text-blue-600">
                        {getDeliveryDuration(
                          delivery.started_at,
                          delivery.completed_at
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeliveryClick?.(delivery);
                        }}
                      >
                        View Details
                      </Button>
                      {delivery.status !== DeliveryStatus.COMPLETED &&
                        delivery.status !== DeliveryStatus.RETURNED && (
                          <select
                            value={delivery.status}
                            onChange={(e) => {
                              onStatusUpdate?.(
                                delivery.id,
                                e.target.value as DeliveryStatus
                              );
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value={DeliveryStatus.ASSIGNED}>
                              Assigned
                            </option>
                            <option value={DeliveryStatus.PICKED_UP}>
                              Picked Up
                            </option>
                            <option value={DeliveryStatus.DELIVERING}>
                              Delivering
                            </option>
                            <option value={DeliveryStatus.COMPLETED}>
                              Completed
                            </option>
                            <option value={DeliveryStatus.RETURNED}>
                              Returned
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
