"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  ChartData,
  formatCurrency,
  formatNumber,
} from "@/lib/mockData/revenue";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

interface RevenueChartProps {
  data: ChartData[];
  loading?: boolean;
  chartType?: "line" | "bar" | "area";
  showRevenue?: boolean;
  showOrders?: boolean;
  showDiscount?: boolean;
  showCommission?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">
          {new Date(label || "").toLocaleDateString("vi-VN", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
            </div>
            <span className="font-medium text-gray-900">
              {entry.name === "Orders"
                ? formatNumber(entry.value)
                : formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  loading = false,
  chartType = "line",
  showRevenue = true,
  showOrders = true,
  showDiscount = true,
  showCommission = false,
}) => {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data]);

  const chartConfig = useMemo(() => {
    const config: Array<{
      key: string;
      name: string;
      color: string;
      show: boolean;
      yAxis?: string;
    }> = [];

    if (showRevenue) {
      config.push({
        key: "revenue",
        name: "Revenue",
        color: "#3B82F6",
        show: true,
      });
    }
    if (showOrders) {
      config.push({
        key: "orders",
        name: "Orders",
        color: "#10B981",
        show: true,
        yAxis: "right",
      });
    }
    if (showDiscount) {
      config.push({
        key: "discount",
        name: "Discount",
        color: "#EF4444",
        show: true,
      });
    }
    if (showCommission) {
      config.push({
        key: "commission",
        name: "Commission",
        color: "#F59E0B",
        show: true,
      });
    }

    return config;
  }, [showRevenue, showOrders, showDiscount, showCommission]);

  const formatYAxis = (value: number, key?: string) => {
    if (key === "orders") {
      return formatNumber(value);
    }
    return formatCurrency(value);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="w-40 h-6 bg-gray-200 rounded"></div>
            <div className="flex gap-4">
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-full h-80 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => formatYAxis(value)}
            />
            {showOrders && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={(value) => formatYAxis(value, "orders")}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {chartConfig.map(
              (config) =>
                config.show && (
                  <Bar
                    key={config.key}
                    yAxisId={config.yAxis || "left"}
                    dataKey={config.key}
                    name={config.name}
                    fill={config.color}
                    radius={[4, 4, 0, 0]}
                  />
                )
            )}
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              {chartConfig.map(
                (config) =>
                  config.show && (
                    <linearGradient
                      key={config.key}
                      id={`color-${config.key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={config.color}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={config.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  )
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => formatYAxis(value)}
            />
            {showOrders && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={(value) => formatYAxis(value, "orders")}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {chartConfig.map(
              (config) =>
                config.show && (
                  <Area
                    key={config.key}
                    yAxisId={config.yAxis || "left"}
                    type="monotone"
                    dataKey={config.key}
                    name={config.name}
                    stroke={config.color}
                    fill={`url(#color-${config.key})`}
                    strokeWidth={2}
                  />
                )
            )}
          </AreaChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => formatYAxis(value)}
            />
            {showOrders && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={(value) => formatYAxis(value, "orders")}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {chartConfig.map(
              (config) =>
                config.show && (
                  <Line
                    key={config.key}
                    yAxisId={config.yAxis || "left"}
                    type="monotone"
                    dataKey={config.key}
                    name={config.name}
                    stroke={config.color}
                    strokeWidth={3}
                    dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
                  />
                )
            )}
          </LineChart>
        );
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Revenue Overview
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Showing last {data.length} days</span>
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
