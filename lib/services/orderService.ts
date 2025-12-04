import axiosInstance from "@/lib/api/axiosConfig";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";
export type PaymentMethod = "COD" | "QTIWALLET";

// DTO bám theo OrderResponseDto của backend
export interface OrderResponseDto {
  id: number;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerAvatar?: string;
  shippingReceiver?: string;
  shippingPhone?: string;
  storeId: number;
  storeName?: string;
  driverId?: number;
  driverName?: string;
  driverPhone?: string;
  shippingAddressId?: number;
  shippingAddress?: string;
  totalAmount?: number;
  itemsTotal?: number;
  shippingFee?: number;
  discountAmount?: number;
  adminVoucherId?: number;
  sellerVoucherId?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paidAt?: string;
  orderStatus?: OrderStatus;
  note?: string;
  cancelReason?: string;
  expectedDeliveryTime?: string;
  ratingStatus?: boolean;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItemResponseDto[];
}

export interface OrderItemResponseDto {
  id: number;
  orderId?: number;
  productId?: number;
  productName?: string;
  productImage?: string;
  quantity?: number;
  price?: number;
  totalPrice?: number;
}

class OrderService {
  private readonly basePath = "/api/orders";

  async getByStore(storeId: number): Promise<OrderResponseDto[]> {
    const res = await axiosInstance.get(`${this.basePath}/store/${storeId}`);
    return res.data;
  }

  async getById(id: number): Promise<OrderResponseDto> {
    const res = await axiosInstance.get(`${this.basePath}/${id}`);
    return res.data;
  }

  async updateStatus(id: number, status: OrderStatus) {
    const res = await axiosInstance.patch(
      `${this.basePath}/${id}/status`,
      {},
      { params: { status } }
    );
    return res.data as OrderResponseDto;
  }
}

export const orderService = new OrderService();
export default orderService;
