import axiosInstance from "@/lib/api/axiosConfig";
import { Voucher, DiscountStatus, DiscountType } from "@/types/promotion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface CreateVoucherDto {
  code: string;
  title: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  startDate: string | null;
  endDate: string | null;
  usageLimit: number;
  storeId?: number;
  status: DiscountStatus;
  isActive?: boolean;
  isCreatedByAdmin: boolean;
}

interface UpdateVoucherDto {
  code?: string;
  title?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate?: string | null;
  endDate?: string | null;
  usageLimit?: number;
  storeId?: number;
  status?: DiscountStatus;
  isActive?: boolean;
  isCreatedByAdmin?: boolean;
}

interface VoucherResponseDto {
  id: number;
  code: string;
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  storeId: number | null;
  storeName: string | null;
  status: DiscountStatus;
  isActive: boolean;
  isCreatedByAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

// Convert backend DTO to frontend Voucher type
const convertToVoucher = (dto: VoucherResponseDto): Voucher => {
  return {
    id: dto.id,
    code: dto.code,
    title: dto.title,
    discount_type: dto.discountType,
    discount_value: dto.discountValue,
    min_order_value: dto.minOrderValue,
    max_discount: dto.maxDiscount,
    start_date: dto.startDate,
    end_date: dto.endDate,
    usage_limit: dto.usageLimit,
    used_count: 0, // Backend doesn't provide this yet
    store_id: dto.storeId || undefined,
    status: dto.status,
    is_created_by_admin: dto.isCreatedByAdmin,
    store_name: dto.storeName || undefined,
    remaining_uses: dto.usageLimit, // Calculate: usageLimit - usedCount
  };
};

// Convert frontend Voucher to backend CreateDto
const convertToCreateDto = (voucher: Partial<Voucher>): CreateVoucherDto => {
  return {
    code: voucher.code || "",
    title: voucher.title || "",
    description: "",
    discountType: voucher.discount_type || DiscountType.PERCENTAGE,
    discountValue: voucher.discount_value || 0,
    minOrderValue: voucher.min_order_value || 0,
    maxDiscount: voucher.max_discount || 0,
    startDate: voucher.start_date || null,
    endDate: voucher.end_date || null,
    usageLimit: voucher.usage_limit || 0,
    storeId: voucher.store_id,
    status: voucher.status || DiscountStatus.ACTIVE,
    isActive: true,
    isCreatedByAdmin: voucher.is_created_by_admin ?? true,
  };
};

// Convert frontend Voucher to backend UpdateDto
const convertToUpdateDto = (voucher: Partial<Voucher>): UpdateVoucherDto => {
  const dto: UpdateVoucherDto = {};

  if (voucher.code) dto.code = voucher.code;
  if (voucher.title) dto.title = voucher.title;
  if (voucher.discount_type) dto.discountType = voucher.discount_type;
  if (voucher.discount_value !== undefined)
    dto.discountValue = voucher.discount_value;
  if (voucher.min_order_value !== undefined)
    dto.minOrderValue = voucher.min_order_value;
  if (voucher.max_discount !== undefined)
    dto.maxDiscount = voucher.max_discount;
  if (voucher.start_date !== undefined) dto.startDate = voucher.start_date;
  if (voucher.end_date !== undefined) dto.endDate = voucher.end_date;
  if (voucher.usage_limit !== undefined) dto.usageLimit = voucher.usage_limit;
  if (voucher.store_id !== undefined) dto.storeId = voucher.store_id;
  if (voucher.status) {
    dto.status = voucher.status;
    dto.isActive = voucher.status === DiscountStatus.ACTIVE;
  }
  if (voucher.is_created_by_admin !== undefined)
    dto.isCreatedByAdmin = voucher.is_created_by_admin;

  return dto;
};

export const voucherService = {
  // Get all vouchers
  getAllVouchers: async (): Promise<Voucher[]> => {
    try {
      const response = await axiosInstance.get<VoucherResponseDto[]>(
        `${API_BASE_URL}/api/vouchers`
      );
      return Array.isArray(response.data)
        ? response.data.map(convertToVoucher)
        : [];
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      throw error;
    }
  },

  // Get voucher by ID
  getVoucherById: async (id: number): Promise<Voucher> => {
    try {
      const response = await axiosInstance.get<VoucherResponseDto>(
        `${API_BASE_URL}/api/vouchers/${id}`
      );
      return convertToVoucher(response.data);
    } catch (error) {
      console.error(`Error fetching voucher ${id}:`, error);
      throw error;
    }
  },

  // Get vouchers by store
  getVouchersByStore: async (storeId: number): Promise<Voucher[]> => {
    try {
      const response = await axiosInstance.get<VoucherResponseDto[]>(
        `${API_BASE_URL}/api/vouchers/store/${storeId}/isnot_deleted`
      );
      return Array.isArray(response.data)
        ? response.data.map(convertToVoucher)
        : [];
    } catch (error) {
      console.error(`Error fetching vouchers for store ${storeId}:`, error);
      throw error;
    }
  },

  // Get vouchers by discount type
  getVouchersByType: async (discountType: DiscountType): Promise<Voucher[]> => {
    try {
      const response = await axiosInstance.get<VoucherResponseDto[]>(
        `${API_BASE_URL}/api/vouchers/type/${discountType}`
      );
      return Array.isArray(response.data)
        ? response.data.map(convertToVoucher)
        : [];
    } catch (error) {
      console.error(`Error fetching vouchers for type ${discountType}:`, error);
      throw error;
    }
  },

  // Get admin vouchers
  getAdminVouchers: async (): Promise<Voucher[]> => {
    try {
      const response = await axiosInstance.get<VoucherResponseDto[]>(
        `${API_BASE_URL}/api/vouchers/admin`
      );
      return Array.isArray(response.data)
        ? response.data.map(convertToVoucher)
        : [];
    } catch (error) {
      console.error("Error fetching admin vouchers:", error);
      throw error;
    }
  },

  // Get store vouchers
  getStoreVouchers: async (): Promise<Voucher[]> => {
    try {
      const response = await axiosInstance.get<VoucherResponseDto[]>(
        `${API_BASE_URL}/api/vouchers/store`
      );
      return Array.isArray(response.data)
        ? response.data.map(convertToVoucher)
        : [];
    } catch (error) {
      console.error("Error fetching store vouchers:", error);
      throw error;
    }
  },

  // Create voucher
  createVoucher: async (voucher: Partial<Voucher>): Promise<Voucher> => {
    try {
      const dto = convertToCreateDto(voucher);
      const response = await axiosInstance.post<VoucherResponseDto>(
        `${API_BASE_URL}/api/vouchers`,
        dto
      );
      return convertToVoucher(response.data);
    } catch (error) {
      console.error("Error creating voucher:", error);
      throw error;
    }
  },

  // Update voucher
  updateVoucher: async (
    id: number,
    voucher: Partial<Voucher>
  ): Promise<Voucher> => {
    try {
      const dto = convertToUpdateDto(voucher);
      const response = await axiosInstance.put<VoucherResponseDto>(
        `${API_BASE_URL}/api/vouchers/${id}`,
        dto
      );
      return convertToVoucher(response.data);
    } catch (error) {
      console.error(`Error updating voucher ${id}:`, error);
      throw error;
    }
  },

  // Delete voucher (hard delete)
  deleteVoucher: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/api/vouchers/${id}`);
    } catch (error) {
      console.error(`Error deleting voucher ${id}:`, error);
      throw error;
    }
  },

  // Soft delete voucher
  softDeleteVoucher: async (id: number): Promise<void> => {
    try {
      await axiosInstance.put(`${API_BASE_URL}/api/vouchers/${id}/soft-delete`);
    } catch (error) {
      console.error(`Error soft deleting voucher ${id}:`, error);
      throw error;
    }
  },

  // Calculate stats from vouchers
  calculateStats: (vouchers: Voucher[]) => {
    const stats = {
      total_vouchers: vouchers.length,
      active_vouchers: 0,
      expired_vouchers: 0,
      disabled_vouchers: 0,
      admin_vouchers: 0,
      seller_vouchers: 0,
      total_voucher_usage: 0,
    };

    vouchers.forEach((voucher) => {
      // Count by status
      if (voucher.status === DiscountStatus.ACTIVE) {
        stats.active_vouchers++;
      } else if (voucher.status === DiscountStatus.EXPIRED) {
        stats.expired_vouchers++;
      } else if (voucher.status === DiscountStatus.DISABLED) {
        stats.disabled_vouchers++;
      }

      // Count by creator
      if (voucher.is_created_by_admin) {
        stats.admin_vouchers++;
      } else {
        stats.seller_vouchers++;
      }

      // Sum usage
      stats.total_voucher_usage += voucher.used_count;
    });

    return stats;
  },
};
