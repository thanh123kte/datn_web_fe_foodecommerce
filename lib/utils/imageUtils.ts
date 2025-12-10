/**
 * Reusable Image Utilities
 * Extracted from Seller Profile for reuse across the application
 */

import { buildAbsoluteUrl } from "@/lib/config/env";

/**
 * Resolve media URL - handles both absolute and relative URLs
 * @param url - The image URL (can be relative or absolute)
 * @param fallback - Fallback image URL if the main URL is invalid
 * @returns Resolved absolute URL or fallback
 */
export function resolveMediaUrl(
  url?: string | null,
  fallback: string = "/images/default-avatar.png"
): string {
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
  } else if (url.startsWith("stores/")) {
    normalized = `/uploads/${url}`;
  } else if (url.startsWith("/stores/")) {
    normalized = `/uploads${url}`;
  } else if (url.startsWith("categories/")) {
    normalized = `/uploads/${url}`;
  } else if (url.startsWith("/categories/")) {
    normalized = `/uploads${url}`;
  } else if (url.startsWith("drivers/")) {
    normalized = `/uploads/${url}`;
  } else if (url.startsWith("/drivers/")) {
    normalized = `/uploads${url}`;
  } else {
    // Default: assume it needs /uploads/ prefix
    normalized = url.startsWith("/") ? `/uploads${url}` : `/uploads/${url}`;
  }

  return buildAbsoluteUrl(normalized) || fallback;
}

/**
 * Validate image file
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns Validation result with success flag and error message
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  // Check if it's an image
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Please select an image file" };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Image size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Create a preview URL from a File object
 * @param file - The file to create preview for
 * @returns Promise with preview URL or error
 */
export function createImagePreview(
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  return new Promise((resolve) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      resolve({ success: false, error: validation.error });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ success: true, url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ success: false, error: "Failed to read image file" });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Generate avatar URL using UI Avatars service
 * @param name - Name to use for generating avatar
 * @param background - Background color (hex without #)
 * @param color - Text color (hex without #)
 * @returns Avatar URL
 */
export function generateAvatarUrl(
  name: string = "User",
  background: string = "E5E7EB",
  color: string = "111827"
): string {
  const safeName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${safeName}&background=${background}&color=${color}`;
}

/**
 * Resolve avatar URL with fallback to generated avatar
 * @param url - Original avatar URL
 * @param name - Name for fallback avatar generation
 * @returns Resolved avatar URL
 */
export function resolveAvatarUrl(
  url?: string | null,
  name?: string | null
): string {
  // If no URL, use generated avatar
  if (!url) {
    return generateAvatarUrl(name || "User");
  }

  // If absolute URL (http/https), use as is
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  // Fix backend URL that starts with /users/ or /drivers/ - should be /uploads/...
  let normalizedUrl = url;
  if (url.startsWith("/users/")) {
    normalizedUrl = `/uploads${url}`;
  } else if (url.startsWith("users/")) {
    normalizedUrl = `/uploads/${url}`;
  } else if (url.startsWith("/drivers/")) {
    normalizedUrl = `/uploads${url}`;
  } else if (url.startsWith("drivers/")) {
    normalizedUrl = `/uploads/${url}`;
  }

  // Build absolute URL
  const absolute = buildAbsoluteUrl(normalizedUrl);

  if (absolute) {
    return absolute;
  }

  // Fallback to generated avatar if buildAbsoluteUrl fails
  return generateAvatarUrl(name || "User");
}
