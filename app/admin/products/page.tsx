"use client";

import React, { useState } from "react";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductStatsComponent } from "@/components/admin/ProductStats";
import { ProductDetailModal } from "@/components/admin/ProductDetailModal";
import { Product } from "@/types/product";

export default function AdminProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleBan = (product: Product) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn cấm sản phẩm "${product.name}"?`)
    ) {
      console.log("Banning product:", product.id);
      // TODO: Call API to ban product
      // API call: PUT /api/admin/products/{id}/ban
    }
  };

  const handleUnban = (product: Product) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn bỏ cấm sản phẩm "${product.name}"?`)
    ) {
      console.log("Unbanning product:", product.id);
      // TODO: Call API to unban product
      // API call: PUT /api/admin/products/{id}/unban
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <ProductStatsComponent />

      {/* Products Table */}
      <ProductTable
        onView={handleView}
        onBan={handleBan}
        onUnban={handleUnban}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        onBan={handleBan}
        onUnban={handleUnban}
      />
    </div>
  );
}
