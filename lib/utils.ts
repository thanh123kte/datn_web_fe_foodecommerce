import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Builds an absolute URL for an image path
 * @param path - The relative image path from the backend
 * @returns The absolute URL for the image
 */
export function buildAbsoluteUrl(path: string): string {
  if (!path) return "";

  // If path is already an absolute URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Build absolute URL using backend base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Add /uploads/ prefix if path doesn't start with it
  let cleanPath = path;
  if (!cleanPath.startsWith("/uploads/") && !cleanPath.startsWith("uploads/")) {
    cleanPath = `/uploads/${path.startsWith("/") ? path.substring(1) : path}`;
  } else if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }

  return `${baseUrl}${cleanPath}`;
}
