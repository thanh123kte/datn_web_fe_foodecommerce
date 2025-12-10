"use client";

import { useState } from "react";
import { Driver, DriverFilters, VerificationStatus } from "@/types/driver";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { resolveAvatarUrl } from "@/lib/utils/imageUtils";

interface DriverTableProps {
  drivers: Driver[];
  loading?: boolean;
  onDriverClick?: (driver: Driver) => void;
  onVerificationAction?: (
    driverId: number,
    action: "approve" | "reject",
    reason?: string
  ) => void;
  onFilterChange?: (filters: DriverFilters) => void;
  showFilters?: boolean;
}

export function DriverTable({
  drivers,
  loading = false,
  onDriverClick,
  onVerificationAction,
  onFilterChange,
  showFilters = true,
}: DriverTableProps) {
  const [filters, setFilters] = useState<DriverFilters>({});
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleFilterChange = (newFilters: Partial<DriverFilters>) => {
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

  const getVerificationBadgeColor = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case VerificationStatus.APPROVED:
        return "bg-green-100 text-green-800";
      case VerificationStatus.REJECTED:
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
      {showFilters && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Tìm kiếm theo tên, số điện thoại hoặc bằng lái..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.verification_status || ""}
                onChange={(e) =>
                  handleFilterChange({
                    verification_status:
                      (e.target.value as VerificationStatus) || undefined,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả trạng thái xác minh</option>
                <option value={VerificationStatus.PENDING}>Chờ xác minh</option>
                <option value={VerificationStatus.APPROVED}>Đã xác minh</option>
                <option value={VerificationStatus.REJECTED}>Đã từ chối</option>
              </select>

              <select
                value={
                  filters.verified === undefined
                    ? ""
                    : filters.verified.toString()
                }
                onChange={(e) =>
                  handleFilterChange({
                    verified:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả trạng thái hoạt động</option>
                <option value="true">Hoạt động</option>
                <option value="false">Không hoạt động</option>
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
                Thông tin tài xế
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Phương tiện
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Giấy tờ
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Xác minh
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                <button
                  onClick={() => handleSort("created_at")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Ngày tham gia
                  {sortField === "created_at" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">
                  Không tìm thấy tài xế nào
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => onDriverClick?.(driver)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveAvatarUrl(
                          driver.avatar_url,
                          driver.full_name
                        )}
                        alt={driver.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{driver.full_name}</div>
                        <div className="text-sm text-gray-600">
                          📞 {driver.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{driver.vehicle_type}</div>
                      <div className="text-sm text-gray-600">
                        🏷️ {driver.vehicle_plate}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="space-y-1">
                      <div>🆔 {driver.cccd_number}</div>
                      <div>📄 {driver.license_number}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <Badge
                        className={getVerificationBadgeColor(
                          driver.verification_status
                        )}
                      >
                        {driver.verification_status ===
                        VerificationStatus.PENDING
                          ? "Chờ xác minh"
                          : driver.verification_status ===
                            VerificationStatus.APPROVED
                          ? "Đã xác minh"
                          : "Đã từ chối"}
                      </Badge>
                      <Badge
                        className={
                          driver.verified
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {driver.verified ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {formatDate(driver.created_at)}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDriverClick?.(driver);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                      {driver.verification_status ===
                        VerificationStatus.PENDING && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={(e) => {
                              e.stopPropagation();
                              onVerificationAction?.(driver.id, "approve");
                            }}
                            className="text-xs"
                          >
                            Phê duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              const reason = prompt("Lý do từ chối:");
                              if (reason) {
                                onVerificationAction?.(
                                  driver.id,
                                  "reject",
                                  reason
                                );
                              }
                            }}
                            className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Từ chối
                          </Button>
                        </div>
                      )}
                      {driver.verification_status ===
                        VerificationStatus.APPROVED && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            const reason = prompt("Lý do đình chỉ:");
                            if (reason) {
                              onVerificationAction?.(
                                driver.id,
                                "reject",
                                reason
                              );
                            }
                          }}
                          className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Đình chỉ
                        </Button>
                      )}
                      {driver.verification_status ===
                        VerificationStatus.REJECTED && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={(e) => {
                            e.stopPropagation();
                            onVerificationAction?.(driver.id, "approve");
                          }}
                          className="text-xs"
                        >
                          Kích hoạt lại
                        </Button>
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
