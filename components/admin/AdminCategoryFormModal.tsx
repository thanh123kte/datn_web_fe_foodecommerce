/**
 * Admin Category Form Modal with Image Upload
 * Reuses image logic from Seller Profile
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { Category } from "@/types/category";

export interface AdminCategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
  imageFile?: File;
}

interface AdminCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdminCategoryFormData) => Promise<void>;
  category?: Category | null;
  isLoading?: boolean;
}

export function AdminCategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category,
  isLoading = false,
}: AdminCategoryFormModalProps) {
  const [formData, setFormData] = useState<AdminCategoryFormData>({
    name: "",
    description: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  // Initialize form data when modal opens or category changes
  useEffect(() => {
    if (!isOpen) return;

    const initializeForm = () => {
      if (category) {
        setFormData({
          name: category.name,
          description: category.description,
          isActive: category.is_active,
        });
      } else {
        setFormData({
          name: "",
          description: "",
          isActive: true,
        });
      }
      setSelectedImageFile(null);
      setErrors({});
    };

    initializeForm();
  }, [isOpen, category]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Category name must not exceed 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.trim().length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData: AdminCategoryFormData = {
      ...formData,
      imageFile: selectedImageFile || undefined,
    };

    await onSubmit(submitData);
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: "",
        description: "",
        isActive: true,
      });
      setSelectedImageFile(null);
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {category ? "Edit Category" : "Add New Category"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Category Image
              </Label>
              <ImageUploadField
                currentImageUrl={category?.image_url}
                fallbackImage="/images/default-category.png"
                onImageSelect={(file) => setSelectedImageFile(file)}
                onImageClear={() => setSelectedImageFile(null)}
                disabled={isLoading}
                label="Category Image"
                helperText="Click to upload category image"
                shape="square"
                size={{ width: 150, height: 150 }}
                maxSizeMB={5}
              />
            </div>

            {/* Name */}
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Category Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter category name"
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
                Description *
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
                placeholder="Enter category description"
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

            {/* Status */}
            <div>
              <Label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Status
              </Label>
              <select
                id="status"
                value={formData.isActive ? "active" : "inactive"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.value === "active",
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {category ? "Updating..." : "Creating..."}
                  </div>
                ) : category ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
