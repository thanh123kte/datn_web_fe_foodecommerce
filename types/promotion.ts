export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED_AMOUNT = "FIXED_AMOUNT",
}

export enum DiscountStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  DISABLED = "DISABLED",
}

export enum BannerStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EXPIRED = "EXPIRED",
}

export interface Voucher {
  id: number;
  code: string;
  title: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_value: number;
  max_discount: number;
  start_date: string;
  end_date: string;
  usage_limit: number;
  used_count: number;
  store_id?: number;
  status: DiscountStatus;
  is_created_by_admin: boolean;
  // Additional fields for display
  store_name?: string;
  remaining_uses?: number;
  is_expired?: boolean;
}

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  status: BannerStatus;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  // Additional fields for display
  is_expired?: boolean;
}

export interface VoucherFilters {
  search?: string;
  status?: DiscountStatus;
  discount_type?: DiscountType;
  is_created_by_admin?: boolean;
  store_id?: number;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface BannerFilters {
  search?: string;
  status?: BannerStatus;
}

export interface PromotionStats {
  total_vouchers: number;
  active_vouchers: number;
  expired_vouchers: number;
  disabled_vouchers: number;
  admin_vouchers: number;
  seller_vouchers: number;
  total_banners: number;
  active_banners: number;
  inactive_banners: number;
  total_voucher_usage: number;
  most_used_vouchers: Voucher[];
  recent_vouchers: Voucher[];
  recent_banners: Banner[];
}

export interface VoucherFormData {
  code: string;
  title: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_value: number;
  max_discount: number;
  start_date: string;
  end_date: string;
  usage_limit: number;
  store_id?: number;
  status: DiscountStatus;
  is_created_by_admin: boolean;
}

export interface BannerFormData {
  title: string;
  imageUrl?: string;
  description?: string;
  status: BannerStatus;
  startDate?: string | null;
  endDate?: string | null;
}

export interface BannerStats {
  totalBanners: number;
  activeBanners: number;
  inactiveBanners: number;
  expiredBanners: number;
}
