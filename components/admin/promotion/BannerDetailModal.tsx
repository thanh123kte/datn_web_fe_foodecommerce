"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banner, BannerFormData, BannerStatus } from "@/types/promotion";
import { Upload, X } from "lucide-react";
import { bannerService } from "@/lib/services/bannerService";
import { toast } from "sonner";
import { buildAbsoluteUrl } from "@/lib/utils";

interface BannerDetailModalProps {
  banner: Banner | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: Banner, file?: File) => void;
  onStatusChange?: (bannerId: number, status: BannerStatus) => void;
  isCreateMode?: boolean;
}

export function BannerDetailModal({
  banner,
  isOpen,
  onClose,
  onSave,
  onStatusChange,
  isCreateMode = false,
}: BannerDetailModalProps) {
  const [formData, setFormData] = useState<BannerFormData>({
    title: "",
    imageUrl: "",
    description: "",
    status: BannerStatus.ACTIVE,
    startDate: null,
    endDate: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        imageUrl: banner.imageUrl || "",
        description: banner.description || "",
        status: banner.status,
        startDate: banner.startDate || null,
        endDate: banner.endDate || null,
      });
      setImagePreview(banner.imageUrl || "");
      setSelectedFile(null); // Reset selected file when viewing existing banner
    } else if (isCreateMode) {
      setFormData({
        title: "",
        imageUrl: "",
        description: "",
        status: BannerStatus.ACTIVE,
        startDate: null,
        endDate: null,
      });
      setImagePreview("");
      setSelectedFile(null);
    }
  }, [banner, isCreateMode]);

  const handleInputChange = (field: keyof BannerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "imageUrl") {
      setImagePreview(value);
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file phải nhỏ hơn 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.imageUrl && !selectedFile && !banner?.imageUrl) {
      newErrors.imageUrl = "Hình ảnh là bắt buộc";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const updatedBanner: Banner = {
        ...banner,
        id: banner?.id || 0,
        title: formData.title,
        imageUrl: formData.imageUrl || "",
        description: formData.description || "",
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        createdAt: banner?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Pass selectedFile to parent for handling
      await onSave(updatedBanner, selectedFile || undefined);
      onClose();
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Không thể lưu banner");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    setImagePreview("/placeholder-banner.jpg");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isCreateMode ? "Tạo Banner Mới" : "Chi Tiết Banner"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Banner Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="block mb-2">Xem Trước Banner</Label>
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
              {imagePreview ? (
                <>
                  <img
                    src={
                      selectedFile
                        ? imagePreview
                        : buildAbsoluteUrl(imagePreview)
                    }
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setSelectedFile(null);
                      handleInputChange("imageUrl", "");
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div>Chưa có hình ảnh</div>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="imageFile">Tải Ảnh Lên</Label>
            <div className="mt-1">
              <label
                htmlFor="imageFile"
                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Upload className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {selectedFile
                    ? selectedFile.name
                    : "Chọn file ảnh hoặc kéo thả vào đây"}
                </span>
              </label>
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Kích thước tối đa: 5MB. Định dạng hỗ trợ: JPG, PNG, WebP
            </p>
          </div>

          {/* Basic Information */}
          <div>
            <Label htmlFor="title">Tiêu Đề *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Nhập tiêu đề banner"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Mô Tả</Label>
            <textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Nhập mô tả banner hoặc nội dung khuyến mãi"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Ngày Bắt Đầu (Tùy chọn)</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate || ""}
                onChange={(e) =>
                  handleInputChange("startDate", e.target.value || null)
                }
                className="w-full"
              />
              <p className="text-gray-500 text-sm mt-1">
                Để trống để bắt đầu ngay
              </p>
            </div>
            <div>
              <Label htmlFor="endDate">Ngày Kết Thúc (Tùy chọn)</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate || ""}
                onChange={(e) =>
                  handleInputChange("endDate", e.target.value || null)
                }
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Để trống nếu không có ngày hết hạn
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Trạng Thái</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                handleInputChange("status", e.target.value as BannerStatus)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={BannerStatus.ACTIVE}>Hoạt Động</option>
              <option value={BannerStatus.INACTIVE}>Tạm Dừng</option>
              <option value={BannerStatus.EXPIRED}>Hết Hạn</option>
            </select>
          </div>

          {/* Banner Information (for existing banners) */}
          {banner && !isCreateMode && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Thông Tin Banner</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Mã Banner</div>
                  <div className="font-medium">#{banner.id}</div>
                </div>
                <div>
                  <div className="text-gray-600">Trạng Thái Hiện Tại</div>
                  <div className="font-medium">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        banner.status === BannerStatus.ACTIVE
                          ? "bg-green-100 text-green-800"
                          : banner.status === BannerStatus.INACTIVE
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {banner.status}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Ngày Tạo</div>
                  <div className="font-medium">
                    {formatDate(banner.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Cập Nhật Lần Cuối</div>
                  <div className="font-medium">
                    {formatDate(banner.updatedAt)}
                  </div>
                </div>
                {banner.startDate && (
                  <div>
                    <div className="text-gray-600">Ngày Bắt Đầu</div>
                    <div className="font-medium">
                      {formatDate(banner.startDate)}
                    </div>
                  </div>
                )}
                {banner.endDate && (
                  <div>
                    <div className="text-gray-600">Ngày Kết Thúc</div>
                    <div className="font-medium">
                      {formatDate(banner.endDate)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              {banner && !isCreateMode && onStatusChange && (
                <>
                  {banner.status !== BannerStatus.ACTIVE && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        onStatusChange(banner.id, BannerStatus.ACTIVE)
                      }
                      className="text-green-600 hover:text-green-700"
                    >
                      Kích Hoạt
                    </Button>
                  )}
                  {banner.status !== BannerStatus.INACTIVE && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        onStatusChange(banner.id, BannerStatus.INACTIVE)
                      }
                      className="text-red-600 hover:text-red-700"
                    >
                      Tạm Dừng
                    </Button>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Đang lưu..."
                  : isCreateMode
                  ? "Tạo Mới"
                  : "Lưu Thay Đổi"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
