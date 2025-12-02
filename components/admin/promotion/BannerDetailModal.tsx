"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banner, BannerFormData, BannerStatus } from "@/types/promotion";

interface BannerDetailModalProps {
  banner: Banner | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: Banner) => void;
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
    image_url: "",
    description: "",
    status: BannerStatus.ACTIVE,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        image_url: banner.image_url,
        description: banner.description,
        status: banner.status,
      });
      setImagePreview(banner.image_url);
    } else if (isCreateMode) {
      setFormData({
        title: "",
        image_url: "",
        description: "",
        status: BannerStatus.ACTIVE,
      });
      setImagePreview("");
    }
  }, [banner, isCreateMode]);

  const handleInputChange = (field: keyof BannerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "image_url") {
      setImagePreview(value);
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.image_url.trim()) {
      newErrors.image_url = "Image URL is required";
    } else {
      // Basic URL validation
      try {
        new URL(formData.image_url);
      } catch {
        newErrors.image_url = "Please enter a valid URL";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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
        id: banner?.id || Date.now(),
        ...formData,
        created_at: banner?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await onSave(updatedBanner);
      onClose();
    } catch (error) {
      console.error("Error saving banner:", error);
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
              {isCreateMode ? "Create Banner" : "Banner Details"}
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
            <Label className="block mb-2">Banner Preview</Label>
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div>No image preview</div>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter banner title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="image_url">Image URL *</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange("image_url", e.target.value)}
              placeholder="https://example.com/banner-image.jpg"
              className={errors.image_url ? "border-red-500" : ""}
            />
            {errors.image_url && (
              <p className="text-red-500 text-sm mt-1">{errors.image_url}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Enter the URL of the banner image. Recommended size: 1200x400
              pixels.
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter banner description or promotional text"
              rows={4}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                handleInputChange("status", e.target.value as BannerStatus)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={BannerStatus.ACTIVE}>Active</option>
              <option value={BannerStatus.INACTIVE}>Inactive</option>
              <option value={BannerStatus.EXPIRED}>Expired</option>
            </select>
          </div>

          {/* Banner Information (for existing banners) */}
          {banner && !isCreateMode && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Banner Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Created</div>
                  <div className="font-medium">
                    {formatDate(banner.created_at)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Last Updated</div>
                  <div className="font-medium">
                    {formatDate(banner.updated_at)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Current Status</div>
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
                  <div className="text-gray-600">Banner ID</div>
                  <div className="font-medium">#{banner.id}</div>
                </div>
              </div>
            </div>
          )}

          {/* Image Upload Guidelines */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Image Guidelines
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Recommended dimensions: 1200x400 pixels</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Supported formats: JPG, PNG, WebP</li>
              <li>• Use high-quality images for better user experience</li>
              <li>• Ensure text in images is readable on all devices</li>
            </ul>
          </div>

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
                      Activate
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
                      Deactivate
                    </Button>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : isCreateMode
                  ? "Create"
                  : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
