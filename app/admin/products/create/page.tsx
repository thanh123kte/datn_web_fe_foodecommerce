"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Minus,
  Save,
  Eye,
  AlertCircle,
} from "lucide-react";
import { ProductFormData } from "@/types/product";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    originalPrice: undefined,
    categoryId: "",
    stock: 0,
    images: [],
    tags: [],
    weight: undefined,
    dimensions: undefined,
    nutritionInfo: undefined,
    ingredients: [],
    allergens: [],
    expiryDate: "",
    isActive: true,
    isFeatured: false,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
  const [newAllergen, setNewAllergen] = useState("");

  // Mock categories
  const categories = [
    { id: "1", name: "Bánh mì" },
    { id: "2", name: "Phở" },
    { id: "3", name: "Bánh xèo" },
    { id: "4", name: "Bún" },
    { id: "5", name: "Cơm" },
    { id: "6", name: "Chè" },
    { id: "7", name: "Bánh ngọt" },
    { id: "8", name: "Đồ uống" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = [...imageFiles, ...files].slice(0, 5); // Limit to 5 images
    setImageFiles(newFiles);

    // Create previews
    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addIngredient = () => {
    if (
      newIngredient.trim() &&
      !formData.ingredients?.includes(newIngredient.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), newIngredient.trim()],
      }));
      setNewIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index) || [],
    }));
  };

  const addAllergen = () => {
    if (
      newAllergen.trim() &&
      !formData.allergens?.includes(newAllergen.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        allergens: [...(prev.allergens || []), newAllergen.trim()],
      }));
      setNewAllergen("");
    }
  };

  const removeAllergen = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to create product
      console.log("Creating product:", formData);
      console.log("Image files:", imageFiles);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate back to products list
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDiscountPrice = () => {
    if (formData.originalPrice && formData.originalPrice > formData.price) {
      const discount =
        ((formData.originalPrice - formData.price) / formData.originalPrice) *
        100;
      return Math.round(discount);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Thêm sản phẩm mới
          </h1>
          <p className="text-gray-600">Tạo sản phẩm mới trong hệ thống</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin cơ bản
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Tên sản phẩm *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả *</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Nhập mô tả sản phẩm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Danh mục *</Label>
                  <select
                    id="category"
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Giá bán
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Giá bán *</Label>
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
                    min="0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="originalPrice">Giá gốc (tùy chọn)</Label>
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
                    placeholder="0"
                    min="0"
                  />
                  {calculateDiscountPrice() > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Giảm giá {calculateDiscountPrice()}%
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Images */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Hình ảnh sản phẩm
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    Tải lên hình ảnh
                  </Label>
                  <p className="text-sm text-gray-500">Tối đa 5 hình ảnh</p>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thẻ sản phẩm
              </h2>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nhập thẻ mới"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type="button" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Inventory */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Kho hàng
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="stock">Số lượng tồn kho *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock: Number(e.target.value),
                      }))
                    }
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Trọng lượng (gram)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        weight: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        expiryDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </Card>

            {/* Status */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Trạng thái
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Kích hoạt sản phẩm</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <Label htmlFor="isFeatured">Sản phẩm nổi bật</Label>
                </div>
              </div>
            </Card>

            {/* Ingredients */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thành phần
              </h2>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Nhập thành phần"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addIngredient())
                    }
                  />
                  <Button type="button" onClick={addIngredient} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.ingredients && formData.ingredients.length > 0 && (
                  <div className="space-y-2">
                    {formData.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm">{ingredient}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Allergens */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Chất gây dị ứng
              </h2>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newAllergen}
                    onChange={(e) => setNewAllergen(e.target.value)}
                    placeholder="Nhập chất gây dị ứng"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addAllergen())
                    }
                  />
                  <Button type="button" onClick={addAllergen} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.allergens && formData.allergens.length > 0 && (
                  <div className="space-y-2">
                    {formData.allergens.map((allergen, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-red-50 rounded"
                      >
                        <span className="text-sm text-red-800">{allergen}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAllergen(index)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                Sản phẩm sẽ được gửi để duyệt sau khi tạo
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                <Eye className="w-4 h-4 mr-2" />
                Xem trước
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Đang tạo..." : "Tạo sản phẩm"}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
