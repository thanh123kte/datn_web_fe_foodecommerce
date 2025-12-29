import axiosInstance from "@/lib/api/axiosConfig";

export enum BannerStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EXPIRED = "EXPIRED",
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
}

export interface CreateBannerDto {
  title: string;
  imageUrl?: string;
  description?: string;
  status?: BannerStatus;
  startDate?: string | null;
  endDate?: string | null;
}

export interface UpdateBannerDto {
  title?: string;
  imageUrl?: string;
  description?: string;
  status?: BannerStatus;
  startDate?: string | null;
  endDate?: string | null;
}

export interface BannerStats {
  totalBanners: number;
  activeBanners: number;
  inactiveBanners: number;
  expiredBanners: number;
}

/**
 * Banner Service
 * Quản lý các API endpoints cho banner
 */
class BannerService {
  private readonly baseUrl = "/api/banners";

  /**
   * Lấy tất cả banners
   */
  async getAllBanners(): Promise<Banner[]> {
    const response = await axiosInstance.get<Banner[]>(this.baseUrl);
    return response.data;
  }

  /**
   * Lấy banner theo ID
   */
  async getBannerById(id: number): Promise<Banner> {
    const response = await axiosInstance.get<Banner>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Lấy banners theo status
   */
  async getBannersByStatus(status: BannerStatus): Promise<Banner[]> {
    const response = await axiosInstance.get<Banner[]>(
      `${this.baseUrl}/status/${status}`
    );
    return response.data;
  }

  /**
   * Tạo banner mới
   */
  async createBanner(data: CreateBannerDto): Promise<Banner> {
    const response = await axiosInstance.post<Banner>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Cập nhật banner
   */
  async updateBanner(id: number, data: UpdateBannerDto): Promise<Banner> {
    const response = await axiosInstance.put<Banner>(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Xóa banner (hard delete)
   */
  async deleteBanner(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Xóa mềm banner (soft delete)
   */
  async softDeleteBanner(id: number): Promise<void> {
    await axiosInstance.put(`${this.baseUrl}/${id}/soft-delete`);
  }

  /**
   * Upload ảnh cho banner
   */
  async uploadImage(id: number, imageFile: File): Promise<Banner> {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axiosInstance.post<Banner>(
      `${this.baseUrl}/${id}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  /**
   * Xóa ảnh của banner
   */
  async deleteImage(id: number): Promise<Banner> {
    const response = await axiosInstance.delete<Banner>(
      `${this.baseUrl}/${id}/image`
    );
    return response.data;
  }

  /**
   * Tính toán stats từ danh sách banners
   */
  calculateStats(banners: Banner[]): BannerStats {
    return {
      totalBanners: banners.length,
      activeBanners: banners.filter((b) => b.status === BannerStatus.ACTIVE)
        .length,
      inactiveBanners: banners.filter((b) => b.status === BannerStatus.INACTIVE)
        .length,
      expiredBanners: banners.filter((b) => b.status === BannerStatus.EXPIRED)
        .length,
    };
  }
}

export const bannerService = new BannerService();
