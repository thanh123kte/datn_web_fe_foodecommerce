"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, ImageIcon, Trash2 } from "lucide-react";
import { Product, ProductFormData } from "@/lib/mockData/products";
import { mockCategories } from "@/lib/mockData/categories";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
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
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    originalPrice: undefined,
    categoryId: "",
    images: [],
    status: "active",
    inventory: 0,
    tags: [],
    isFeature: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newTag, setNewTag] = useState("");

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
          inventory: product.inventory,
          tags: product.tags,
          isFeature: product.isFeature,
        });
      } else {
        setFormData({
          name: "",
          description: "",
          price: 0,
          originalPrice: undefined,
          categoryId: "",
          images: [],
          status: "active",
          inventory: 0,
          tags: [],
          isFeature: false,
        });
      }
      setErrors({});
      setNewImageUrl("");
      setNewTag("");
    }
  }, [product, isOpen]);

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
      newErrors.originalPrice =
        "Original price must be greater than current price";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (formData.inventory < 0) {
      newErrors.inventory = "Inventory cannot be negative";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
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
              {product ? "Edit Product" : "Add New Product"}
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
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter product name"
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
                    placeholder="Enter detailed product description"
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
                    Category *
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
                    disabled={isLoading}
                  >
                    <option value="">Select a category</option>
                    {mockCategories.map((category) => (
                      <option key={category.id} value={category.id}>
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
                      Price (VND) *
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
                      Original Price (VND)
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
                      placeholder="Optional"
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

                {/* Inventory */}
                <div>
                  <Label
                    htmlFor="inventory"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Inventory *
                  </Label>
                  <Input
                    id="inventory"
                    type="number"
                    value={formData.inventory}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        inventory: Number(e.target.value),
                      }))
                    }
                    placeholder="0"
                    className={errors.inventory ? "border-red-500" : ""}
                    disabled={isLoading}
                    min="0"
                  />
                  {errors.inventory && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.inventory}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Images */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Images *
                  </Label>

                  {/* Add Image */}
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                      disabled={isLoading}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddImage())
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddImage}
                      disabled={!newImageUrl.trim() || isLoading}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Image Preview */}
                  <div className="grid grid-cols-2 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDlWN0MxOSA1IDIxIDMgMTkgM0g1QzMgMyAzIDUgNSA1SDdWOUg5VjdIMTVWOUgxN1Y3SDE5VjlIMjFaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=";
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isLoading}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}

                    {formData.images.length === 0 && (
                      <div className="col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                          No images added yet
                        </p>
                      </div>
                    )}
                  </div>
                  {errors.images && (
                    <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tags
                  </Label>

                  {/* Add Tag */}
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Enter tag"
                      disabled={isLoading}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                      disabled={!newTag.trim() || isLoading}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Tags Display */}
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTag(tag)}
                          className="h-auto p-0 hover:bg-transparent text-gray-500 hover:text-red-500"
                          disabled={isLoading}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Status & Feature */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Status
                    </Label>
                    <div className="space-y-2">
                      {[
                        {
                          value: "active",
                          label: "Active",
                          description:
                            "Product is visible and available for purchase",
                        },
                        {
                          value: "inactive",
                          label: "Inactive",
                          description: "Product is hidden from customers",
                        },
                        {
                          value: "out_of_stock",
                          label: "Out of Stock",
                          description:
                            "Product is visible but not available for purchase",
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
                                  | "active"
                                  | "inactive"
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

                  {/* Featured */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.isFeature}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isFeature: e.target.checked,
                          }))
                        }
                        className="mt-1"
                        disabled={isLoading}
                      />
                      <div>
                        <span className="font-medium text-gray-900">
                          Featured Product
                        </span>
                        <p className="text-sm text-gray-600">
                          This product will be highlighted in featured sections
                        </p>
                      </div>
                    </label>
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
                    {product ? "Updating..." : "Creating..."}
                  </div>
                ) : product ? (
                  "Update Product"
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
