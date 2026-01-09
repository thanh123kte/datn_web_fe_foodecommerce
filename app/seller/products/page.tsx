"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import DeleteProductModal from "@/components/products/DeleteProductModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus,
  Grid,
  List,
  Package,
  TrendingUp,
  Image,
  Trash2,
} from "lucide-react";
import {
  ProductFilters,
  Product as UiProduct,
  ProductFormData,
} from "@/lib/mockData/products";
import ProductFormModal from "./components/ProductFormModal";
import ProductFilterPanel from "./components/ProductFilterPanel";
import AdminProductFormModal from "@/components/admin/AdminProductFormModal";
import {
  productService,
  ProductResponseDto,
  ProductStatus,
} from "@/lib/services/productService";
import { productImageService } from "@/lib/services/productImageService";
import { buildAbsoluteUrl } from "@/lib/config/env";

type ViewMode = "grid" | "table";
type Product = UiProduct;

export default function ProductsPage() {
  const { currentStore, userRole, refreshStore } = useAuth();
  const storeId = currentStore?.id;

  // State
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<UiProduct | null>(
    null
  );
  const [selectedProductForImages, setSelectedProductForImages] =
    useState<ProductResponseDto | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Load products
  const loadProducts = async () => {
    if (!storeId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data: ProductResponseDto[] = await productService.getByStore(
        storeId
      );

      // Load images for all products in parallel
      const productsWithImages = await Promise.all(
        data.map(async (p) => {
          try {
            const images = await productImageService.getByProductId(p.id);
            const primaryImage = images.find((img) => img.isPrimary);
            // Prepend backend URL if imageUrl is a relative path
            const fullImageUrl = primaryImage?.imageUrl
              ? buildAbsoluteUrl(primaryImage.imageUrl)
              : "";
            return {
              product: p,
              imageUrl: fullImageUrl,
            };
          } catch (error) {
            console.error(`Error loading images for product ${p.id}:`, error);
            return {
              product: p,
              imageUrl: "",
            };
          }
        })
      );

      // Map backend DTO to UI-friendly shape; fill missing fields with safe defaults
      const mapped: UiProduct[] = productsWithImages.map(
        ({ product: p, imageUrl }) => ({
          id: String(p.id),
          name: p.name,
          description: p.description || "",
          price: p.discountPrice ? Number(p.discountPrice) : 0, // Giá giảm
          originalPrice: Number(p.price), // Giá gốc (luôn có)
          categoryId: String(p.storeCategoryId ?? p.categoryId ?? ""),
          categoryName:
            p.storeCategoryName || p.categoryName || "Chưa phân loại",
          images: imageUrl ? [imageUrl] : [],
          status: p.status === "UNAVAILABLE" ? "UNAVAILABLE" : "AVAILABLE",
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })
      );

      // Simple client filters (reuse existing UI filters)
      const filtered = mapped.filter((product) => {
        const matchesSearch = filters.search
          ? product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(filters.search.toLowerCase())
          : true;

        const matchesCategory = filters.categoryId
          ? product.categoryId === filters.categoryId
          : true;

        const matchesStatus =
          filters.status && filters.status !== "all"
            ? product.status === filters.status
            : true;

        return matchesSearch && matchesCategory && matchesStatus;
      });

      setProducts(filtered);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    loadProducts();
  }, [filters, storeId]);

  useEffect(() => {
    if (userRole === "SELLER" && !storeId) {
      refreshStore();
    }
  }, [userRole, storeId, refreshStore]);

  // Handlers
  const handleCreateProduct = async (data: ProductFormData, files: File[]) => {
    if (!storeId) {
      console.error("Store ID not available");
      return;
    }

    setModalLoading(true);
    try {
      const createData = {
        storeId: storeId,
        storeCategoryId: Number(data.categoryId),
        name: data.name,
        description: data.description,
        price: data.originalPrice!, // Giá gốc (bắt buộc)
        discountPrice: data.price > 0 ? data.price : undefined, // Giá giảm (optional)
        status:
          data.status === "AVAILABLE"
            ? ProductStatus.AVAILABLE
            : ProductStatus.UNAVAILABLE,
      };

      // Tạo sản phẩm
      const createdProduct = await productService.create(createData);

      // Upload ảnh nếu có - sử dụng add-more API
      if (files.length > 0) {
        await productImageService.addMore(createdProduct.id, files);
      }

      await loadProducts();
      setShowFormModal(false);
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      alert("Không thể tạo sản phẩm. Vui lòng thử lại.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateProduct = async (data: ProductFormData, files: File[]) => {
    if (!selectedProduct) return;

    setModalLoading(true);
    try {
      const updateData = {
        storeCategoryId: Number(data.categoryId),
        name: data.name,
        description: data.description,
        price: data.originalPrice!, // Giá gốc (bắt buộc)
        discountPrice: data.price > 0 ? data.price : undefined, // Giá giảm (optional)
        status:
          data.status === "AVAILABLE"
            ? ProductStatus.AVAILABLE
            : ProductStatus.UNAVAILABLE,
      };

      await productService.update(Number(selectedProduct.id), updateData);

      // Upload ảnh mới nếu có - không cần vì ProductFormModal đã xử lý
      // Các ảnh đã được upload qua add-more API trong modal
      if (files.length > 0) {
        await productImageService.addMore(Number(selectedProduct.id), files);
      }

      await loadProducts();
      setShowFormModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Không thể cập nhật sản phẩm. Vui lòng thử lại.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setModalLoading(true);
    try {
      await productService.softDelete(Number(selectedProduct.id));

      // Remove from local state immediately
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== selectedProduct.id)
      );

      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Không thể xóa sản phẩm. Vui lòng thử lại.");
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

  const handleManageImages = async (productId: string) => {
    // Tìm product từ danh sách
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Lấy full product data từ API
    try {
      const productData = await productService.getById(Number(productId));
      setSelectedProductForImages(productData);
      setShowImageModal(true);
    } catch (error) {
      console.error("Error loading product:", error);
      alert("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedProductForImages(null);
  };

  const handleRefreshProducts = () => {
    loadProducts();
  };

  // Calculate stats
  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "AVAILABLE").length,
    inactive: products.filter((p) => p.status === "UNAVAILABLE").length,
  };

  return (
    <MainLayout userRole="seller">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản Lý Sản Phẩm
            </h1>
            <p className="text-gray-600">
              Quản lý danh mục sản phẩm của cửa hàng
            </p>
          </div>
          <Button
            onClick={() => setShowFormModal(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm Sản Phẩm
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng Sản Phẩm
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
                  Sản Phẩm Hoạt Động
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
                <p className="text-xs text-gray-500">
                  {stats.inactive} ngừng hoạt động
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Image className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

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
                Hiển thị {products.length} sản phẩm
              </span>
              {Object.values(filters).some(
                (v) => v !== undefined && v !== "" && v !== "all"
              ) && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Đã Lọc
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
              <span className="ml-3 text-gray-600">Đang tải sản phẩm...</span>
            </div>
          </Card>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600 mb-6">
              {Object.values(filters).some(
                (v) => v !== undefined && v !== "" && v !== "all"
              )
                ? "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
                : "Tạo sản phẩm đầu tiên để bắt đầu bán hàng"}
            </p>
            {!Object.values(filters).some(
              (v) => v !== undefined && v !== "" && v !== "all"
            ) && (
              <Button
                onClick={() => setShowFormModal(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-5 h-5 mr-2" />
                Thêm Sản Phẩm Đầu Tiên
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
                categoryName={product.categoryName}
                onManageImages={() => handleManageImages(product.id)}
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
                      Sản Phẩm
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Danh Mục
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Giá
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Trạng Thái
                    </th>
                    <th className="text-right py-4 px-6 font-medium text-gray-700">
                      Hành Động
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
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const placeholder =
                                  document.createElement("div");
                                placeholder.className =
                                  "w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center";
                                placeholder.innerHTML =
                                  '<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                                target.parentElement?.insertBefore(
                                  placeholder,
                                  target
                                );
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3
                              className="font-medium text-gray-900 truncate max-w-xs"
                              title={product.name}
                            >
                              {product.name}
                            </h3>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {product.categoryName}
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          {product.price > 0 ? (
                            <>
                              <span className="font-medium text-red-600">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.price)}
                              </span>
                              <div className="text-sm text-gray-500 line-through">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.originalPrice!)}
                              </div>
                            </>
                          ) : (
                            <span className="font-medium text-gray-900">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(product.originalPrice!)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          className={
                            product.status === "AVAILABLE"
                              ? "bg-green-100 text-green-800"
                              : product.status === "UNAVAILABLE"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {product.status === "AVAILABLE"
                            ? "Hoạt Động"
                            : product.status === "UNAVAILABLE"
                            ? "Tạm Ngưng"
                            : "Hết Hàng"}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManageImages(product.id)}
                            title="Quản lý ảnh"
                          >
                            <Image className="w-4 h-4" />
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
                            <Trash2 className="w-4 h-4" />
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
        product={selectedProduct || undefined}
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

      {/* Image Management Modal */}
      <AdminProductFormModal
        isOpen={showImageModal}
        onClose={closeImageModal}
        product={selectedProductForImages}
        onRefresh={handleRefreshProducts}
      />
    </MainLayout>
  );
}
