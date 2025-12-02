"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import DeleteProductModal from "@/components/products/DeleteProductModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Grid,
  List,
  Package,
  ShoppingCart,
  TrendingUp,
  Star,
  Eye,
  AlertTriangle,
} from "lucide-react";
import {
  Product,
  ProductFilters,
  getProductsAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
  ProductFormData,
} from "@/lib/mockData/products";
import ProductFormModal from "./components/ProductFormModal";
import ProductFilterPanel from "./components/ProductFilterPanel";

type ViewMode = "grid" | "table";

export default function ProductsPage() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Load products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProductsAPI(filters);
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    loadProducts();
  }, [filters]);

  // Handlers
  const handleCreateProduct = async (data: ProductFormData) => {
    setModalLoading(true);
    try {
      await createProductAPI(data);
      await loadProducts();
      setShowFormModal(false);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!selectedProduct) return;

    setModalLoading(true);
    try {
      await updateProductAPI(selectedProduct.id, data);
      await loadProducts();
      setShowFormModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setModalLoading(true);
    try {
      await deleteProductAPI(selectedProduct.id);
      await loadProducts();
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setShowFormModal(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleViewProduct = (productId: string) => {
    // TODO: Navigate to product detail page or open view modal
    console.log("View product:", productId);
  };

  // Calculate stats
  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    inactive: products.filter((p) => p.status === "inactive").length,
    outOfStock: products.filter((p) => p.status === "out_of_stock").length,
    featured: products.filter((p) => p.isFeature).length,
    totalSold: products.reduce((sum, p) => sum + p.sold, 0),
    totalInventory: products.reduce((sum, p) => sum + p.inventory, 0),
    avgRating:
      products.length > 0
        ? (
            products.reduce((sum, p) => sum + p.rating, 0) / products.length
          ).toFixed(1)
        : "0.0",
  };

  const lowStockProducts = products.filter(
    (p) => p.inventory <= 5 && p.status === "active"
  );

  return (
    <MainLayout userRole="seller">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Management
            </h1>
            <p className="text-gray-600">Manage your store's product catalog</p>
          </div>
          <Button
            onClick={() => setShowFormModal(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Products
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
                <p className="text-xs text-gray-500">
                  {stats.inactive} inactive, {stats.outOfStock} out of stock
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.totalSold}
                </p>
                <p className="text-xs text-gray-500">Items sold</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.avgRating}
                </p>
                <p className="text-xs text-gray-500">
                  {stats.featured} featured products
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">
                  Low Stock Alert
                </h3>
                <p className="text-sm text-yellow-700">
                  {lowStockProducts.length} products have 5 or fewer items in
                  stock
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, maxPrice: 5 })} // This is a workaround to show low stock
                className="ml-auto border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                View Products
              </Button>
            </div>
          </Card>
        )}

        {/* Filters */}
        <ProductFilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
          totalProducts={products.length}
          isLoading={loading}
        />

        {/* View Toggle */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Showing {products.length} products
              </span>
              {Object.values(filters).some(
                (v) => v !== undefined && v !== "" && v !== "all"
              ) && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Filtered
                </Badge>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 ${
                  viewMode === "table"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Content */}
        {loading ? (
          <Card className="p-12">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading products...</span>
            </div>
          </Card>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {Object.values(filters).some(
                (v) => v !== undefined && v !== "" && v !== "all"
              )
                ? "Try adjusting your filters or search terms"
                : "Create your first product to start selling"}
            </p>
            {!Object.values(filters).some(
              (v) => v !== undefined && v !== "" && v !== "all"
            ) && (
              <Button
                onClick={() => setShowFormModal(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Product
              </Button>
            )}
          </Card>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.images[0]}
                status={product.status}
                inventory={product.inventory}
                sold={product.sold}
                rating={product.rating}
                reviewCount={product.reviewCount}
                tags={product.tags}
                isFeature={product.isFeature}
                categoryName={product.categoryName}
                onView={handleViewProduct}
                onEdit={() => openEditModal(product)}
                onDelete={() => openDeleteModal(product)}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Product
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Category
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Price
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Stock
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Sales
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Rating
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-right py-4 px-6 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDlWN0MxOSA1IDIxIDMgMTkgM0g1QzMgMyAzIDUgNSA1SDdWOUg5VjdIMTVWOUgxN1Y3SDE5VjlIMjFaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=";
                            }}
                          />
                          <div>
                            <h3
                              className="font-medium text-gray-900 truncate max-w-xs"
                              title={product.name}
                            >
                              {product.name}
                            </h3>
                            {product.isFeature && (
                              <Badge className="bg-orange-100 text-orange-800 text-xs mt-1">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {product.categoryName}
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-medium text-gray-900">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product.price)}
                          </span>
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <div className="text-sm text-gray-500 line-through">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.originalPrice)}
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-medium ${
                            product.inventory <= 5
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {product.inventory}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {product.sold}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{product.rating}</span>
                          <span className="text-gray-500 text-sm">
                            ({product.reviewCount})
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          className={
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : product.status === "inactive"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {product.status === "active"
                            ? "Active"
                            : product.status === "inactive"
                            ? "Inactive"
                            : "Out of Stock"}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProduct(product.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(product)}
                          >
                            <Package className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(product)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedProduct(null);
        }}
        onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
        product={selectedProduct}
        isLoading={modalLoading}
      />

      <DeleteProductModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteProduct}
        product={selectedProduct}
        isLoading={modalLoading}
      />
    </MainLayout>
  );
}
