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

export interface CreateCategoryRequest {
  name: string;
  description: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
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

  // Tạo category mới
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await axiosInstance.post(this.basePath, data);
    return response.data;
  }

  // Cập nhật category
  async updateCategory(
    id: number,
    data: UpdateCategoryRequest
  ): Promise<Category> {
    const response = await axiosInstance.put(`${this.basePath}/${id}`, data);
    return response.data;
  }

  // Xóa category
  async deleteCategory(id: number): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${id}`);
  }

  // Upload image cho category
  async uploadImage(id: number, imageFile: File): Promise<Category> {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axiosInstance.post(
      `${this.basePath}/${id}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Xóa image của category
  async deleteImage(id: number): Promise<Category> {
    const response = await axiosInstance.delete(`${this.basePath}/${id}/image`);
    return response.data;
  }

  // Update category with file upload
  async updateCategoryWithImage(
    id: number,
    data: UpdateCategoryRequest,
    imageFile?: File
  ): Promise<Category> {
    // First update the category data
    const updatedCategory = await this.updateCategory(id, data);

    // Then upload image if provided
    if (imageFile) {
      return await this.uploadImage(id, imageFile);
    }

    return updatedCategory;
  }

  // Create category with file upload
  async createCategoryWithImage(
    data: CreateCategoryRequest,
    imageFile?: File
  ): Promise<Category> {
    // First create the category
    const newCategory = await this.createCategory(data);

    // Then upload image if provided
    if (imageFile) {
      return await this.uploadImage(newCategory.id, imageFile);
    }

    return newCategory;
  }
}

export const categoriesService = new CategoriesService();
export default categoriesService;
