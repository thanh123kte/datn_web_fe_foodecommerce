import axiosInstance from "@/lib/api/axiosConfig";

// Backend-aligned enums
export enum ProductStatus {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
}

export enum AdminStatus {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
}

// Backend-aligned DTOs
export interface ProductResponseDto {
  id: number;
  storeId: number;
  storeName?: string;
  categoryId?: number;
  categoryName?: string;
  storeCategoryId?: number;
  storeCategoryName?: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  status: ProductStatus;
  adminStatus: AdminStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  storeId: number;
  storeCategoryId: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  status: ProductStatus;
}

export interface UpdateProductDto {
  storeCategoryId?: number;
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  status?: ProductStatus;
}

class ProductService {
  private readonly basePath = "/api/products";

  // Get all products
  async getAll(): Promise<ProductResponseDto[]> {
    const res = await axiosInstance.get(this.basePath);
    return res.data;
  }

  // Get product by ID
  async getById(id: number): Promise<ProductResponseDto> {
    const res = await axiosInstance.get(`${this.basePath}/${id}`);
    return res.data;
  }

  // Get products by store
  async getByStore(storeId: number): Promise<ProductResponseDto[]> {
    const res = await axiosInstance.get(`${this.basePath}/store/${storeId}`);
    return res.data;
  }

  // Get products by category
  async getByCategory(categoryId: number): Promise<ProductResponseDto[]> {
    const res = await axiosInstance.get(
      `${this.basePath}/category/${categoryId}`
    );
    return res.data;
  }

  // Get products by status
  async getByStatus(status: ProductStatus): Promise<ProductResponseDto[]> {
    const res = await axiosInstance.get(`${this.basePath}/status/${status}`);
    return res.data;
  }

  // Get products by store and status
  async getByStoreAndStatus(
    storeId: number,
    status: ProductStatus
  ): Promise<ProductResponseDto[]> {
    const res = await axiosInstance.get(
      `${this.basePath}/store/${storeId}/status/${status}`
    );
    return res.data;
  }

  // Search products by name
  async searchByName(keyword: string): Promise<ProductResponseDto[]> {
    const res = await axiosInstance.get(`${this.basePath}/search`, {
      params: { q: keyword },
    });
    return res.data;
  }

  // Create product
  async create(data: CreateProductDto): Promise<ProductResponseDto> {
    const res = await axiosInstance.post(this.basePath, data);
    return res.data;
  }

  // Update product
  async update(
    id: number,
    data: UpdateProductDto
  ): Promise<ProductResponseDto> {
    const res = await axiosInstance.put(`${this.basePath}/${id}`, data);
    return res.data;
  }

  // Update product status (seller)
  async updateStatus(
    id: number,
    status: ProductStatus
  ): Promise<ProductResponseDto> {
    const res = await axiosInstance.put(
      `${this.basePath}/${id}/status/${status}`
    );
    return res.data;
  }

  // Update product admin status (admin only)
  async updateAdminStatus(
    id: number,
    adminStatus: AdminStatus
  ): Promise<ProductResponseDto> {
    const res = await axiosInstance.put(
      `${this.basePath}/${id}/admin-status/${adminStatus}`
    );
    return res.data;
  }

  // Delete product
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${id}`);
  }
}

export const productService = new ProductService();
export default productService;
