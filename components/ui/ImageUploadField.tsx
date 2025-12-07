/**
 * Reusable Image Upload Field Component
 * Based on the image upload UI from Seller Profile
 */

"use client";

import React from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { resolveMediaUrl } from "@/lib/utils/imageUtils";

interface ImageUploadFieldProps {
  currentImageUrl?: string | null;
  fallbackImage?: string;
  onImageSelect: (file: File) => void;
  onImageClear?: () => void;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  shape?: "square" | "circle";
  size?: {
    width: number;
    height: number;
  };
  maxSizeMB?: number;
}

export function ImageUploadField({
  currentImageUrl,
  fallbackImage = "/images/default-avatar.png",
  onImageSelect,
  onImageClear,
  disabled = false,
  label = "Image",
  helperText,
  shape = "square",
  size = { width: 120, height: 120 },
  maxSizeMB = 5,
}: ImageUploadFieldProps) {
  const { previewUrl, selectedFile, error, handleImageSelect, clearImage } =
    useImageUpload({
      maxSizeMB,
      onError: (err) => console.error("Image upload error:", err),
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleImageSelect(e);
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClear = () => {
    clearImage();
    onImageClear?.();
  };

  const displayImageUrl =
    previewUrl || resolveMediaUrl(currentImageUrl, fallbackImage);

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Image
          src={displayImageUrl}
          alt={label}
          width={size.width}
          height={size.height}
          className={`${shapeClass} object-cover border-2 border-gray-200`}
          unoptimized
        />
        {!disabled && (
          <>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
              />
            </label>
            {(previewUrl || currentImageUrl) && onImageClear && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </>
        )}
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-500">
          {disabled
            ? label
            : selectedFile
            ? "Photo selected - click Save"
            : helperText ||
              `Click to ${
                currentImageUrl ? "change" : "upload"
              } ${label.toLowerCase()}`}
        </p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {!disabled && !error && (
          <p className="text-xs text-gray-400 mt-1">
            Max size: {maxSizeMB}MB • JPG, PNG, GIF
          </p>
        )}
      </div>
    </div>
  );
}
