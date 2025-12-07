/**
 * Reusable Image Upload Hook
 * Based on the image handling logic from Seller Profile
 */

import { useState, useCallback } from "react";
import { validateImageFile, createImagePreview } from "@/lib/utils/imageUtils";

interface UseImageUploadOptions {
  maxSizeMB?: number;
  onError?: (error: string) => void;
}

interface UseImageUploadReturn {
  previewUrl: string | null;
  selectedFile: File | null;
  isUploading: boolean;
  error: string | null;
  handleImageSelect: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  handleImageDrop: (file: File) => Promise<void>;
  clearImage: () => void;
  resetState: () => void;
}

/**
 * Hook for managing image upload state and preview
 * @param options - Configuration options
 * @returns Image upload state and handlers
 */
export function useImageUpload(
  options: UseImageUploadOptions = {}
): UseImageUploadReturn {
  const { maxSizeMB = 5, onError } = options;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle image file selection from input
   */
  const handleImageSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file
      const validation = validateImageFile(file, maxSizeMB);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        onError?.(validation.error || "Invalid file");
        return;
      }

      // Clear previous error
      setError(null);

      // Create preview
      setIsUploading(true);
      const preview = await createImagePreview(file);
      setIsUploading(false);

      if (preview.success && preview.url) {
        setPreviewUrl(preview.url);
        setSelectedFile(file);
      } else {
        const errorMsg = preview.error || "Failed to load image";
        setError(errorMsg);
        onError?.(errorMsg);
      }
    },
    [maxSizeMB, onError]
  );

  /**
   * Handle image drop (for drag-and-drop functionality)
   */
  const handleImageDrop = useCallback(
    async (file: File) => {
      // Validate file
      const validation = validateImageFile(file, maxSizeMB);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        onError?.(validation.error || "Invalid file");
        return;
      }

      // Clear previous error
      setError(null);

      // Create preview
      setIsUploading(true);
      const preview = await createImagePreview(file);
      setIsUploading(false);

      if (preview.success && preview.url) {
        setPreviewUrl(preview.url);
        setSelectedFile(file);
      } else {
        const errorMsg = preview.error || "Failed to load image";
        setError(errorMsg);
        onError?.(errorMsg);
      }
    },
    [maxSizeMB, onError]
  );

  /**
   * Clear the selected image
   */
  const clearImage = useCallback(() => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setError(null);
  }, []);

  /**
   * Reset all state (including errors)
   */
  const resetState = useCallback(() => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsUploading(false);
    setError(null);
  }, []);

  return {
    previewUrl,
    selectedFile,
    isUploading,
    error,
    handleImageSelect,
    handleImageDrop,
    clearImage,
    resetState,
  };
}
