// Order related types and mock data
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";
export type PaymentMethod = "COD" | "QTIWALLET";
export type DeliveryStatus =
  | "ASSIGNED"
  | "PICKED_UP"
  | "DELIVERING"
  | "COMPLETED"
  | "RETURNED";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicleType: string;
  vehiclePlate: string;
}

export interface Address {
  id: string;
  receiver: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  customer: Customer;
  storeId: string;
  driverId?: string;
  driver?: Driver;
  shippingAddress: Address;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  adminVoucherId?: string;
  sellerVoucherId?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  orderStatus: OrderStatus;
  note?: string;
  cancelReason?: string;
  expectedDeliveryTime?: string;
  ratingStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  preparingOrders: number;
  shippingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
}

// Mock data
export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+84 901 234 567",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+84 902 345 678",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+84 903 456 789",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
];

export const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "Nguyen Van A",
    phone: "+84 911 111 111",
    avatar:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face",
    vehicleType: "Motorcycle",
    vehiclePlate: "29A-12345",
  },
  {
    id: "2",
    name: "Tran Thi B",
    phone: "+84 922 222 222",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    vehicleType: "Motorcycle",
    vehiclePlate: "30B-67890",
  },
];

export const mockOrders: Order[] = [
  {
    id: "1001",
    customerId: "1",
    customer: mockCustomers[0],
    storeId: "store1",
    driverId: "1",
    driver: mockDrivers[0],
    shippingAddress: {
      id: "1",
      receiver: "John Doe",
      phone: "+84 901 234 567",
      address: "123 Nguyen Trai Street, District 1, Ho Chi Minh City",
      latitude: 10.762622,
      longitude: 106.660172,
    },
    items: [
      {
        id: "1",
        productId: "1",
        productName: "Pho Bo Special",
        productImage:
          "https://images.unsplash.com/photo-1559847844-5315695dadae?w=100&h=100&fit=crop",
        quantity: 2,
        price: 85000,
        total: 170000,
      },
      {
        id: "2",
        productId: "2",
        productName: "Vietnamese Iced Coffee",
        productImage:
          "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=100&h=100&fit=crop",
        quantity: 1,
        price: 45000,
        total: 45000,
      },
    ],
    totalAmount: 230000,
    shippingFee: 15000,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    orderStatus: "CONFIRMED",
    note: "Please deliver before 12:00 PM",
    expectedDeliveryTime: "2024-11-27T12:00:00Z",
    ratingStatus: false,
    createdAt: "2024-11-27T09:30:00Z",
    updatedAt: "2024-11-27T09:45:00Z",
  },
  {
    id: "1002",
    customerId: "2",
    customer: mockCustomers[1],
    storeId: "store1",
    driverId: "2",
    driver: mockDrivers[1],
    shippingAddress: {
      id: "2",
      receiver: "Jane Smith",
      phone: "+84 902 345 678",
      address: "456 Le Van Sy Street, District 3, Ho Chi Minh City",
      latitude: 10.786785,
      longitude: 106.682354,
    },
    items: [
      {
        id: "3",
        productId: "3",
        productName: "Broken Rice with Grilled Pork",
        productImage:
          "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=100&h=100&fit=crop",
        quantity: 1,
        price: 75000,
        total: 75000,
      },
    ],
    totalAmount: 90000,
    shippingFee: 15000,
    paymentMethod: "QTIWALLET",
    paymentStatus: "SUCCESS",
    paidAt: "2024-11-27T10:15:00Z",
    orderStatus: "PREPARING",
    ratingStatus: false,
    createdAt: "2024-11-27T10:15:00Z",
    updatedAt: "2024-11-27T10:20:00Z",
  },
  {
    id: "1003",
    customerId: "3",
    customer: mockCustomers[2],
    storeId: "store1",
    shippingAddress: {
      id: "3",
      receiver: "Mike Johnson",
      phone: "+84 903 456 789",
      address: "789 Pasteur Street, District 1, Ho Chi Minh City",
      latitude: 10.779738,
      longitude: 106.695297,
    },
    items: [
      {
        id: "4",
        productId: "4",
        productName: "Banh Mi Thit Nuong",
        productImage:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=100&h=100&fit=crop",
        quantity: 3,
        price: 35000,
        total: 105000,
      },
      {
        id: "5",
        productId: "5",
        productName: "Fresh Spring Rolls",
        productImage:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop",
        quantity: 2,
        price: 60000,
        total: 120000,
      },
    ],
    totalAmount: 240000,
    shippingFee: 15000,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    orderStatus: "PENDING",
    note: "Call before delivery",
    ratingStatus: false,
    createdAt: "2024-11-27T11:00:00Z",
    updatedAt: "2024-11-27T11:00:00Z",
  },
  {
    id: "1004",
    customerId: "1",
    customer: mockCustomers[0],
    storeId: "store1",
    shippingAddress: {
      id: "1",
      receiver: "John Doe",
      phone: "+84 901 234 567",
      address: "123 Nguyen Trai Street, District 1, Ho Chi Minh City",
      latitude: 10.762622,
      longitude: 106.660172,
    },
    items: [
      {
        id: "6",
        productId: "6",
        productName: "Sweet Dessert Soup",
        productImage:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop",
        quantity: 2,
        price: 40000,
        total: 80000,
      },
    ],
    totalAmount: 95000,
    shippingFee: 15000,
    paymentMethod: "QTIWALLET",
    paymentStatus: "SUCCESS",
    paidAt: "2024-11-26T15:30:00Z",
    orderStatus: "DELIVERED",
    ratingStatus: true,
    createdAt: "2024-11-26T14:00:00Z",
    updatedAt: "2024-11-26T16:45:00Z",
  },
  {
    id: "1005",
    customerId: "2",
    customer: mockCustomers[1],
    storeId: "store1",
    shippingAddress: {
      id: "2",
      receiver: "Jane Smith",
      phone: "+84 902 345 678",
      address: "456 Le Van Sy Street, District 3, Ho Chi Minh City",
      latitude: 10.786785,
      longitude: 106.682354,
    },
    items: [
      {
        id: "7",
        productId: "2",
        productName: "Vietnamese Iced Coffee",
        productImage:
          "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=100&h=100&fit=crop",
        quantity: 2,
        price: 45000,
        total: 90000,
      },
    ],
    totalAmount: 105000,
    shippingFee: 15000,
    paymentMethod: "COD",
    paymentStatus: "FAILED",
    orderStatus: "CANCELLED",
    cancelReason: "Customer cancelled - changed mind",
    ratingStatus: false,
    createdAt: "2024-11-25T09:20:00Z",
    updatedAt: "2024-11-25T10:15:00Z",
  },
];

// Mock API functions
export const getOrdersAPI = async (filters?: {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}): Promise<{ orders: Order[]; total: number; stats: OrderStats }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  let filteredOrders = [...mockOrders];

  // Apply filters
  if (filters?.status) {
    filteredOrders = filteredOrders.filter(
      (order) => order.orderStatus === filters.status
    );
  }

  if (filters?.paymentStatus) {
    filteredOrders = filteredOrders.filter(
      (order) => order.paymentStatus === filters.paymentStatus
    );
  }

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm) ||
        order.customer.name.toLowerCase().includes(searchTerm) ||
        order.customer.phone.includes(searchTerm) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(searchTerm)
        )
    );
  }

  if (filters?.dateFrom) {
    filteredOrders = filteredOrders.filter(
      (order) => new Date(order.createdAt) >= new Date(filters.dateFrom!)
    );
  }

  if (filters?.dateTo) {
    filteredOrders = filteredOrders.filter(
      (order) => new Date(order.createdAt) <= new Date(filters.dateTo!)
    );
  }

  // Sort
  const sortBy = filters?.sortBy || "createdAt";
  const sortOrder = filters?.order || "desc";

  filteredOrders.sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case "totalAmount":
        aVal = a.totalAmount;
        bVal = b.totalAmount;
        break;
      case "createdAt":
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
        break;
      case "customerName":
        aVal = a.customer.name;
        bVal = b.customer.name;
        break;
      default:
        aVal = a.createdAt;
        bVal = b.createdAt;
    }

    if (sortOrder === "asc") {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  // Calculate stats
  const stats: OrderStats = {
    totalOrders: mockOrders.length,
    pendingOrders: mockOrders.filter((o) => o.orderStatus === "PENDING").length,
    confirmedOrders: mockOrders.filter((o) => o.orderStatus === "CONFIRMED")
      .length,
    preparingOrders: mockOrders.filter((o) => o.orderStatus === "PREPARING")
      .length,
    shippingOrders: mockOrders.filter((o) => o.orderStatus === "SHIPPING")
      .length,
    deliveredOrders: mockOrders.filter((o) => o.orderStatus === "DELIVERED")
      .length,
    cancelledOrders: mockOrders.filter((o) => o.orderStatus === "CANCELLED")
      .length,
    totalRevenue: mockOrders
      .filter((o) => o.orderStatus === "DELIVERED")
      .reduce((sum, o) => sum + o.totalAmount, 0),
    todayOrders: mockOrders.filter(
      (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
    ).length,
    todayRevenue: mockOrders
      .filter(
        (o) =>
          o.orderStatus === "DELIVERED" &&
          new Date(o.createdAt).toDateString() === new Date().toDateString()
      )
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return {
    orders: filteredOrders,
    total: filteredOrders.length,
    stats,
  };
};

export const getOrderByIdAPI = async (id: string): Promise<Order | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrders.find((order) => order.id === id) || null;
};

export const updateOrderStatusAPI = async (
  id: string,
  status: OrderStatus,
  note?: string
): Promise<Order> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const orderIndex = mockOrders.findIndex((order) => order.id === id);
  if (orderIndex === -1) {
    throw new Error("Order not found");
  }

  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    orderStatus: status,
    updatedAt: new Date().toISOString(),
    ...(status === "CANCELLED" && note && { cancelReason: note }),
  };

  return mockOrders[orderIndex];
};

export const assignDriverAPI = async (
  orderId: string,
  driverId: string
): Promise<Order> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const orderIndex = mockOrders.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) {
    throw new Error("Order not found");
  }

  const driver = mockDrivers.find((d) => d.id === driverId);
  if (!driver) {
    throw new Error("Driver not found");
  }

  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    driverId,
    driver,
    updatedAt: new Date().toISOString(),
  };

  return mockOrders[orderIndex];
};

// Helper functions
export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "PREPARING":
      return "bg-orange-100 text-orange-800";
    case "SHIPPING":
      return "bg-purple-100 text-purple-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "SUCCESS":
      return "bg-green-100 text-green-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getOrderStatusText = (status: OrderStatus): string => {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "CONFIRMED":
      return "Confirmed";
    case "PREPARING":
      return "Preparing";
    case "SHIPPING":
      return "Shipping";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};
