// Product Management Types

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // Mảng URL hình ảnh
  categoryId: string;
  categoryName: string;
  sellerId: string;
  sellerName: string;
  status: ProductStatus;
  admin_status: AdminStatus; // Trạng thái quản lý của admin
  rating: number; // Đánh giá trung bình
  reviewCount: number; // Số lượng đánh giá
  createdAt: string;
  updatedAt: string;
}

export enum ProductStatus {
  PENDING = "pending", // Chờ duyệt
  APPROVED = "approved", // Đã duyệt
  REJECTED = "rejected", // Bị từ chối
  OUT_OF_STOCK = "out_of_stock", // Hết hàng
  DISCONTINUED = "discontinued", // Ngừng kinh doanh
}

export enum AdminStatus {
  NORMAL = "normal", // Bình thường
  BANNED = "banned", // Bị cấm
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  sellerId?: string;
  status?: ProductStatus;
  adminStatus?: AdminStatus;
  sortBy?: "name" | "price" | "rating" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface ProductStats {
  totalProducts: number;
  normalProducts: number;
  bannedProducts: number;
  categoryDistribution: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
    percentage: number;
  }>;
  sellerDistribution: Array<{
    sellerId: string;
    sellerName: string;
    count: number;
    percentage: number;
  }>;
  statusDistribution: Array<{
    status: ProductStatus;
    count: number;
    percentage: number;
  }>;
  adminStatusDistribution: Array<{
    adminStatus: AdminStatus;
    count: number;
    percentage: number;
  }>;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  sellerId?: string; // Optional for admin creation
  stock: number;
  images: File[] | string[]; // Files for upload or URLs for edit
  tags: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  nutritionInfo?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    sugar: number;
  };
  ingredients?: string[];
  allergens?: string[];
  expiryDate?: string;
  isActive: boolean;
  isFeatured: boolean;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductSearchFilters {
  query?: string;
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  sortBy?:
    | "relevance"
    | "price_low"
    | "price_high"
    | "rating"
    | "newest"
    | "best_selling";
  page?: number;
  limit?: number;
}

// Product Review Types
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

// Product Variant Types (for products with multiple options)
export interface ProductVariant {
  id: string;
  productId: string;
  name: string; // VD: "Size L", "Màu đỏ"
  price: number;
  stock: number;
  sku: string;
  attributes: Record<string, string>; // VD: {size: "L", color: "red"}
  isActive: boolean;
}

// Product Analytics Types
export interface ProductAnalytics {
  productId: string;
  views: number;
  clicks: number;
  addToCartCount: number;
  purchaseCount: number;
  conversionRate: number;
  bounceRate: number;
  averageTimeOnPage: number;
  revenueGenerated: number;
  period: {
    startDate: string;
    endDate: string;
  };
}
