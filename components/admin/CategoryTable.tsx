"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category, CategoryFilters } from "@/types/category";

interface CategoryTableProps {
  categories: Category[];
  loading?: boolean;
  onCategoryClick?: (category: Category) => void;
  onStatusChange?: (categoryId: number, isActive: boolean) => void;
  onFilterChange?: (filters: CategoryFilters) => void;
  showFilters?: boolean;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function CategoryTable({
  categories,
  loading = false,
  onCategoryClick,
  onStatusChange,
  onFilterChange,
  showFilters = true,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const [filters, setFilters] = useState<CategoryFilters>({});
  const [sortField, setSortField] = useState<keyof Category>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleFilterChange = (newFilters: Partial<CategoryFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleSort = (field: keyof Category) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  const getStatusBadgeClass = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
                placeholder="Tìm kiếm danh mục theo tên hoặc mô tả..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={
                  filters.is_active === undefined
                    ? ""
                    : filters.is_active.toString()
                }
                onChange={(e) =>
                  handleFilterChange({
                    is_active:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Hoạt động</option>
                <option value="false">Không hoạt động</option>
              </select>
              <select
                value={filters.sort_by || "created_at"}
                onChange={(e) =>
                  handleFilterChange({
                    sort_by: e.target.value as CategoryFilters["sort_by"],
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created_at">Sắp xếp theo ngày tạo</option>
                <option value="name">Sắp xếp theo tên</option>
                <option value="products_count">Sắp xếp theo số sản phẩm</option>
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
                Danh mục
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Tên
                  {sortField === "name" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">Mô tả</th>
              <th className="text-left p-4 font-medium text-gray-700">
                <button
                  onClick={() => handleSort("products_count")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Sản phẩm
                  {sortField === "products_count" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                <button
                  onClick={() => handleSort("created_at")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Ngày tạo
                  {sortField === "created_at" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Trạng thái
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onCategoryClick?.(category)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-category.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Không có ảnh
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-900">
                    {category.name}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    {category.description}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-blue-600">
                      {category.products_count || 0}
                    </span>
                    <span className="text-sm text-gray-500">sản phẩm</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-600">
                    {formatDate(category.created_at)}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      category.is_active
                    )}`}
                  >
                    {category.is_active ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(category);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Sửa
                      </Button>
                    )}
                    {onStatusChange && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(category.id, !category.is_active);
                        }}
                        className={
                          category.is_active
                            ? "text-red-600 hover:text-red-700"
                            : "text-green-600 hover:text-green-700"
                        }
                      >
                        {category.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(category);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy danh mục nào
        </div>
      )}
    </Card>
  );
}
