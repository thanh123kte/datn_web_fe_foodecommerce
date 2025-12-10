"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, ImageIcon, Trash2 } from "lucide-react";
import {
  ProductResponseDto,
  ProductStatus,
  AdminStatus,
} from "@/lib/services/productService";
import { productImageService } from "@/lib/services/productImageService";
import { buildAbsoluteUrl } from "@/lib/config/env";

interface AdminProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductResponseDto | null;
  onRefresh: () => void;
}

export default function AdminProductFormModal({
  isOpen,
  onClose,
  product,
  onRefresh,
}: AdminProductFormModalProps) {
  const [existingImages, setExistingImages] = useState<
    Array<{ id: number; url: string; isPrimary: boolean }>
  >([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  const loadExistingImages = useCallback(async () => {
    if (!product) return;

    setLoadingImages(true);
    try {
      const images = await productImageService.getByProductId(product.id);
      const imageData = images.map((img) => ({
        id: img.id,
        url: buildAbsoluteUrl(img.imageUrl) || "",
        isPrimary: img.isPrimary,
      }));

      // Sort: primary image first
      imageData.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));

      setExistingImages(imageData);
    } catch (error) {
      console.error("Error loading images:", error);
      setExistingImages([]);
    } finally {
      setLoadingImages(false);
    }
  }, [product]);

  // Load existing images when modal opens
  useEffect(() => {
    if (isOpen && product) {
      loadExistingImages();
    } else {
      // Reset state when modal closes
      setExistingImages([]);
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  }, [isOpen, product, loadExistingImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert(`${file.name} exceeds 5MB size limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveNewFile = (index: number) => {
    // Revoke object URL to free memory
    URL.revokeObjectURL(previewUrls[index]);

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = async (imageId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this image? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await productImageService.delete(imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      alert("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleSetPrimaryImage = async (imageId: number) => {
    if (!product) return;

    try {
      await productImageService.setPrimary(imageId);
      // Update local state
      setExistingImages((prev) =>
        prev
          .map((img) => ({
            ...img,
            isPrimary: img.id === imageId,
          }))
          .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
      );
      alert("Primary image updated successfully");
    } catch (error) {
      console.error("Error setting primary image:", error);
      alert("Failed to set primary image. Please try again.");
    }
  };

  const handleUploadNewImages = async () => {
    if (!product || selectedFiles.length === 0) {
      alert("Please select images to upload");
      return;
    }

    setLoading(true);
    try {
      await productImageService.uploadMultiple(product.id, selectedFiles);

      // Cleanup preview URLs
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setPreviewUrls([]);

      // Reload images
      await loadExistingImages();

      alert("Images uploaded successfully");
      onRefresh();
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Product Images
              </h2>
              <p className="text-sm text-gray-600 mt-1">{product.name}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Product Info Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Product ID:</span>{" "}
                <span className="text-gray-900">{product.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>{" "}
                <Badge
                  className={
                    product.status === ProductStatus.AVAILABLE
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {product.status}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-gray-700">Store:</span>{" "}
                <span className="text-gray-900">
                  {product.storeName || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Admin Status:</span>{" "}
                <Badge
                  className={
                    product.adminStatus === AdminStatus.ACTIVE
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {product.adminStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Existing Images Section */}
          <div className="mb-8">
            <Label className="text-lg font-semibold text-gray-900 mb-4 block">
              Existing Images ({existingImages.length})
            </Label>

            {loadingImages ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : existingImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group border-2 rounded-lg overflow-hidden"
                    style={{
                      borderColor: image.isPrimary ? "#10b981" : "#e5e7eb",
                    }}
                  >
                    <img
                      src={image.url}
                      alt={`Product image ${image.id}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/product-placeholder.jpg";
                      }}
                    />

                    {/* Primary Badge */}
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        PRIMARY
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      {!image.isPrimary && (
                        <Button
                          size="sm"
                          onClick={() => handleSetPrimaryImage(image.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Set Primary
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleRemoveExistingImage(image.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>

          {/* Upload New Images Section */}
          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-4 block">
              Upload New Images
            </Label>

            {/* File Input */}
            <div className="mb-4">
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Select images to upload (Max 5MB per file)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview New Images */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {previewUrls.map((url, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={url}
                      alt={`New ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border-2 border-blue-500"
                    />
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      NEW
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleRemoveNewFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {selectedFiles.length > 0 && (
              <div className="flex justify-end">
                <Button
                  onClick={handleUploadNewImages}
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    `Upload ${selectedFiles.length} image${
                      selectedFiles.length > 1 ? "s" : ""
                    }`
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t mt-8">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
