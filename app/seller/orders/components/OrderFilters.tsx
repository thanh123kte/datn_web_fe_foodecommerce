"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Calendar, RefreshCw } from "lucide-react";
import { OrderStatus, PaymentStatus } from "@/lib/mockData/orders";

interface OrderFilters {
  search: string;
  status: OrderStatus | "ALL";
  paymentStatus: PaymentStatus | "ALL";
  dateFrom: string;
  dateTo: string;
  sortBy: "createdAt" | "totalAmount" | "customerName";
  order: "asc" | "desc";
}

interface OrderFiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  onApply: () => void;
  isLoading?: boolean;
  className?: string;
}

const ORDER_STATUS_OPTIONS = [
  { value: "ALL" as const, label: "All Status", count: 0 },
  { value: "PENDING" as OrderStatus, label: "Pending", count: 0 },
  { value: "CONFIRMED" as OrderStatus, label: "Confirmed", count: 0 },
  { value: "PREPARING" as OrderStatus, label: "Preparing", count: 0 },
  { value: "SHIPPING" as OrderStatus, label: "Shipping", count: 0 },
  { value: "DELIVERED" as OrderStatus, label: "Delivered", count: 0 },
  { value: "CANCELLED" as OrderStatus, label: "Cancelled", count: 0 },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "ALL" as const, label: "All Payment Status" },
  { value: "PENDING" as PaymentStatus, label: "Payment Pending" },
  { value: "SUCCESS" as PaymentStatus, label: "Payment Success" },
  { value: "FAILED" as PaymentStatus, label: "Payment Failed" },
];

const SORT_OPTIONS = [
  { value: "createdAt" as const, label: "Order Date" },
  { value: "totalAmount" as const, label: "Total Amount" },
  { value: "customerName" as const, label: "Customer Name" },
];

export default function OrderFilters({
  filters,
  onFiltersChange,
  onApply,
  isLoading = false,
  className = "",
}: OrderFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof OrderFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: "",
      status: "ALL",
      paymentStatus: "ALL",
      dateFrom: "",
      dateTo: "",
      sortBy: "createdAt",
      order: "desc",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status !== "ALL" ||
    filters.paymentStatus !== "ALL" ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className={className}>
      {/* Quick Search and Status Filter */}
      <Card className="p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by order ID, customer name, phone, or product..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  Active
                </Badge>
              )}
            </Button>

            <Button
              onClick={onApply}
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>

        {/* Status Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          {ORDER_STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilter("status", option.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.status === option.value
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              disabled={isLoading}
            >
              {option.label}
              {option.count > 0 && (
                <span className="ml-1 text-xs opacity-75">
                  ({option.count})
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Advanced Filters */}
      {isExpanded && (
        <Card className="p-4 mb-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Payment Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) =>
                    updateFilter("paymentStatus", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                >
                  {PAYMENT_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter("dateFrom", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter("dateTo", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter("sortBy", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={isLoading}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      updateFilter(
                        "order",
                        filters.order === "asc" ? "desc" : "asc"
                      )
                    }
                    className={`px-3 py-2 border rounded-lg transition-colors ${
                      filters.order === "desc"
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    disabled={isLoading}
                    title={
                      filters.order === "desc" ? "Descending" : "Ascending"
                    }
                  >
                    {filters.order === "desc" ? "↓" : "↑"}
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={resetFilters}
                disabled={isLoading || !hasActiveFilters}
              >
                Reset Filters
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsExpanded(false)}>
                  Close
                </Button>
                <Button
                  onClick={onApply}
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
