// lib/services/userService.ts
import axiosInstance from "@/lib/api/axiosConfig";
import { Store } from "./storeService";

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles: string[];
}

export interface SellerStatsResponse extends UserResponse {
  store?: Store;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AddRoleRequest {
  role: "CUSTOMER" | "SELLER" | "ADMIN" | "DRIVER";
}

class UserService {
  private readonly basePath = "/api/users";

  // Lấy danh sách users với phân trang
  async getUsers(
    page: number = 0,
    size: number = 100
  ): Promise<PageResponse<UserResponse>> {
    const response = await axiosInstance.get(this.basePath, {
      params: { page, size },
    });
    return response.data;
  }

  // Lấy chi tiết user
  async getById(id: string): Promise<UserResponse> {
    const response = await axiosInstance.get(`${this.basePath}/${id}`);
    return response.data;
  }

  // Lọc users theo role
  async getUsersByRole(
    role: string,
    page: number = 0,
    size: number = 100
  ): Promise<UserResponse[]> {
    const pageData = await this.getUsers(page, size);
    return pageData.content.filter((user) => user.roles.includes(role));
  }

  // Lấy customers (users có role CUSTOMER)
  async getCustomers(): Promise<UserResponse[]> {
    return this.getUsersByRole("CUSTOMER");
  }

  // Lấy sellers (users có role SELLER)
  async getSellers(): Promise<UserResponse[]> {
    return this.getUsersByRole("SELLER");
  }

  // Lấy sellers với thông tin chi tiết (products, orders, revenue)
  async getSellersWithStats(): Promise<SellerStatsResponse[]> {
    const response = await axiosInstance.get(`${this.basePath}/sellers`);
    return response.data;
  }

  // Lấy số lượng store đang pending
  async getPendingStoresCount(): Promise<number> {
    const sellers = await this.getSellersWithStats();
    return sellers.filter((seller) => seller.store?.status === "PENDING")
      .length;
  }

  // Thêm role cho user
  async addRole(
    userId: string,
    role: AddRoleRequest["role"]
  ): Promise<UserResponse> {
    const response = await axiosInstance.put(
      `${this.basePath}/${userId}/roles/${role}`
    );
    return response.data;
  }

  // Xóa role của user
  async removeRole(
    userId: string,
    role: AddRoleRequest["role"]
  ): Promise<UserResponse> {
    const response = await axiosInstance.delete(
      `${this.basePath}/${userId}/roles/${role}`
    );
    return response.data;
  }

  // Upload avatar
  async uploadAvatar(userId: string, file: File): Promise<UserResponse> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axiosInstance.post(
      `${this.basePath}/${userId}/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Delete avatar
  async deleteAvatar(userId: string): Promise<UserResponse> {
    const response = await axiosInstance.delete(
      `${this.basePath}/${userId}/avatar`
    );
    return response.data;
  }

  // Ban user (set isActive to false)
  async banUser(userId: string): Promise<UserResponse> {
    // Note: Backend needs an update endpoint for isActive
    // For now, we'll use the update endpoint if it exists
    const response = await axiosInstance.put(`${this.basePath}/${userId}`, {
      isActive: false,
    });
    return response.data;
  }

  // Unban user (set isActive to true)
  async unbanUser(userId: string): Promise<UserResponse> {
    const response = await axiosInstance.put(`${this.basePath}/${userId}`, {
      isActive: true,
    });
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
