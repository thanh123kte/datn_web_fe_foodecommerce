"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Download,
  BarChart3,
  LineChart,
  AreaChart,
  Filter,
  RefreshCw,
} from "lucide-react";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ChartOptions {
  type: "line" | "bar" | "area";
  showRevenue: boolean;
  showOrders: boolean;
  showDiscount: boolean;
  showCommission: boolean;
}

export interface RevenueFiltersState extends DateRange, ChartOptions {
  reportType: "DAILY" | "WEEKLY" | "MONTHLY";
}

interface RevenueFiltersProps {
  filters: RevenueFiltersState;
  onFiltersChange: (filters: Partial<RevenueFiltersState>) => void;
  onRefresh?: () => void;
  onExport?: (format: "CSV" | "PDF") => void;
  loading?: boolean;
}

export const RevenueFilters: React.FC<RevenueFiltersProps> = ({
  filters,
  onFiltersChange,
  onRefresh,
  onExport,
  loading = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Quick date range presets
  const datePresets = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastQuarter = new Date(today);
    lastQuarter.setMonth(lastQuarter.getMonth() - 3);

    return [
      {
        label: "Today",
        startDate: today.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
      },
      {
        label: "Yesterday",
        startDate: yesterday.toISOString().split("T")[0],
        endDate: yesterday.toISOString().split("T")[0],
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
      {
        label: "Last 3 months",
        startDate: lastQuarter.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
      },
    ];
  }, []);

  const handleDatePreset = useCallback(
    (preset: (typeof datePresets)[0]) => {
      onFiltersChange({
        startDate: preset.startDate,
        endDate: preset.endDate,
      });
    },
    [onFiltersChange]
  );

  const handleDateChange = useCallback(
    (field: "startDate" | "endDate", value: string) => {
      onFiltersChange({ [field]: value });
    },
    [onFiltersChange]
  );

  const handleReportTypeChange = useCallback(
    (reportType: "DAILY" | "WEEKLY" | "MONTHLY") => {
      onFiltersChange({ reportType });
    },
    [onFiltersChange]
  );

  const handleChartTypeChange = useCallback(
    (type: "line" | "bar" | "area") => {
      onFiltersChange({ type });
    },
    [onFiltersChange]
  );

  const handleChartOptionChange = useCallback(
    (option: keyof ChartOptions, value: boolean) => {
      onFiltersChange({ [option]: value });
    },
    [onFiltersChange]
  );

  const chartTypeOptions = [
    {
      value: "line",
      label: "Line Chart",
      icon: <LineChart className="h-4 w-4" />,
    },
    {
      value: "bar",
      label: "Bar Chart",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      value: "area",
      label: "Area Chart",
      icon: <AreaChart className="h-4 w-4" />,
    },
  ];

  const reportTypeOptions = [
    { value: "DAILY", label: "Daily" },
    { value: "WEEKLY", label: "Weekly" },
    { value: "MONTHLY", label: "Monthly" },
  ];

  return (
    <div className="space-y-6">
      {/* Main Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-2" />
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Date Range */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="startDate" className="text-xs text-gray-600">
                  From
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                  max={filters.endDate}
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-xs text-gray-600">
                  To
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  min={filters.startDate}
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
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

          {/* Report Type */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Report Type</Label>
            <div className="flex gap-2">
              {reportTypeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    filters.reportType === option.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleReportTypeChange(option.value as any)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Chart Type */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Chart Type</Label>
            <div className="flex gap-2">
              {chartTypeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    filters.type === option.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleChartTypeChange(option.value as any)}
                  className="flex items-center gap-2"
                >
                  {option.icon}
                  <span className="hidden sm:inline">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Advanced Options */}
      {showAdvanced && (
        <Card className="p-6">
          <h4 className="text-md font-semibold mb-4">Chart Display Options</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showRevenue"
                checked={filters.showRevenue}
                onChange={(e) =>
                  handleChartOptionChange("showRevenue", e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="showRevenue" className="text-sm">
                Show Revenue
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showOrders"
                checked={filters.showOrders}
                onChange={(e) =>
                  handleChartOptionChange("showOrders", e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="showOrders" className="text-sm">
                Show Orders
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showDiscount"
                checked={filters.showDiscount}
                onChange={(e) =>
                  handleChartOptionChange("showDiscount", e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="showDiscount" className="text-sm">
                Show Discounts
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showCommission"
                checked={filters.showCommission}
                onChange={(e) =>
                  handleChartOptionChange("showCommission", e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="showCommission" className="text-sm">
                Show Commission
              </Label>
            </div>
          </div>

          {/* Export Options */}
          {onExport && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Label className="text-sm font-medium mb-3 block">
                Export Data
              </Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport("CSV")}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport("PDF")}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Active Filters Summary */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">
          {new Date(filters.startDate).toLocaleDateString("vi-VN")} -{" "}
          {new Date(filters.endDate).toLocaleDateString("vi-VN")}
        </Badge>
        <Badge variant="outline">{filters.reportType}</Badge>
        <Badge variant="outline">
          {chartTypeOptions.find((opt) => opt.value === filters.type)?.label}
        </Badge>
      </div>
    </div>
  );
};
