// Promotion data types and mock data based on database schema

// Enums from DB schema
export enum DiscountType {
  PERCENT = "PERCENT",
  FIXED = "FIXED",
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

// Voucher interface based on vouchers table
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
  seller_id: number;
  status: DiscountStatus;
  is_created_by_admin: boolean;
  created_at: string;
  updated_at: string;
}

// Banner interface based on banners table
export interface Banner {
  id: number;
  title: string;
  image_url: string;
  description: string;
  status: BannerStatus;
  created_at: string;
  updated_at: string;
}

// Statistics interfaces
export interface PromotionStats {
  totalVouchers: number;
  activeVouchers: number;
  totalBanners: number;
  activeBanners: number;
  totalUsage: number;
  totalDiscount: number;
  topPerformingVoucher?: Voucher;
  voucherUsageRate: number;
  expiringVouchers: number;
  recentPromotions: number;
}

export interface VoucherStats {
  totalVouchers: number;
  activeVouchers: number;
  expiredVouchers: number;
  disabledVouchers: number;
  totalUsage: number;
  totalSavings: number;
  averageUsageRate: number;
  expiringVouchers: number;
}

export interface BannerStats {
  totalBanners: number;
  activeBanners: number;
  inactiveBanners: number;
  expiredBanners: number;
  recentBanners: number;
}

// Mock vouchers data
export const mockVouchers: Voucher[] = [
  {
    id: 1,
    code: "WELCOME10",
    title: "Welcome New Customers - 10% Off",
    discount_type: DiscountType.PERCENT,
    discount_value: 10,
    min_order_value: 100000,
    max_discount: 50000,
    start_date: "2024-11-01T00:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    usage_limit: 1000,
    used_count: 234,
    seller_id: 1,
    status: DiscountStatus.ACTIVE,
    is_created_by_admin: false,
    created_at: "2024-11-01T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
  },
  {
    id: 2,
    code: "SAVE50K",
    title: "Fixed 50K Discount",
    discount_type: DiscountType.FIXED,
    discount_value: 50000,
    min_order_value: 200000,
    max_discount: 50000,
    start_date: "2024-11-15T00:00:00Z",
    end_date: "2024-12-15T23:59:59Z",
    usage_limit: 500,
    used_count: 89,
    seller_id: 1,
    status: DiscountStatus.ACTIVE,
    is_created_by_admin: false,
    created_at: "2024-11-15T00:00:00Z",
    updated_at: "2024-11-15T00:00:00Z",
  },
  {
    id: 3,
    code: "BLACKFRIDAY",
    title: "Black Friday Super Sale - 25% Off",
    discount_type: DiscountType.PERCENT,
    discount_value: 25,
    min_order_value: 150000,
    max_discount: 100000,
    start_date: "2024-11-29T00:00:00Z",
    end_date: "2024-11-29T23:59:59Z",
    usage_limit: 200,
    used_count: 0,
    seller_id: 1,
    status: DiscountStatus.ACTIVE,
    is_created_by_admin: true,
    created_at: "2024-11-25T00:00:00Z",
    updated_at: "2024-11-25T00:00:00Z",
  },
  {
    id: 4,
    code: "EXPIRED20",
    title: "October Special - 20% Off",
    discount_type: DiscountType.PERCENT,
    discount_value: 20,
    min_order_value: 80000,
    max_discount: 75000,
    start_date: "2024-10-01T00:00:00Z",
    end_date: "2024-10-31T23:59:59Z",
    usage_limit: 300,
    used_count: 267,
    seller_id: 1,
    status: DiscountStatus.EXPIRED,
    is_created_by_admin: false,
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
  },
  {
    id: 5,
    code: "STUDENT15",
    title: "Student Discount - 15% Off",
    discount_type: DiscountType.PERCENT,
    discount_value: 15,
    min_order_value: 50000,
    max_discount: 30000,
    start_date: "2024-11-20T00:00:00Z",
    end_date: "2024-12-05T23:59:59Z",
    usage_limit: 100,
    used_count: 12,
    seller_id: 1,
    status: DiscountStatus.DISABLED,
    is_created_by_admin: false,
    created_at: "2024-11-20T00:00:00Z",
    updated_at: "2024-11-22T00:00:00Z",
  },
  {
    id: 6,
    code: "LUNCH30K",
    title: "Lunch Time Special - 30K Off",
    discount_type: DiscountType.FIXED,
    discount_value: 30000,
    min_order_value: 120000,
    max_discount: 30000,
    start_date: "2024-11-28T00:00:00Z",
    end_date: "2024-11-30T23:59:59Z",
    usage_limit: 150,
    used_count: 3,
    seller_id: 1,
    status: DiscountStatus.ACTIVE,
    is_created_by_admin: false,
    created_at: "2024-11-28T00:00:00Z",
    updated_at: "2024-11-28T00:00:00Z",
  },
];

// Mock banners data
export const mockBanners: Banner[] = [
  {
    id: 1,
    title: "Black Friday Mega Sale",
    image_url: "/api/placeholder/800/300",
    description:
      "Up to 50% off on all your favorite Thai dishes! Limited time offer.",
    status: BannerStatus.ACTIVE,
    created_at: "2024-11-25T00:00:00Z",
    updated_at: "2024-11-25T00:00:00Z",
  },
  {
    id: 2,
    title: "New Menu Launch",
    image_url: "/api/placeholder/800/300",
    description:
      "Discover our authentic Thai curry collection. Fresh ingredients, traditional recipes.",
    status: BannerStatus.ACTIVE,
    created_at: "2024-11-20T00:00:00Z",
    updated_at: "2024-11-20T00:00:00Z",
  },
  {
    id: 3,
    title: "Weekend Special Promotion",
    image_url: "/api/placeholder/800/300",
    description: "Free delivery on weekends for orders above 200K VND.",
    status: BannerStatus.INACTIVE,
    created_at: "2024-11-15T00:00:00Z",
    updated_at: "2024-11-23T00:00:00Z",
  },
  {
    id: 4,
    title: "Grand Opening Celebration",
    image_url: "/api/placeholder/800/300",
    description:
      "Thank you for supporting our new location! Special discounts for everyone.",
    status: BannerStatus.EXPIRED,
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-31T00:00:00Z",
  },
  {
    id: 5,
    title: "Holiday Season Menu",
    image_url: "/api/placeholder/800/300",
    description:
      "Festive Thai dishes perfect for your holiday celebrations. Order now!",
    status: BannerStatus.ACTIVE,
    created_at: "2024-11-26T00:00:00Z",
    updated_at: "2024-11-26T00:00:00Z",
  },
];

// Calculate promotion statistics
export const calculatePromotionStats = (): PromotionStats => {
  const totalVouchers = mockVouchers.length;
  const activeVouchers = mockVouchers.filter(
    (v) => v.status === DiscountStatus.ACTIVE
  ).length;
  const totalBanners = mockBanners.length;
  const activeBanners = mockBanners.filter(
    (b) => b.status === BannerStatus.ACTIVE
  ).length;

  const totalUsage = mockVouchers.reduce((sum, v) => sum + v.used_count, 0);
  const totalDiscount = mockVouchers.reduce((sum, v) => {
    if (v.discount_type === DiscountType.FIXED) {
      return sum + v.discount_value * v.used_count;
    } else {
      // Estimate discount for percentage vouchers (assume average order of 300K)
      const avgOrder = 300000;
      const discount = Math.min(
        (avgOrder * v.discount_value) / 100,
        v.max_discount
      );
      return sum + discount * v.used_count;
    }
  }, 0);

  const topPerformingVoucher = mockVouchers
    .filter((v) => v.status === DiscountStatus.ACTIVE)
    .reduce((top, current) =>
      current.used_count > top.used_count ? current : top
    );

  const totalUsageLimit = mockVouchers
    .filter((v) => v.status === DiscountStatus.ACTIVE)
    .reduce((sum, v) => sum + v.usage_limit, 0);
  const voucherUsageRate =
    totalUsageLimit > 0 ? (totalUsage / totalUsageLimit) * 100 : 0;

  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);

  const expiringVouchers = mockVouchers.filter(
    (v) =>
      v.status === DiscountStatus.ACTIVE &&
      new Date(v.end_date) <= threeDaysFromNow
  ).length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const recentPromotions =
    mockVouchers.filter((v) => new Date(v.created_at) >= oneWeekAgo).length +
    mockBanners.filter((b) => new Date(b.created_at) >= oneWeekAgo).length;

  return {
    totalVouchers,
    activeVouchers,
    totalBanners,
    activeBanners,
    totalUsage,
    totalDiscount,
    topPerformingVoucher,
    voucherUsageRate,
    expiringVouchers,
    recentPromotions,
  };
};

// Promotion API functions
export const promotionsAPI = {
  // Voucher operations
  getVouchers: async (
    page: number = 1,
    limit: number = 10,
    status?: DiscountStatus,
    searchTerm?: string
  ): Promise<{ vouchers: Voucher[]; total: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    let filteredVouchers = [...mockVouchers];

    if (status) {
      filteredVouchers = filteredVouchers.filter((v) => v.status === status);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredVouchers = filteredVouchers.filter(
        (v) =>
          v.code.toLowerCase().includes(searchLower) ||
          v.title.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    filteredVouchers.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const start = (page - 1) * limit;
    const end = start + limit;
    const vouchers = filteredVouchers.slice(start, end);

    return { vouchers, total: filteredVouchers.length };
  },

  createVoucher: async (
    voucherData: Omit<
      Voucher,
      "id" | "used_count" | "created_at" | "updated_at"
    >
  ): Promise<Voucher> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const newVoucher: Voucher = {
      ...voucherData,
      id: Date.now(),
      used_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockVouchers.unshift(newVoucher);
    return newVoucher;
  },

  updateVoucher: async (
    id: number,
    voucherData: Partial<Voucher>
  ): Promise<Voucher> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const index = mockVouchers.findIndex((v) => v.id === id);
    if (index === -1) throw new Error("Voucher not found");

    mockVouchers[index] = {
      ...mockVouchers[index],
      ...voucherData,
      updated_at: new Date().toISOString(),
    };

    return mockVouchers[index];
  },

  deleteVoucher: async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const index = mockVouchers.findIndex((v) => v.id === id);
    if (index === -1) throw new Error("Voucher not found");

    mockVouchers.splice(index, 1);
  },

  // Banner operations
  getBanners: async (
    page: number = 1,
    limit: number = 10,
    status?: BannerStatus
  ): Promise<{ banners: Banner[]; total: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    let filteredBanners = [...mockBanners];

    if (status) {
      filteredBanners = filteredBanners.filter((b) => b.status === status);
    }

    // Sort by creation date (newest first)
    filteredBanners.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const start = (page - 1) * limit;
    const end = start + limit;
    const banners = filteredBanners.slice(start, end);

    return { banners, total: filteredBanners.length };
  },

  createBanner: async (
    bannerData: Omit<Banner, "id" | "created_at" | "updated_at">
  ): Promise<Banner> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newBanner: Banner = {
      ...bannerData,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockBanners.unshift(newBanner);
    return newBanner;
  },

  updateBanner: async (
    id: number,
    bannerData: Partial<Banner>
  ): Promise<Banner> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const index = mockBanners.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Banner not found");

    mockBanners[index] = {
      ...mockBanners[index],
      ...bannerData,
      updated_at: new Date().toISOString(),
    };

    return mockBanners[index];
  },

  deleteBanner: async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const index = mockBanners.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Banner not found");

    mockBanners.splice(index, 1);
  },

  // Statistics
  getPromotionStats: async (): Promise<PromotionStats> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return calculatePromotionStats();
  },
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDiscountValue = (voucher: Voucher): string => {
  if (voucher.discount_type === DiscountType.PERCENT) {
    return `${voucher.discount_value}%`;
  }
  return formatCurrency(voucher.discount_value);
};

export const calculateDiscountAmount = (
  voucher: Voucher,
  orderValue: number
): number => {
  if (orderValue < voucher.min_order_value) return 0;

  if (voucher.discount_type === DiscountType.FIXED) {
    return Math.min(voucher.discount_value, voucher.max_discount);
  } else {
    const discount = (orderValue * voucher.discount_value) / 100;
    return Math.min(discount, voucher.max_discount);
  }
};

export const getVoucherStatusColor = (status: DiscountStatus): string => {
  switch (status) {
    case DiscountStatus.ACTIVE:
      return "bg-green-100 text-green-800";
    case DiscountStatus.EXPIRED:
      return "bg-gray-100 text-gray-800";
    case DiscountStatus.DISABLED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getBannerStatusColor = (status: BannerStatus): string => {
  switch (status) {
    case BannerStatus.ACTIVE:
      return "bg-green-100 text-green-800";
    case BannerStatus.INACTIVE:
      return "bg-yellow-100 text-yellow-800";
    case BannerStatus.EXPIRED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const isVoucherExpiringSoon = (voucher: Voucher): boolean => {
  if (voucher.status !== DiscountStatus.ACTIVE) return false;

  const now = new Date();
  const endDate = new Date(voucher.end_date);
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);

  return endDate <= threeDaysFromNow;
};

export const getUsagePercentage = (used: number, limit: number): number => {
  return limit > 0 ? (used / limit) * 100 : 0;
};
