// Revenue data types and mock data based on database schema

export interface RevenueReport {
  id: number;
  store_id: number;
  total_orders: number;
  total_revenue: number;
  total_discount: number;
  total_shipping_fee: number;
  report_date: string;
  created_at: string;
}

export interface PlatformRevenueReport {
  id: number;
  store_id: number;
  seller_id: number;
  total_orders: number;
  total_revenue: number;
  total_discount: number;
  total_shipping_fee: number;
  total_commission: number;
  report_type: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  report_date: string;
  created_at: string;
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

// Mock revenue reports for the current store
export const mockRevenueReports: RevenueReport[] = [
  {
    id: 1,
    store_id: 1,
    total_orders: 45,
    total_revenue: 2850000,
    total_discount: 285000,
    total_shipping_fee: 180000,
    report_date: "2024-11-27",
    created_at: "2024-11-27T00:00:00Z",
  },
  {
    id: 2,
    store_id: 1,
    total_orders: 38,
    total_revenue: 2420000,
    total_discount: 242000,
    total_shipping_fee: 152000,
    report_date: "2024-11-26",
    created_at: "2024-11-26T00:00:00Z",
  },
  {
    id: 3,
    store_id: 1,
    total_orders: 52,
    total_revenue: 3320000,
    total_discount: 332000,
    total_shipping_fee: 208000,
    report_date: "2024-11-25",
    created_at: "2024-11-25T00:00:00Z",
  },
  {
    id: 4,
    store_id: 1,
    total_orders: 41,
    total_revenue: 2610000,
    total_discount: 261000,
    total_shipping_fee: 164000,
    report_date: "2024-11-24",
    created_at: "2024-11-24T00:00:00Z",
  },
  {
    id: 5,
    store_id: 1,
    total_orders: 47,
    total_revenue: 2990000,
    total_discount: 299000,
    total_shipping_fee: 188000,
    report_date: "2024-11-23",
    created_at: "2024-11-23T00:00:00Z",
  },
  {
    id: 6,
    store_id: 1,
    total_orders: 35,
    total_revenue: 2230000,
    total_discount: 223000,
    total_shipping_fee: 140000,
    report_date: "2024-11-22",
    created_at: "2024-11-22T00:00:00Z",
  },
  {
    id: 7,
    store_id: 1,
    total_orders: 49,
    total_revenue: 3120000,
    total_discount: 312000,
    total_shipping_fee: 196000,
    report_date: "2024-11-21",
    created_at: "2024-11-21T00:00:00Z",
  },
];

export const mockPlatformRevenueReports: PlatformRevenueReport[] = [
  {
    id: 1,
    store_id: 1,
    seller_id: 2,
    total_orders: 45,
    total_revenue: 2850000,
    total_discount: 285000,
    total_shipping_fee: 180000,
    total_commission: 142500, // 5% of total revenue
    report_type: "DAILY",
    report_date: "2024-11-27",
    created_at: "2024-11-27T00:00:00Z",
  },
  {
    id: 2,
    store_id: 1,
    seller_id: 2,
    total_orders: 38,
    total_revenue: 2420000,
    total_discount: 242000,
    total_shipping_fee: 152000,
    total_commission: 121000,
    report_type: "DAILY",
    report_date: "2024-11-26",
    created_at: "2024-11-26T00:00:00Z",
  },
  {
    id: 3,
    store_id: 1,
    seller_id: 2,
    total_orders: 307,
    total_revenue: 19540000,
    total_discount: 1954000,
    total_shipping_fee: 1228000,
    total_commission: 977000,
    report_type: "WEEKLY",
    report_date: "2024-11-25",
    created_at: "2024-11-25T00:00:00Z",
  },
  {
    id: 4,
    store_id: 1,
    seller_id: 2,
    total_orders: 1245,
    total_revenue: 79280000,
    total_discount: 7928000,
    total_shipping_fee: 4978000,
    total_commission: 3964000,
    report_type: "MONTHLY",
    report_date: "2024-11-01",
    created_at: "2024-11-01T00:00:00Z",
  },
];

// Generate chart data for the last 30 days
export const generateChartData = (days: number = 30): ChartData[] => {
  const data: ChartData[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate realistic revenue data with some randomness
    const baseRevenue = 2500000 + Math.random() * 1000000;
    const orders = Math.floor(30 + Math.random() * 30);
    const discount = baseRevenue * (0.08 + Math.random() * 0.04); // 8-12% discount
    const commission = baseRevenue * 0.05; // 5% commission

    data.push({
      date: date.toISOString().split("T")[0],
      revenue: Math.floor(baseRevenue),
      orders,
      discount: Math.floor(discount),
      commission: Math.floor(commission),
    });
  }

  return data;
};

// Revenue API functions
export const revenueAPI = {
  // Get revenue statistics for a date range
  getRevenueStats: async (
    startDate: string,
    endDate: string
  ): Promise<RevenueStats> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    const reports = mockRevenueReports.filter(
      (report) =>
        report.report_date >= startDate && report.report_date <= endDate
    );

    const totalRevenue = reports.reduce((sum, r) => sum + r.total_revenue, 0);
    const totalOrders = reports.reduce((sum, r) => sum + r.total_orders, 0);
    const totalDiscount = reports.reduce((sum, r) => sum + r.total_discount, 0);
    const totalShippingFee = reports.reduce(
      (sum, r) => sum + r.total_shipping_fee,
      0
    );

    // Calculate commission (5% of total revenue)
    const totalCommission = totalRevenue * 0.05;
    const netRevenue = totalRevenue - totalDiscount - totalCommission;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Mock previous period data for growth calculation
    const previousPeriodRevenue = totalRevenue * (0.85 + Math.random() * 0.3);
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
  },

  // Get revenue reports with pagination
  getRevenueReports: async (
    page: number = 1,
    limit: number = 10,
    reportType: "DAILY" | "WEEKLY" | "MONTHLY" = "DAILY"
  ): Promise<{ reports: RevenueReport[]; total: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const start = (page - 1) * limit;
    const end = start + limit;
    const reports = mockRevenueReports.slice(start, end);

    return {
      reports,
      total: mockRevenueReports.length,
    };
  },

  // Get chart data for visualization
  getChartData: async (
    startDate: string,
    endDate: string,
    reportType: "DAILY" | "WEEKLY" | "MONTHLY" = "DAILY"
  ): Promise<ChartData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return generateChartData(diffDays);
  },

  // Export revenue data
  exportRevenueData: async (
    startDate: string,
    endDate: string,
    format: "CSV" | "PDF" = "CSV"
  ): Promise<Blob> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const reports = mockRevenueReports.filter(
      (report) =>
        report.report_date >= startDate && report.report_date <= endDate
    );

    if (format === "CSV") {
      const csvContent = [
        "Date,Orders,Revenue,Discount,Shipping Fee,Net Revenue",
        ...reports.map(
          (r) =>
            `${r.report_date},${r.total_orders},${r.total_revenue},${
              r.total_discount
            },${r.total_shipping_fee},${r.total_revenue - r.total_discount}`
        ),
      ].join("\n");

      return new Blob([csvContent], { type: "text/csv" });
    }

    // For PDF, return a mock blob
    return new Blob(["PDF content"], { type: "application/pdf" });
  },
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

export const formatPercentage = (num: number): string => {
  return `${num >= 0 ? "+" : ""}${num.toFixed(1)}%`;
};

export const getRevenueGrowthColor = (growth: number): string => {
  if (growth > 0) return "text-green-600";
  if (growth < 0) return "text-red-600";
  return "text-gray-600";
};

export const getRevenueGrowthIcon = (growth: number): string => {
  if (growth > 0) return "trending-up";
  if (growth < 0) return "trending-down";
  return "minus";
};
