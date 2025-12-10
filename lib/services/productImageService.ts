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

  // Upload multiple images for product (backend accepts List<MultipartFile>)
  async uploadMultiple(
    productId: number,
    files: File[]
  ): Promise<ProductImage[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

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

  // Upload single image for product
  async upload(productId: number, file: File): Promise<ProductImage[]> {
    return this.uploadMultiple(productId, [file]);
  }

  // Get all images of a product
  async getByProductId(productId: number): Promise<ProductImage[]> {
    const response = await axiosInstance.get(
      `${this.basePath}/product/${productId}`
    );
    return response.data;
  }

  // Delete an image
  async delete(imageId: number): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${imageId}`);
  }

  // Delete all images of a product
  async deleteAllByProduct(productId: number): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/product/${productId}`);
  }

  // Set image as primary
  async setPrimary(imageId: number): Promise<ProductImage> {
    const response = await axiosInstance.put(
      `${this.basePath}/${imageId}/set-primary`
    );
    return response.data;
  }

  // Add more images to existing product (preserves existing primary image)
  async addMore(productId: number, files: File[]): Promise<ProductImage[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await axiosInstance.post(
      `${this.basePath}/add-more/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
}

export const productImageService = new ProductImageService();
export default productImageService;
