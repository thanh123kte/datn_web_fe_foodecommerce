"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User } from "@/lib/mockData/profile";
import { buildAbsoluteUrl } from "@/lib/config/env";
import { Camera, User as UserIcon } from "lucide-react";

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

interface PersonalInfoProps {
  user: User;
  onUpdate: (userData: Partial<User>) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<void>;
  loading?: boolean;
}

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
