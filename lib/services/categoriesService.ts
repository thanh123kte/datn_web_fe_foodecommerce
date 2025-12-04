// lib/services/categoriesService.ts
import axiosInstance from "@/lib/api/axiosConfig";

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class CategoriesService {
  private readonly basePath = "/api/categories";

  // Lấy tất cả categories
  async getAllCategories(): Promise<Category[]> {
    const response = await axiosInstance.get(this.basePath);
    return response.data;
  }

  // Lấy category theo ID
  async getCategoryById(id: number): Promise<Category> {
    const response = await axiosInstance.get(`${this.basePath}/${id}`);
    return response.data;
  }

  // Lấy active categories only (for dropdown)
  async getActiveCategories(): Promise<Category[]> {
    const categories = await this.getAllCategories();
    return categories.filter((cat) => cat.isActive);
  }
}

export const categoriesService = new CategoriesService();
export default categoriesService;
