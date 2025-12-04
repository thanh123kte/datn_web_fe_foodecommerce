import axiosInstance from "@/lib/api/axiosConfig";

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

class ProductImageService {
  private readonly basePath = "/api/product-images";

  // Upload image cho product
  async upload(productId: number, file: File): Promise<ProductImage> {
    const formData = new FormData();
    formData.append("files", file);

    const response = await axiosInstance.post(
      `${this.basePath}/upload/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Lấy tất cả ảnh của product
  async getByProductId(productId: number): Promise<ProductImage[]> {
    const response = await axiosInstance.get(
      `${this.basePath}/product/${productId}`
    );
    return response.data;
  }

  // Xóa ảnh
  async delete(imageId: number): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${imageId}`);
  }

  // Đặt ảnh làm primary
  async setPrimary(imageId: number): Promise<ProductImage> {
    const response = await axiosInstance.put(
      `${this.basePath}/${imageId}/primary`
    );
    return response.data;
  }

  // Cập nhật thứ tự hiển thị
  async updateOrder(
    imageId: number,
    displayOrder: number
  ): Promise<ProductImage> {
    const response = await axiosInstance.put(
      `${this.basePath}/${imageId}/order`,
      { displayOrder }
    );
    return response.data;
  }
}

export const productImageService = new ProductImageService();
export default productImageService;
