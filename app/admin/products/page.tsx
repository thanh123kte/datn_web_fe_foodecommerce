"use client";

import React, { useState, useEffect } from "react";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductStatsComponent } from "@/components/admin/ProductStats";
import { ProductDetailModal } from "@/components/admin/ProductDetailModal";
import {
  ProductResponseDto,
  productService,
  AdminStatus,
} from "@/lib/services/productService";
import { productImageService } from "@/lib/services/productImageService";
import { buildAbsoluteUrl } from "@/lib/config/env";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponseDto | null>(null);
  const [selectedProductImages, setSelectedProductImages] = useState<string[]>(
    []
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [primaryImages, setPrimaryImages] = useState<Map<number, string>>(
    new Map()
  );

  // Fetch all products and their primary images
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getAll();
        setProducts(data);

        // Fetch primary images for all products
        const imageMap = new Map<number, string>();
        await Promise.all(
          data.map(async (product) => {
            try {
              const images = await productImageService.getByProductId(
                product.id
              );
              const primaryImage = images.find((img) => img.isPrimary);
              if (primaryImage) {
                imageMap.set(
                  product.id,
                  buildAbsoluteUrl(primaryImage.imageUrl) || ""
                );
              }
            } catch (error) {
              console.error(
                `Failed to fetch images for product ${product.id}:`,
                error
              );
            }
          })
        );
        setPrimaryImages(imageMap);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [refreshKey]);

  const handleView = async (product: ProductResponseDto) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);

    // Fetch product images with primary image first
    try {
      const images = await productImageService.getByProductId(product.id);
      // Sort images: primary first, then by display order
      const sortedImages = images
        .sort((a, b) => {
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return a.displayOrder - b.displayOrder;
        })
        .map((img) => buildAbsoluteUrl(img.imageUrl) || "");

      setSelectedProductImages(sortedImages);
    } catch (error) {
      console.error("Failed to fetch product images:", error);
      setSelectedProductImages([]);
    }
  };

  const handleBan = async (product: ProductResponseDto) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn cấm sản phẩm "${product.name}"?`)
    ) {
      try {
        await productService.updateAdminStatus(product.id, AdminStatus.BANNED);
        setRefreshKey((prev) => prev + 1);
        if (isDetailModalOpen) {
          closeDetailModal();
        }
      } catch (error) {
        console.error("Failed to ban product:", error);
        alert("Không thể cấm sản phẩm. Vui lòng thử lại.");
      }
    }
  };

  const handleUnban = async (product: ProductResponseDto) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn bỏ cấm sản phẩm "${product.name}"?`)
    ) {
      try {
        await productService.updateAdminStatus(product.id, AdminStatus.ACTIVE);
        setRefreshKey((prev) => prev + 1);
        if (isDetailModalOpen) {
          closeDetailModal();
        }
      } catch (error) {
        console.error("Failed to unban product:", error);
        alert("Không thể bỏ cấm sản phẩm. Vui lòng thử lại.");
      }
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
    setSelectedProductImages([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-1">
            Quản lý tất cả sản phẩm trong hệ thống
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <ProductStatsComponent products={products} isLoading={isLoading} />

      {/* Products Table */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        onView={handleView}
        onBan={handleBan}
        onUnban={handleUnban}
        primaryImages={primaryImages}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        images={selectedProductImages}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        onBan={handleBan}
        onUnban={handleUnban}
      />
    </div>
  );
}
