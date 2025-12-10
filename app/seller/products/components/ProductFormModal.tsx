"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X, Upload, ImageIcon, Trash2 } from "lucide-react";
import { Product, ProductFormData } from "@/lib/mockData/products";
import {
  storeCategoryService,
  StoreCategory,
} from "@/lib/services/storeCategoryService";
import { productImageService } from "@/lib/services/productImageService";
import { useAuth } from "@/contexts/AuthContext";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData, files: File[]) => void;
  product?: Product;
  isLoading?: boolean;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  isLoading = false,
}: ProductFormModalProps) {
  const { currentStore } = useAuth();
  const storeId = currentStore?.id;

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    originalPrice: undefined,
    categoryId: "",
    images: [],
    status: "AVAILABLE",
    inventory: 0,
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<
    Array<{
      id: number;
      url: string;
      isPrimary: boolean;
    }>
  >([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [isDeletingImages, setIsDeletingImages] = useState(false);

  // Define functions before useEffect to avoid hoisting issues
  const loadCategories = useCallback(async () => {
    if (!storeId) return;

    setLoadingCategories(true);
    try {
      const data = await storeCategoryService.getByStoreId(storeId);
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, [storeId]);

  const loadExistingImages = useCallback(async (productId: number) => {
    setLoadingImages(true);
    try {
      const images = await productImageService.getByProductId(productId);
      // Sort: primary image first, then by display order
      const sortedImages = images
        .sort((a, b) => {
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return a.displayOrder - b.displayOrder;
        })
        .map((img) => ({
          id: img.id,
          url: img.imageUrl.startsWith("http")
            ? img.imageUrl
            : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${
                img.imageUrl.startsWith("/") ? "" : "/"
              }${img.imageUrl}`,
          isPrimary: img.isPrimary,
        }));
      setExistingImages(sortedImages);
    } catch (error) {
      console.error("Error loading images:", error);
      setExistingImages([]);
    } finally {
      setLoadingImages(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          categoryId: product.categoryId,
          images: product.images,
          status: product.status,
          inventory: 0,
          tags: [],
        });
      } else {
        setFormData({
          name: "",
          description: "",
          price: 0,
          originalPrice: undefined,
          categoryId: "",
          images: [],
          status: "AVAILABLE",
          inventory: 0,
          tags: [],
        });
      }
      setErrors({});
      setSelectedFiles([]);
      setPreviewUrls([]);
      setImagesToDelete([]);

      // Load categories
      if (storeId) {
        loadCategories();
      }

      // Load existing images if editing product
      if (product && product.id) {
        loadExistingImages(Number(product.id));
      } else {
        setExistingImages([]);
      }
    }
  }, [product, isOpen, storeId, loadCategories, loadExistingImages]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.originalPrice && formData.originalPrice <= formData.price) {
      newErrors.originalPrice = "Giá giảm phải nhỏ hơn giá gốc";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }

    // Check images - for new product: must have new files
    // For edit product: must have existing images or new files
    const totalImages =
      existingImages.length - imagesToDelete.length + selectedFiles.length;
    if (!product && selectedFiles.length === 0) {
      newErrors.images = "Cần ít nhất một hình ảnh";
    } else if (product && totalImages === 0) {
      newErrors.images = "Sản phẩm phải có ít nhất một hình ảnh";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Delete marked images first
    if (imagesToDelete.length > 0) {
      setIsDeletingImages(true);
      try {
        await Promise.all(
          imagesToDelete.map((imageId) => productImageService.delete(imageId))
        );
        console.log(`Deleted ${imagesToDelete.length} images`);
      } catch (error) {
        console.error("Error deleting images:", error);
        setErrors((prev) => ({
          ...prev,
          images: "Đã xảy ra lỗi khi xóa ảnh. Vui lòng thử lại.",
        }));
        setIsDeletingImages(false);
        return;
      } finally {
        setIsDeletingImages(false);
      }
    }

    // If editing product and has new images, use add-more API
    if (product && product.id && selectedFiles.length > 0) {
      setIsDeletingImages(true);
      try {
        await productImageService.addMore(Number(product.id), selectedFiles);
        console.log(`Added ${selectedFiles.length} new images`);
        // Clear selected files after successful upload
        setSelectedFiles([]);
        setPreviewUrls([]);
      } catch (error) {
        console.error("Error adding images:", error);
        setErrors((prev) => ({
          ...prev,
          images: "Đã xảy ra lỗi khi thêm ảnh. Vui lòng thử lại.",
        }));
        setIsDeletingImages(false);
        return;
      } finally {
        setIsDeletingImages(false);
      }
      // Pass empty files array since we already uploaded via add-more API
      onSubmit(formData, []);
    } else {
      // For new product or edit without new images, pass files normally
      onSubmit(formData, selectedFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveFile = (index: number) => {
    // Revoke object URL to free memory
    URL.revokeObjectURL(previewUrls[index]);

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageId: number) => {
    setImagesToDelete((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Tên Sản Phẩm *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Nhập tên sản phẩm"
                    className={errors.name ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Mô Tả *
                  </Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Nhập mô tả chi tiết sản phẩm"
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <Label
                    htmlFor="categoryId"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Danh Mục *
                  </Label>
                  <select
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.categoryId ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isLoading || loadingCategories}
                  >
                    <option value="">
                      {loadingCategories ? "Đang tải..." : "Chọn danh mục"}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={String(category.id)}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.categoryId}
                    </p>
                  )}
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="price"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      Giá Gốc (VND) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: Number(e.target.value),
                        }))
                      }
                      placeholder="0"
                      className={errors.price ? "border-red-500" : ""}
                      disabled={isLoading}
                      min="0"
                    />
                    {formData.price > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatPrice(formData.price)} VND
                      </p>
                    )}
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="originalPrice"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      Giá Giảm (VND)
                    </Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={formData.originalPrice || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          originalPrice: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }))
                      }
                      placeholder="Không bắt buộc"
                      className={errors.originalPrice ? "border-red-500" : ""}
                      disabled={isLoading}
                      min="0"
                    />
                    {formData.originalPrice && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatPrice(formData.originalPrice)} VND
                      </p>
                    )}
                    {errors.originalPrice && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.originalPrice}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Images */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Images *
                  </Label>

                  {/* Upload Image File */}
                  <div className="mb-3">
                    <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                      <Upload className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Chọn hình ảnh từ máy
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        disabled={isLoading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Preview */}
                  {loadingImages ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {/* Hiển thị ảnh hiện có từ backend (nếu edit) */}
                      {existingImages.map((image) => (
                        <div
                          key={`existing-${image.id}`}
                          className={`relative group rounded-lg overflow-hidden ${
                            image.isPrimary ? "ring-2 ring-blue-500" : ""
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.url}
                            alt="Product image"
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/product-placeholder.jpg";
                            }}
                          />
                          {/* Primary Badge */}
                          {image.isPrimary && (
                            <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                              Ảnh Chính
                            </div>
                          )}
                          {/* Delete Button */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveExistingImage(image.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                            disabled={isLoading}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}

                      {/* Preview các file mới chọn */}
                      {previewUrls.map((url, index) => (
                        <div
                          key={`new-${index}`}
                          className="relative group rounded-lg overflow-hidden border-2 border-green-500"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`New ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Mới
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                            disabled={isLoading}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}

                      {/* Empty state */}
                      {existingImages.length === 0 &&
                        previewUrls.length === 0 && (
                          <div className="col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">
                              Chưa có hình ảnh nào
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                  {errors.images && (
                    <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                  )}
                </div>

                {/* Status & Feature */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Trạng Thái
                    </Label>
                    <div className="space-y-2">
                      {[
                        {
                          value: "AVAILABLE",
                          label: "Còn Hàng",
                          description: "Sản phẩm hiển thị và sẵn sàng bán",
                        },
                        {
                          value: "UNAVAILABLE",
                          label: "Hết Hàng",
                          description: "Sản phẩm tạm thời không còn",
                        },
                      ].map(({ value, label, description }) => (
                        <label
                          key={value}
                          className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="status"
                            value={value}
                            checked={formData.status === value}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                status: e.target.value as
                                  | "AVAILABLE"
                                  | "UNAVAILABLE"
                                  | "out_of_stock",
                              }))
                            }
                            className="mt-1"
                            disabled={isLoading}
                          />
                          <div>
                            <span className="font-medium text-gray-900">
                              {label}
                            </span>
                            <p className="text-sm text-gray-600">
                              {description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isLoading || isDeletingImages}
              >
                {isLoading || isDeletingImages ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isDeletingImages
                      ? imagesToDelete.length > 0
                        ? "Đang xóa ảnh..."
                        : "Đang thêm ảnh..."
                      : product
                      ? "Đang cập nhật..."
                      : "Đang tạo..."}
                  </div>
                ) : product ? (
                  "Cập Nhật"
                ) : (
                  "Tạo Sản Phẩm"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
