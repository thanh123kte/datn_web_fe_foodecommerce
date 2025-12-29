import axios from "axios";

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
}/api`;

// ===== INTERFACES =====

export interface OverallStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalStores: number;
  totalProducts: number;
  totalCommission: number;
  averageOrderValue: number;
  activeStores: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface RevenueDataPoint {
  label: string;
  revenue: number;
  orders: number;
  commission: number;
}

export interface RevenueStats {
  period: string;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalOrders: number;
  totalCommission: number;
  averageOrderValue: number;
  points: RevenueDataPoint[];
}

export interface UserGrowthPoint {
  label: string;
  users: number;
  sellers: number;
  customers: number;
}

export interface UserGrowthStats {
  period: string;
  totalUsers: number;
  totalSellers: number;
  totalCustomers: number;
  points: UserGrowthPoint[];
}

export interface TopStore {
  storeId: number;
  storeName: string;
  totalOrders: number;
  totalRevenue: number;
  commission: number;
  rating: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  storeName: string;
  totalSold: number;
  totalRevenue: number;
  categoryName: string;
}

export interface ChartData {
  date: string;
  revenue: number;
  orders: number;
  commission: number;
  users?: number;
}

// ===== SERVICE CLASS =====

class AdminStatisticsService {
  /**
   * Get overall platform statistics
   * Aggregates data from all stores
   */
  async getOverallStats(): Promise<OverallStats> {
    try {
      // Since backend doesn't have a dedicated admin stats endpoint yet,
      // we'll aggregate from multiple endpoints
      const [ordersRes, usersRes, storesRes, productsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/orders`),
        axios.get(`${API_BASE_URL}/users`),
        axios.get(`${API_BASE_URL}/stores`),
        axios.get(`${API_BASE_URL}/products`),
      ]);

      const orders = ordersRes.data || [];
      const users = usersRes.data || [];
      const stores = storesRes.data || [];
      const products = productsRes.data || [];

      // Calculate statistics
      const totalRevenue = orders.reduce(
        (sum: number, order: any) => sum + (order.totalAmount || 0),
        0
      );
      const totalOrders = orders.length;
      const completedOrders = orders.filter(
        (order: any) => order.status === "DELIVERED"
      ).length;
      const pendingOrders = orders.filter(
        (order: any) =>
          order.status === "PENDING" || order.status === "PROCESSING"
      ).length;

      // Calculate commission (assume 10% platform fee)
      const totalCommission = totalRevenue * 0.1;

      const activeStores = stores.filter(
        (store: any) => store.isActive
      ).length;

      return {
        totalRevenue,
        totalOrders,
        totalUsers: users.length,
        totalStores: stores.length,
        totalProducts: products.length,
        totalCommission,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        activeStores,
        pendingOrders,
        completedOrders,
      };
    } catch (error) {
      console.error("Failed to fetch overall stats:", error);
      // Return empty stats on error
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalStores: 0,
        totalProducts: 0,
        totalCommission: 0,
        averageOrderValue: 0,
        activeStores: 0,
        pendingOrders: 0,
        completedOrders: 0,
      };
    }
  }

  /**
   * Get revenue statistics with time-series data
   * @param period - "daily" | "weekly" | "monthly"
   * @param startDate - Optional start date (YYYY-MM-DD)
   * @param endDate - Optional end date (YYYY-MM-DD)
   */
  async getRevenueStats(
    period: "daily" | "weekly" | "monthly" = "daily",
    startDate?: string,
    endDate?: string
  ): Promise<RevenueStats> {
    try {
      // Fetch all orders
      const response = await axios.get(`${API_BASE_URL}/orders`);
      const orders = response.data || [];

      // Filter by date range if provided
      let filteredOrders = orders;
      if (startDate && endDate) {
        filteredOrders = orders.filter((order: any) => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
          );
        });
      }

      // Group orders by period
      const groupedData = this.groupOrdersByPeriod(filteredOrders, period);

      // Calculate totals
      const totalRevenue = filteredOrders.reduce(
        (sum: number, order: any) => sum + (order.totalAmount || 0),
        0
      );
      const totalOrders = filteredOrders.length;
      const totalCommission = totalRevenue * 0.1; // 10% platform fee
      const averageOrderValue =
        totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        period,
        startDate: startDate || "",
        endDate: endDate || "",
        totalRevenue,
        totalOrders,
        totalCommission,
        averageOrderValue,
        points: groupedData,
      };
    } catch (error) {
      console.error("Failed to fetch revenue stats:", error);
      return {
        period,
        startDate: startDate || "",
        endDate: endDate || "",
        totalRevenue: 0,
        totalOrders: 0,
        totalCommission: 0,
        averageOrderValue: 0,
        points: [],
      };
    }
  }

  /**
   * Get user growth statistics
   * @param period - "daily" | "weekly" | "monthly"
   */
  async getUserGrowth(
    period: "daily" | "weekly" | "monthly" = "monthly"
  ): Promise<UserGrowthStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      const users = response.data || [];

      // Group users by period
      const groupedData = this.groupUsersByPeriod(users, period);

      const totalSellers = users.filter(
        (user: any) => user.role === "SELLER"
      ).length;
      const totalCustomers = users.filter(
        (user: any) => user.role === "CUSTOMER"
      ).length;

      return {
        period,
        totalUsers: users.length,
        totalSellers,
        totalCustomers,
        points: groupedData,
      };
    } catch (error) {
      console.error("Failed to fetch user growth:", error);
      return {
        period,
        totalUsers: 0,
        totalSellers: 0,
        totalCustomers: 0,
        points: [],
      };
    }
  }

  /**
   * Get top performing stores
   * @param limit - Number of stores to return
   */
  async getTopStores(limit: number = 10): Promise<TopStore[]> {
    try {
      const [ordersRes, storesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/orders`),
        axios.get(`${API_BASE_URL}/stores`),
      ]);

      const orders = ordersRes.data || [];
      const stores = storesRes.data || [];

      // Group orders by store and calculate stats
      const storeStats = new Map<number, any>();

      orders.forEach((order: any) => {
        const storeId = order.storeId;
        if (!storeId) return;

        if (!storeStats.has(storeId)) {
          storeStats.set(storeId, {
            storeId,
            totalOrders: 0,
            totalRevenue: 0,
          });
        }

        const stats = storeStats.get(storeId);
        stats.totalOrders += 1;
        stats.totalRevenue += order.totalAmount || 0;
      });

      // Combine with store details
      const topStores: TopStore[] = [];
      storeStats.forEach((stats, storeId) => {
        const store = stores.find((s: any) => s.id === storeId);
        if (store) {
          topStores.push({
            storeId: stats.storeId,
            storeName: store.name || "Unknown Store",
            totalOrders: stats.totalOrders,
            totalRevenue: stats.totalRevenue,
            commission: stats.totalRevenue * 0.1,
            rating: store.rating || 0,
          });
        }
      });

      // Sort by revenue and return top N
      return topStores
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, limit);
    } catch (error) {
      console.error("Failed to fetch top stores:", error);
      return [];
    }
  }

  /**
   * Get top selling products across all stores
   * @param limit - Number of products to return
   */
  async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
    try {
      const [ordersRes, productsRes, storesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/orders`),
        axios.get(`${API_BASE_URL}/products`),
        axios.get(`${API_BASE_URL}/stores`),
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const stores = storesRes.data || [];

      // Group order items by product
      const productStats = new Map<number, any>();

      orders.forEach((order: any) => {
        if (order.orderItems && Array.isArray(order.orderItems)) {
          order.orderItems.forEach((item: any) => {
            const productId = item.productId;
            if (!productId) return;

            if (!productStats.has(productId)) {
              productStats.set(productId, {
                productId,
                totalSold: 0,
                totalRevenue: 0,
              });
            }

            const stats = productStats.get(productId);
            stats.totalSold += item.quantity || 0;
            stats.totalRevenue += (item.price || 0) * (item.quantity || 0);
          });
        }
      });

      // Combine with product details
      const topProducts: TopProduct[] = [];
      productStats.forEach((stats, productId) => {
        const product = products.find((p: any) => p.id === productId);
        if (product) {
          const store = stores.find((s: any) => s.id === product.storeId);
          topProducts.push({
            productId: stats.productId,
            productName: product.name || "Unknown Product",
            storeName: store?.name || "Unknown Store",
            totalSold: stats.totalSold,
            totalRevenue: stats.totalRevenue,
            categoryName: product.categoryName || "Uncategorized",
          });
        }
      });

      // Sort by total sold and return top N
      return topProducts
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, limit);
    } catch (error) {
      console.error("Failed to fetch top products:", error);
      return [];
    }
  }

  /**
   * Convert revenue stats to chart data format
   */
  convertToChartData(stats: RevenueStats): ChartData[] {
    return stats.points.map((point) => ({
      date: point.label,
      revenue: point.revenue,
      orders: point.orders,
      commission: point.commission,
    }));
  }

  /**
   * Convert user growth to chart data format
   */
  convertUserGrowthToChartData(stats: UserGrowthStats): ChartData[] {
    return stats.points.map((point) => ({
      date: point.label,
      revenue: 0, // Not applicable
      orders: 0, // Not applicable
      commission: 0, // Not applicable
      users: point.users,
    }));
  }

  // ===== HELPER METHODS =====

  private groupOrdersByPeriod(
    orders: any[],
    period: "daily" | "weekly" | "monthly"
  ): RevenueDataPoint[] {
    const grouped = new Map<string, RevenueDataPoint>();

    orders.forEach((order: any) => {
      const date = new Date(order.createdAt);
      let label = "";

      if (period === "daily") {
        label = date.toISOString().split("T")[0]; // YYYY-MM-DD
      } else if (period === "weekly") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        label = weekStart.toISOString().split("T")[0];
      } else if (period === "monthly") {
        label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      }

      if (!grouped.has(label)) {
        grouped.set(label, {
          label,
          revenue: 0,
          orders: 0,
          commission: 0,
        });
      }

      const point = grouped.get(label)!;
      point.revenue += order.totalAmount || 0;
      point.orders += 1;
      point.commission += (order.totalAmount || 0) * 0.1;
    });

    // Convert to array and sort by date
    return Array.from(grouped.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }

  private groupUsersByPeriod(
    users: any[],
    period: "daily" | "weekly" | "monthly"
  ): UserGrowthPoint[] {
    const grouped = new Map<string, UserGrowthPoint>();

    users.forEach((user: any) => {
      const date = new Date(user.createdAt);
      let label = "";

      if (period === "daily") {
        label = date.toISOString().split("T")[0];
      } else if (period === "weekly") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        label = weekStart.toISOString().split("T")[0];
      } else if (period === "monthly") {
        label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      }

      if (!grouped.has(label)) {
        grouped.set(label, {
          label,
          users: 0,
          sellers: 0,
          customers: 0,
        });
      }

      const point = grouped.get(label)!;
      point.users += 1;
      if (user.role === "SELLER") {
        point.sellers += 1;
      } else if (user.role === "CUSTOMER") {
        point.customers += 1;
      }
    });

    return Array.from(grouped.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }

  // ===== FORMATTING METHODS =====

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat("vi-VN").format(num);
  }

  formatPercentage(num: number): string {
    const sign = num >= 0 ? "+" : "";
    return `${sign}${num.toFixed(1)}%`;
  }
}

export const adminStatisticsService = new AdminStatisticsService();
export default adminStatisticsService;
