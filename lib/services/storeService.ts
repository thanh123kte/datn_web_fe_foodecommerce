// lib/services/storeService.ts
import axiosInstance from "@/lib/api/axiosConfig";

export interface Store {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  imageUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
  ownerId: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";
  opStatus?: "OPEN" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreDto {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  bannerUrl?: string;
  ownerId: string;
}

export interface UpdateStoreDto {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

class StoreService {
  private readonly basePath = "/api/stores";

  // Tạo store mới
  async create(data: CreateStoreDto): Promise<Store> {
    const response = await axiosInstance.post(this.basePath, data);
    return response.data;
  }

  // Lấy store theo ID
  async getById(id: number): Promise<Store> {
    const response = await axiosInstance.get(`${this.basePath}/${id}`);
    return response.data;
  }

  // Lấy stores theo owner ID
  async getByOwner(ownerId: string): Promise<Store | null> {
    try {
      const response = await axiosInstance.get(
        `${this.basePath}/owner/${ownerId}`
      );
      // Backend giờ trả về một store object, không phải array
      return response.data;
    } catch (error) {
      // Nếu không tìm thấy store (404), trả về null
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  }

  // Cập nhật store
  async update(id: number, data: UpdateStoreDto): Promise<Store> {
    const response = await axiosInstance.put(`${this.basePath}/${id}`, data);
    return response.data;
  }

  // Xóa store
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${id}`);
  }

  // Lấy tất cả stores
  async getAll(): Promise<Store[]> {
    const response = await axiosInstance.get(this.basePath);
    return response.data;
  }

  // Tìm kiếm stores
  async search(query: string): Promise<Store[]> {
    const response = await axiosInstance.get(`${this.basePath}/search`, {
      params: { q: query },
    });
    return response.data;
  }

  // Lấy stores theo status
  async getByStatus(status: Store["status"]): Promise<Store[]> {
    const response = await axiosInstance.get(
      `${this.basePath}/status/${status}`
    );
    return response.data;
  }

  // Cập nhật status
  async setStatus(id: number, status: Store["status"]): Promise<Store> {
    const response = await axiosInstance.put(
      `${this.basePath}/${id}/status/${status}`
    );
    return response.data;
  }
}

export const storeService = new StoreService();
export default storeService;
