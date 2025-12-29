import orderService, {
  SalesStatsDto,
  TopProductDto,
  OrderResponseDto,
} from "./orderService";
import { notificationService } from "./notificationService";
import { Notification } from "@/types/notification";
import axiosInstance from "@/lib/api/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface DashboardData {
  stats: SalesStatsDto | null;
  topProduct: TopProductDto | null;
  recentOrders: OrderResponseDto[];
  notifications: Notification[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface PlatformSalesStats {
  period: string;
  startDate: string;
  endDate: string;
  totalOrders: number;
  totalRevenue: number;
  storeViewCount: number;
  storeLikeCount: number;
  points: Array<{
    label: string;
    revenue: number;
    orders: number;
  }>;
}

export interface RecentUser {
  id: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  createdAt: string;
  roles: string[];
}

class DashboardService {
  /**
   * Fetch all dashboard data for seller
   * @param storeId - Store ID from localStorage
   * @param userId - User ID from user_info in localStorage
   * @returns Dashboard data object
   */
  async getDashboardData(
    storeId: number,
    userId: string | null
  ): Promise<DashboardData> {
    try {
      // Fetch data in parallel using axios through services
      const [statsData, topProducts, orders, notifs] = await Promise.all([
        orderService.getSalesStats(storeId, "daily").catch(() => null),
        orderService.getTopProducts(storeId, 1).catch(() => []),
        orderService.getByStore(storeId).catch(() => []),
        userId
          ? notificationService.getNotifications(userId, 3).catch(() => [])
          : Promise.resolve([]),
      ]);

      return {
        stats: statsData,
        topProduct: topProducts[0] || null,
        recentOrders: orders.slice(0, 3), // Get 3 most recent orders
        notifications: notifs,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }

  /**
   * Get total users count for admin dashboard
   */
  async getTotalUsers(): Promise<number> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/api/users`);
      return response.data?.totalElements || response.data?.length || 0;
    } catch (error) {
      console.error("Error fetching total users:", error);
      return 0;
    }
  }

  /**
   * Get total products count for admin dashboard
   */
  async getTotalProducts(): Promise<number> {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/products/isnot_deleted`
      );
      return Array.isArray(response.data) ? response.data.length : 0;
    } catch (error) {
      console.error("Error fetching total products:", error);
      return 0;
    }
  }

  /**
   * Get total orders count for admin dashboard
   */
  async getTotalOrders(): Promise<number> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/api/orders`);
      return Array.isArray(response.data) ? response.data.length : 0;
    } catch (error) {
      console.error("Error fetching total orders:", error);
      return 0;
    }
  }

  /**
   * Get total revenue from all orders for admin dashboard
   */
  async getTotalRevenue(): Promise<number> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/api/orders`);
      if (Array.isArray(response.data)) {
        return response.data.reduce((total: number, order: any) => {
          return total + (order.totalAmount || 0);
        }, 0);
      }
      return 0;
    } catch (error) {
      console.error("Error fetching total revenue:", error);
      return 0;
    }
  }

  /**
   * Get all admin dashboard stats at once
   */
  async getAdminStats(): Promise<AdminDashboardStats> {
    try {
      const [totalUsers, totalProducts, totalOrders, totalRevenue] =
        await Promise.all([
          this.getTotalUsers(),
          this.getTotalProducts(),
          this.getTotalOrders(),
          this.getTotalRevenue(),
        ]);

      return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      };
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error);
      return {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
      };
    }
  }

  /**
   * Get platform sales stats for admin dashboard (daily/weekly/monthly)
   */
  async getPlatformSalesStats(
    period: "daily" | "weekly" | "monthly" = "monthly"
  ): Promise<PlatformSalesStats | null> {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/orders/platform/sales-stats?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching platform sales stats:", error);
      return null;
    }
  }

  /**
   * Get platform sales stats by custom date range
   */
  async getPlatformSalesStatsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<PlatformSalesStats | null> {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/orders/platform/sales-stats/custom?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching platform sales stats by date range:",
        error
      );
      return null;
    }
  }

  /**
   * Get recent users for admin dashboard
   */
  async getRecentUsers(limit: number = 5): Promise<RecentUser[]> {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/users?page=0&size=${limit}&sort=createdAt,desc`
      );
      // Response is paginated: { content: [], totalElements, ... }
      return response.data?.content || [];
    } catch (error) {
      console.error("Error fetching recent users:", error);
      return [];
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
