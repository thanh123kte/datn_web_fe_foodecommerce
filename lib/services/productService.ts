import axiosInstance from "@/lib/api/axiosConfig";

// Backend-aligned DTOs
export type ProductStatus = "AVAILABLE" | "UNAVAILABLE" | "OUT_OF_STOCK";

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

  async getByStore(storeId: number): Promise<ProductResponseDto[]> {
    const res = await axiosInstance.get(`${this.basePath}/store/${storeId}`);
    return res.data;
  }

  async create(data: CreateProductDto): Promise<ProductResponseDto> {
    const res = await axiosInstance.post(this.basePath, data);
    return res.data;
  }

  async update(
    id: number,
    data: UpdateProductDto
  ): Promise<ProductResponseDto> {
    const res = await axiosInstance.put(`${this.basePath}/${id}`, data);
    return res.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${id}`);
  }
}

export const productService = new ProductService();
export default productService;
