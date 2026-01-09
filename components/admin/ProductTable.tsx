"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  Shield,
  ShieldX,
  Loader2,
} from "lucide-react";
import {
  ProductResponseDto,
  ProductStatus,
  AdminStatus,
} from "@/lib/services/productService";

interface ProductTableProps {
  products: ProductResponseDto[];
  isLoading?: boolean;
  onView?: (product: ProductResponseDto) => void;
  onBan?: (product: ProductResponseDto) => void;
  onUnban?: (product: ProductResponseDto) => void;
  onManageImages?: (product: ProductResponseDto) => void;
  primaryImages?: Map<number, string>; // Map of productId to primary image URL
}

interface ProductFilters {
  search?: string;
  categoryId?: number;
  storeId?: number;
  adminStatus?: AdminStatus;
  sortBy?: "name" | "price" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

const getAdminStatusColor = (adminStatus: AdminStatus) => {
  switch (adminStatus) {
    case AdminStatus.ACTIVE:
      return "text-green-600 bg-green-50";
    case AdminStatus.BANNED:
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getAdminStatusIcon = (adminStatus: AdminStatus) => {
  switch (adminStatus) {
    case AdminStatus.ACTIVE:
      return <Shield className="w-4 h-4" />;
    case AdminStatus.BANNED:
      return <ShieldX className="w-4 h-4" />;
    default:
      return <Shield className="w-4 h-4" />;
  }
};

const getAdminStatusText = (adminStatus: AdminStatus) => {
  switch (adminStatus) {
    case AdminStatus.ACTIVE:
      return "Hoạt động";
    case AdminStatus.BANNED:
      return "Đã cấm";
    default:
      return "Không xác định";
  }
};

const getProductStatusText = (status: ProductStatus) => {
  switch (status) {
    case ProductStatus.AVAILABLE:
      return "Có sẵn";
    case ProductStatus.UNAVAILABLE:
      return "Không có sẵn";
    default:
      return "Không xác định";
  }
};

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading = false,
  onView,
  onBan,
  onUnban,
  onManageImages,
  primaryImages,
}) => {
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique categories and stores from products
  const categories = useMemo(() => {
    const uniqueCategories = new Map<number, string>();
    products.forEach((product) => {
      if (product.categoryId && product.categoryName) {
        uniqueCategories.set(product.categoryId, product.categoryName);
      }
    });
    return Array.from(uniqueCategories.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [products]);

  const stores = useMemo(() => {
    const uniqueStores = new Map<number, string>();
    products.forEach((product) => {
      if (product.storeName) {
        uniqueStores.set(product.storeId, product.storeName);
      }
    });
    return Array.from(uniqueStores.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          (product.description?.toLowerCase() || "").includes(searchLower) ||
          (product.categoryName?.toLowerCase() || "").includes(searchLower) ||
          (product.storeName?.toLowerCase() || "").includes(searchLower)
      );
    }

    // Admin status filter
    if (filters.adminStatus) {
      result = result.filter(
        (product) => product.adminStatus === filters.adminStatus
      );
    }

    // Category filter
    if (filters.categoryId) {
      result = result.filter(
        (product) => product.categoryId === filters.categoryId
      );
    }

    // Store filter
    if (filters.storeId) {
      result = result.filter((product) => product.storeId === filters.storeId);
    }

    // Sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        let aValue = a[filters.sortBy as keyof ProductResponseDto];
        let bValue = b[filters.sortBy as keyof ProductResponseDto];

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue! < bValue!) return filters.sortOrder === "asc" ? -1 : 1;
        if (aValue! > bValue!) return filters.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, filters]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={filters.search || ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.categoryId || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                categoryId: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Store Filter */}
          <select
            value={filters.storeId || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                storeId: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">Tất cả cửa hàng</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>

          {/* Admin Status Filter */}
          <select
            value={filters.adminStatus || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                adminStatus: (e.target.value as AdminStatus) || undefined,
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">Tất cả trạng thái</option>
            <option value={AdminStatus.ACTIVE}>Hoạt động</option>
            <option value={AdminStatus.BANNED}>Đã cấm</option>
          </select>

          {/* Sort */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-");
              setFilters({
                ...filters,
                sortBy: sortBy as ProductFilters["sortBy"],
                sortOrder: sortOrder as "asc" | "desc",
              });
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="updatedAt-desc">Cập nhật gần đây</option>
            <option value="createdAt-desc">Mới tạo gần đây</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="price-desc">Giá cao đến thấp</option>
          </select>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {isLoading
            ? "Đang tải..."
            : `Hiển thị ${paginatedProducts.length} trong số ${filteredProducts.length} sản phẩm`}
        </p>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cửa hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái quản trị
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex-shrink-0 h-16 w-16">
                        {primaryImages?.get(product.id) ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={primaryImages.get(product.id)}
                            alt={product.name}
                            className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/product-placeholder.jpg";
                            }}
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                            <span className="text-gray-400 text-xs">
                              Không có ảnh
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                            {product.description || "Không có mô tả"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.categoryName || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.storeName || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                      {product.discountPrice &&
                        product.discountPrice < product.price && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(product.discountPrice)}
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          product.status === ProductStatus.AVAILABLE
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getProductStatusText(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAdminStatusColor(
                          product.adminStatus
                        )}`}
                      >
                        {getAdminStatusIcon(product.adminStatus)}
                        <span className="ml-1">
                          {getAdminStatusText(product.adminStatus)}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView?.(product)}
                          className="p-2"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onManageImages?.(product)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                          title="Manage Images"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </Button> */}
                        {product.adminStatus === AdminStatus.ACTIVE ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onBan?.(product)}
                            className="p-2 text-red-600 hover:text-red-800"
                            title="Ban Product"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUnban?.(product)}
                            className="p-2 text-green-600 hover:text-green-800"
                            title="Unban Product"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Trang <span className="font-medium">{currentPage}</span> /{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-r-none"
                  >
                    Trước
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className="rounded-none"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-l-none"
                  >
                    Sau
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
