"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Store } from "@/lib/mockData/profile";
import { buildAbsoluteUrl } from "@/lib/config/env";
import {
  Camera,
  User as UserIcon,
  Store as StoreIcon,
  Clock,
} from "lucide-react";

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

// Component interfaces
interface PersonalInfoProps {
  user: User;
  onUpdate: (userData: Partial<User>) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<void>;
  loading?: boolean;
}

interface StoreInfoProps {
  store: Store;
  onUpdate: (storeData: Partial<Store>) => Promise<void>;
  onUploadImage: (file: File) => Promise<void>;
  loading?: boolean;
}

interface BusinessHoursProps {
  openTime?: string;
  closeTime?: string;
  onUpdate: (openTime: string, closeTime: string) => void;
  loading?: boolean;
}

// PersonalInfo Component
export function PersonalInfo({
  user,
  onUpdate,
  onUploadAvatar,
  loading = false,
}: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user.full_name || "",
    phone: user.phone || "",
    email: user.email || "",
  });
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null
  );

  const handleSave = async () => {
    try {
      // Save user info first
      await onUpdate(formData);

      // Then upload avatar if changed
      if (selectedAvatarFile) {
        await onUploadAvatar(selectedAvatarFile);
      }

      // Clear preview states
      setPreviewAvatar(null);
      setSelectedAvatarFile(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      // Keep editing mode on error
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user.full_name || "",
      phone: user.phone || "",
      email: user.email || "",
    });
    // Clear preview states
    setPreviewAvatar(null);
    setSelectedAvatarFile(null);
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewAvatar(previewUrl);
      setSelectedAvatarFile(file);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Personal Information</h3>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={loading}
          >
            Edit
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
        {/* Avatar section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100">
              <Image
                src={
                  previewAvatar ||
                  resolveMediaUrl(user.avatar_url, "/images/default-avatar.png")
                }
                alt="Avatar"
                width={120}
                height={120}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            {isEditing
              ? selectedAvatarFile
                ? "Photo selected - click Save"
                : "Click to change photo"
              : "Profile Photo"}
          </p>
        </div>

        {/* Form section */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            {isEditing ? (
              <Input
                id="fullName"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                disabled={loading}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded border">
                {user.full_name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={loading}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded border">{user.phone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded border">{user.email}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// StoreInfo Component
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

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StoreIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Store Information</h3>
          </div>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              store.store_status
            )}`}
          >
            {getStatusText(store.store_status)}
          </span>
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
            {isEditing ? "Click to change store photo" : "Store Photo"}
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
        </div>
      </div>
    </Card>
  );
}

// BusinessHours Component
export function BusinessHours({
  openTime,
  closeTime,
  onUpdate,
  loading = false,
}: BusinessHoursProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    openTime: openTime || "08:00",
    closeTime: closeTime || "22:00",
  });

  const handleSave = () => {
    onUpdate(formData.openTime, formData.closeTime);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      openTime: openTime || "08:00",
      closeTime: closeTime || "22:00",
    });
    setIsEditing(false);
  };

  const getCurrentStatus = () => {
    const now = new Date();
    const currentTime =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");
    const open = openTime || "08:00";
    const close = closeTime || "22:00";

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Open Time</h3>
          </div>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
          >
            {status.text}
          </span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="openTime">Opening Time</Label>
          {isEditing ? (
            <Input
              id="openTime"
              type="time"
              value={formData.openTime}
              onChange={(e) =>
                setFormData({ ...formData, openTime: e.target.value })
              }
              disabled={loading}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 p-2 bg-gray-50 rounded border font-medium">
              {openTime || "08:00"}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="closeTime">Closing Time</Label>
          {isEditing ? (
            <Input
              id="closeTime"
              type="time"
              value={formData.closeTime}
              onChange={(e) =>
                setFormData({ ...formData, closeTime: e.target.value })
              }
              disabled={loading}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 p-2 bg-gray-50 rounded border font-medium">
              {closeTime || "22:00"}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Operating Hours: {openTime || "08:00"} - {closeTime || "22:00"}
          </span>
        </div>
        <p className="text-xs text-blue-600">
          Customers can only place orders during these hours. Outside business
          hours, the store will automatically switch to closed status.
        </p>
      </div>
    </Card>
  );
}
