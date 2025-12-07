"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Store } from "@/lib/mockData/profile";
import { buildAbsoluteUrl } from "@/lib/config/env";
import { Camera, Store as StoreIcon, Clock } from "lucide-react";

const resolveMediaUrl = (
  url?: string | null,
  fallback: string = "/images/default-avatar.png"
) => {
  if (!url) return fallback;

  // Ignore placeholder values like "string"
  if (url.trim().toLowerCase() === "string") return fallback;

  // If absolute URL (including ui-avatars.com), keep as is
  if (/^https?:\/\//i.test(url)) return url;

  // Normalize relative paths to /uploads/...
  let normalized = url;
  if (url.startsWith("uploads/")) {
    normalized = `/${url}`;
  } else if (url.startsWith("/uploads/")) {
    normalized = url;
  } else if (url.startsWith("users/")) {
    normalized = `/uploads/${url}`;
  } else if (url.startsWith("/users/")) {
    normalized = `/uploads${url}`;
  } else {
    // Default: assume it needs /uploads/ prefix
    normalized = url.startsWith("/") ? `/uploads${url}` : `/uploads/${url}`;
  }

  return buildAbsoluteUrl(normalized) || fallback;
};

interface StoreInfoProps {
  store: Store;
  onUpdate: (storeData: Partial<Store>) => Promise<void>;
  onUploadImage: (file: File) => Promise<void>;
  loading?: boolean;
}

export function StoreInfo({
  store,
  onUpdate,
  onUploadImage,
  loading = false,
}: StoreInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: store.name || "",
    description: store.description || "",
    phone: store.phone || "",
    address: store.address || "",
    open_time: store.open_time || "08:00",
    close_time: store.close_time || "22:00",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const handleSave = async () => {
    try {
      await onUpdate(formData);

      if (selectedImageFile) {
        await onUploadImage(selectedImageFile);
      }

      setPreviewImage(null);
      setSelectedImageFile(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving store info:", err);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: store.name || "",
      description: store.description || "",
      phone: store.phone || "",
      address: store.address || "",
      open_time: store.open_time || "08:00",
      close_time: store.close_time || "22:00",
    });
    setPreviewImage(null);
    setSelectedImageFile(null);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setSelectedImageFile(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "REJECTED":
        return "text-red-600 bg-red-100";
      case "SUSPENDED":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "PENDING":
        return "Pending";
      case "REJECTED":
        return "Rejected";
      case "SUSPENDED":
        return "Suspended";
      default:
        return "Unknown";
    }
  };

  const getCurrentStatus = () => {
    const now = new Date();
    const currentTime =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");
    const open = formData.open_time;
    const close = formData.close_time;

    if (currentTime >= open && currentTime <= close) {
      return {
        isOpen: true,
        text: "Currently Open",
        color: "text-green-600 bg-green-100",
      };
    } else {
      return {
        isOpen: false,
        text: "Currently Closed",
        color: "text-red-600 bg-red-100",
      };
    }
  };

  const status = getCurrentStatus();

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StoreIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Store Information</h3>
          </div>
          <div className="flex gap-2">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                store.store_status
              )}`}
            >
              {getStatusText(store.store_status)}
            </span>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
            >
              {status.text}
            </span>
          </div>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={loading}
          >
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button size="sm" onClick={handleSave} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-start gap-6">
        {/* Store image section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <Image
              src={
                previewImage ||
                resolveMediaUrl(store.image_url, "/images/default-store.png")
              }
              alt="Store"
              width={120}
              height={120}
              className="rounded-lg object-cover border-2 border-gray-200"
              unoptimized
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            {isEditing
              ? selectedImageFile
                ? "Photo selected - click Save"
                : "Click to change store photo"
              : "Store Photo"}
          </p>
        </div>

        {/* Form section */}
        <div className="flex-1 space-y-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            {isEditing ? (
              <Input
                id="storeName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={loading}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded border">{store.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="storePhone">Store Phone</Label>
            {isEditing ? (
              <Input
                id="storePhone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={loading}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded border">
                {store.phone}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="storeAddress">Store Address</Label>
            {isEditing ? (
              <Input
                id="storeAddress"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                disabled={loading}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded border">
                {store.address}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Store Description</Label>
            {isEditing ? (
              <textarea
                id="description"
                rows={3}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={loading}
                placeholder="Brief description of your store..."
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded border min-h-[80px]">
                {store.description || "No description available"}
              </p>
            )}
          </div>

          {/* Business Hours */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <Label className="text-base font-semibold">Business Hours</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openTime">Opening Time</Label>
                {isEditing ? (
                  <Input
                    id="openTime"
                    type="time"
                    value={formData.open_time}
                    onChange={(e) =>
                      setFormData({ ...formData, open_time: e.target.value })
                    }
                    disabled={loading}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded border font-medium">
                    {store.open_time || "08:00"}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="closeTime">Closing Time</Label>
                {isEditing ? (
                  <Input
                    id="closeTime"
                    type="time"
                    value={formData.close_time}
                    onChange={(e) =>
                      setFormData({ ...formData, close_time: e.target.value })
                    }
                    disabled={loading}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded border font-medium">
                    {store.close_time || "22:00"}
                  </p>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600">
                  Customers can only place orders during these hours. Outside
                  business hours, the store will automatically switch to closed
                  status.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
