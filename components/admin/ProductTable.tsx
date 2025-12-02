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
  Star,
  Shield,
  ShieldX,
} from "lucide-react";
import { Product, ProductFilters, AdminStatus } from "@/types/product";

interface ProductTableProps {
  onView?: (product: Product) => void;
  onBan?: (product: Product) => void;
  onUnban?: (product: Product) => void;
}

// Mock data với cấu trúc mới
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Bánh mì thịt nướng",
    description: "Bánh mì thơm ngon với thịt nướng và rau sống tươi",
    price: 25000,
    images: ["/images/banh-mi-1.jpg", "/images/banh-mi-2.jpg"],
    categoryId: "1",
    categoryName: "Bánh mì",
    sellerId: "1",
    sellerName: "Quán Bánh Mì Sài Gòn",
    rating: 4.5,
    reviewCount: 28,
    admin_status: AdminStatus.NORMAL,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  },
  {
    id: "2",
    name: "Phở bò đặc biệt",
    description: "Phở bò nước trong, thịt mềm, bánh phở tươi",
    price: 45000,
    images: ["/images/pho-bo-1.jpg"],
    categoryId: "2",
    categoryName: "Phở",
    sellerId: "2",
    sellerName: "Phở Hà Nội Truyền Thống",
    rating: 4.8,
    reviewCount: 42,
    admin_status: AdminStatus.NORMAL,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-22T12:00:00Z",
  },
  {
    id: "3",
    name: "Bánh xèo miền Tây",
    description: "Bánh xèo giòn tan với tôm tươi và thịt heo",
    price: 35000,
    images: ["/images/banh-xeo-1.jpg"],
    categoryId: "3",
    categoryName: "Bánh xèo",
    sellerId: "3",
    sellerName: "Quán Ăn Miền Tây",
    rating: 4.2,
    reviewCount: 15,
    admin_status: AdminStatus.BANNED,
    createdAt: "2024-01-18T14:00:00Z",
    updatedAt: "2024-01-18T14:00:00Z",
  },
  {
    id: "4",
    name: "Bún chả Hà Nội",
    description: "Bún chả thơm phức với chả nướng và nước chấm đậm đà",
    price: 40000,
    images: ["/images/bun-cha-1.jpg"],
    categoryId: "4",
    categoryName: "Bún",
    sellerId: "4",
    sellerName: "Bún Chả Cô Ba",
    rating: 4.7,
    reviewCount: 58,
    admin_status: AdminStatus.NORMAL,
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-21T16:45:00Z",
  },
  {
    id: "5",
    name: "Cơm tấm sườn nướng",
    description: "Cơm tấm với sườn nướng, chả trứng và nước mắm pha",
    price: 38000,
    images: ["/images/com-tam-1.jpg"],
    categoryId: "5",
    categoryName: "Cơm",
    sellerId: "5",
    sellerName: "Cơm Tấm Sài Gòn",
    rating: 4.6,
    reviewCount: 87,
    admin_status: AdminStatus.BANNED,
    createdAt: "2024-01-08T09:00:00Z",
    updatedAt: "2024-01-19T13:20:00Z",
  },
];

// Mock categories và sellers
const mockCategories = [
  { id: "1", name: "Bánh mì" },
  { id: "2", name: "Phở" },
  { id: "3", name: "Bánh xèo" },
  { id: "4", name: "Bún" },
  { id: "5", name: "Cơm" },
];

const mockSellers = [
  { id: "1", name: "Quán Bánh Mì Sài Gòn" },
  { id: "2", name: "Phở Hà Nội Truyền Thống" },
  { id: "3", name: "Quán Ăn Miền Tây" },
  { id: "4", name: "Bún Chả Cô Ba" },
  { id: "5", name: "Cơm Tấm Sài Gòn" },
];

const getAdminStatusColor = (adminStatus: AdminStatus) => {
  switch (adminStatus) {
    case AdminStatus.NORMAL:
      return "text-green-600 bg-green-50";
    case AdminStatus.BANNED:
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getAdminStatusIcon = (adminStatus: AdminStatus) => {
  switch (adminStatus) {
    case AdminStatus.NORMAL:
      return <Shield className="w-4 h-4" />;
    case AdminStatus.BANNED:
      return <ShieldX className="w-4 h-4" />;
    default:
      return <Shield className="w-4 h-4" />;
  }
};

const getAdminStatusText = (adminStatus: AdminStatus) => {
  switch (adminStatus) {
    case AdminStatus.NORMAL:
      return "Normal";
    case AdminStatus.BANNED:
      return "Banned";
    default:
      return "Unknown";
  }
};

export const ProductTable: React.FC<ProductTableProps> = ({
  onView,
  onBan,
  onUnban,
}) => {
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.categoryName.toLowerCase().includes(searchLower) ||
          product.sellerName.toLowerCase().includes(searchLower)
      );
    }

    // Admin status filter
    if (filters.adminStatus) {
      result = result.filter(
        (product) => product.admin_status === filters.adminStatus
      );
    }

    // Category filter
    if (filters.categoryId) {
      result = result.filter(
        (product) => product.categoryId === filters.categoryId
      );
    }

    // Seller filter
    if (filters.sellerId) {
      result = result.filter(
        (product) => product.sellerId === filters.sellerId
      );
    }

    // Sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        let aValue = a[filters.sortBy as keyof Product];
        let bValue = b[filters.sortBy as keyof Product];

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue! < bValue!) return filters.sortOrder === "asc" ? -1 : 1;
        if (aValue! > bValue!) return filters.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [filters]);

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Product Management
          </h2>
          <p className="text-gray-600">Manage all products in the system</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
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
                categoryId: e.target.value || undefined,
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All categories</option>
            {mockCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Seller Filter */}
          <select
            value={filters.sellerId || ""}
            onChange={(e) =>
              setFilters({ ...filters, sellerId: e.target.value || undefined })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All stores</option>
            {mockSellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
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
          >
            <option value="">All admin status</option>
            <option value={AdminStatus.NORMAL}>Normal</option>
            <option value={AdminStatus.BANNED}>Banned</option>
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
            <option value="updatedAt-desc">Recently updated</option>
            <option value="createdAt-desc">Recently created</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
            <option value="rating-desc">Highest rating</option>
          </select>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
          products
        </p>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={
                            product.images[0] ||
                            "https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=Product"
                          }
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=Product";
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.categoryName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.sellerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPrice(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {product.rating}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviewCount})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAdminStatusColor(
                        product.admin_status
                      )}`}
                    >
                      {getAdminStatusIcon(product.admin_status)}
                      <span className="ml-1">
                        {getAdminStatusText(product.admin_status)}
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
                      {product.admin_status === AdminStatus.NORMAL ? (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
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
                    Previous
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
                    Next
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
