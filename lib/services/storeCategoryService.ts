// lib/services/storeCategoryService.ts
import axiosInstance from "@/lib/api/axiosConfig";

export interface StoreCategory {
  id: number;
  name: string;
  description: string;
  storeId: number;
  categoryId: number; // ID từ table categories (toàn sàn)
  categoryName?: string; // Tên category từ table categories
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreCategoryDto {
  storeId: number;
  name: string;
  description: string;
  categoryId: number; // ID từ table categories (toàn sàn)
}

export interface UpdateStoreCategoryDto {
  name?: string;
  description?: string;
  categoryId?: number; // ID từ table categories (toàn sàn)
}

class StoreCategoryService {
  private readonly basePath = "/api/store-categories";

  // Tạo store category mới
  async create(data: CreateStoreCategoryDto): Promise<StoreCategory> {
    try {
      const response = await axiosInstance.post(this.basePath, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy store category theo ID
  async getById(id: number): Promise<StoreCategory> {
    const response = await axiosInstance.get(`${this.basePath}/${id}`);
    return response.data;
  }

  // Lấy tất cả store categories theo store ID
  async getByStoreId(storeId: number): Promise<StoreCategory[]> {
    const response = await axiosInstance.get(
      `${this.basePath}/store/${storeId}`
    );
    return response.data;
  }

  // Lấy store categories theo category ID
  async getByCategory(categoryId: number): Promise<StoreCategory[]> {
    const response = await axiosInstance.get(
      `${this.basePath}/category/${categoryId}`
    );
    return response.data;
  }

  // Cập nhật store category
  async update(
    id: number,
    data: UpdateStoreCategoryDto
  ): Promise<StoreCategory> {
    const response = await axiosInstance.put(`${this.basePath}/${id}`, data);
    return response.data;
  }

  // Xóa store category
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${id}`);
  }

  // Lấy tất cả categories cho một store với filters
  async searchByStore(
    storeId: number,
    params?: {
      search?: string;
      categoryId?: number;
    }
  ): Promise<StoreCategory[]> {
    const categories = await this.getByStoreId(storeId);

    if (!params) return categories;

    let filtered = categories;

    // Filter by search term
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchLower) ||
          category.description.toLowerCase().includes(searchLower) ||
          (category.categoryName &&
            category.categoryName.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (params.categoryId !== undefined) {
      filtered = filtered.filter(
        (category) => category.categoryId === params.categoryId
      );
    }

    return filtered;
  }
}

export const storeCategoryService = new StoreCategoryService();
export default storeCategoryService;
