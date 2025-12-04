const trimTrailingSlash = (url: string) => url.replace(/\/+$/, "");

const envApiBase =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.API_URL;

export const API_BASE_URL =
  (envApiBase ? trimTrailingSlash(envApiBase) : "http://localhost:8080") || "";

const envAssetBase =
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ||
  process.env.ASSET_BASE_URL ||
  envApiBase;

export const ASSET_BASE_URL = envAssetBase
  ? trimTrailingSlash(envAssetBase)
  : API_BASE_URL;

export const ROUTER_BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  process.env.BASE_PATH ||
  process.env.NEXT_PUBLIC_APP_BASE_PATH ||
  "";

/**
 * Resolve a potentially relative path to a full URL using the provided base.
 * Safeguards:
 * - Accepts already absolute http(s) URLs.
 * - Fixes common `http:/` typo.
 * - Avoids duplicate slashes.
 */
export const buildAbsoluteUrl = (path?: string, base: string = ASSET_BASE_URL) => {
  if (!path) return undefined;
  const fixed =
    path.startsWith("http:/") && !path.startsWith("http://")
      ? path.replace("http:/", "http://")
      : path;

  if (fixed.startsWith("http://") || fixed.startsWith("https://")) {
    return fixed;
  }

  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = fixed.startsWith("/") ? fixed : `/${fixed}`;
  return `${normalizedBase}${normalizedPath}`;
};
