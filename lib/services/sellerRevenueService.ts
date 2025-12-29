import axios from "axios";

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
}/api`;

export interface SalesDataPoint {
  label: string; // Changed from 'date' to 'label' to match backend
  revenue: number;
  orders: number;
}

export interface SalesStats {
  period: string;
  startDate: string;
  endDate: string;
  totalOrders: number;
  totalRevenue: number;
  storeViewCount: number;
  storeLikeCount: number;
  points: SalesDataPoint[];
}

export interface RevenueStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalDiscount: number;
  totalShippingFee: number;
  totalCommission: number;
  netRevenue: number;
  previousPeriodRevenue: number;
  revenueGrowth: number;
}

export interface ChartData {
  date: string;
  revenue: number;
  orders: number;
  discount: number;
  commission: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalSold: number;
  totalRevenue: number;
}

class SellerRevenueService {
  /**
   * Get sales statistics for a store
   */
  async getSalesStats(
    storeId: number,
    period: "daily" | "weekly" | "monthly"
  ): Promise<SalesStats> {
    try {
      const url = `${API_BASE_URL}/orders/store/${storeId}/sales-stats`;
      console.log("[getSalesStats] Calling API:", url, "with period:", period);
      console.log("[getSalesStats] API_BASE_URL:", API_BASE_URL);

      const response = await axios.get<SalesStats>(url, {
        params: { period },
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching sales stats:", error);
      const axiosError = error as {
        message?: string;
        response?: { data?: unknown; status?: number };
        config?: { url?: string };
      };
      console.error("Error details:", {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
        url: axiosError.config?.url,
      });
      throw error;
    }
  }

  /**
   * Get sales statistics for a store by custom date range
   */
  async getSalesStatsByDateRange(
    storeId: number,
    startDate: string,
    endDate: string
  ): Promise<SalesStats> {
    try {
      const url = `${API_BASE_URL}/orders/store/${storeId}/sales-stats/custom`;
      console.log(
        "[getSalesStatsByDateRange] Calling API:",
        url,
        "from:",
        startDate,
        "to:",
        endDate
      );

      const response = await axios.get<SalesStats>(url, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching sales stats by date range:", error);
      const axiosError = error as {
        message?: string;
        response?: { data?: unknown; status?: number };
        config?: { url?: string };
      };
      console.error("Error details:", {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
        url: axiosError.config?.url,
      });
      throw error;
    }
  }

  /**
   * Get top selling products for a store
   */
  async getTopProducts(
    storeId: number,
    limit: number = 5
  ): Promise<TopProduct[]> {
    try {
      const response = await axios.get<TopProduct[]>(
        `${API_BASE_URL}/orders/store/${storeId}/top-products`,
        {
          params: { limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching top products:", error);
      throw error;
    }
  }

  /**
   * Calculate revenue statistics from sales data
   */
  calculateRevenueStats(
    salesStats: SalesStats,
    previousStats?: SalesStats
  ): RevenueStats {
    const totalRevenue = salesStats.totalRevenue;
    const totalOrders = salesStats.totalOrders;

    // Estimate discounts and commission (these should come from actual data if available)
    const totalDiscount = totalRevenue * 0.1; // 10% estimated discount
    const totalShippingFee = totalOrders * 20000; // 20k VND per order estimated
    const totalCommission = totalRevenue * 0.05; // 5% platform commission

    const netRevenue = totalRevenue - totalDiscount - totalCommission;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const previousPeriodRevenue =
      previousStats?.totalRevenue || totalRevenue * 0.85;
    const revenueGrowth =
      previousPeriodRevenue > 0
        ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
        : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalDiscount,
      totalShippingFee,
      totalCommission,
      netRevenue,
      previousPeriodRevenue,
      revenueGrowth,
    };
  }

  /**
   * Convert sales data points to chart data
   */
  convertToChartData(salesStats: SalesStats): ChartData[] {
    return salesStats.points.map((point) => ({
      date: point.label, // Map 'label' from backend to 'date' for charts
      revenue: point.revenue,
      orders: point.orders,
      discount: point.revenue * 0.1, // Estimated 10% discount
      commission: point.revenue * 0.05, // Estimated 5% commission
    }));
  }

  /**
   * Format currency in VND
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  /**
   * Format number with thousand separators
   */
  formatNumber(num: number): string {
    return new Intl.NumberFormat("vi-VN").format(num);
  }

  /**
   * Format percentage
   */
  formatPercentage(num: number): string {
    return `${num >= 0 ? "+" : ""}${num.toFixed(1)}%`;
  }

  /**
   * Get revenue growth color
   */
  getRevenueGrowthColor(growth: number): string {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  }

  /**
   * Get revenue growth icon name
   */
  getRevenueGrowthIcon(growth: number): string {
    if (growth > 0) return "trending-up";
    if (growth < 0) return "trending-down";
    return "minus";
  }
}

export const sellerRevenueService = new SellerRevenueService();
export default sellerRevenueService;
