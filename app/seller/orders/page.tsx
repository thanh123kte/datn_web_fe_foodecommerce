"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Package,
  Truck,
  MapPin,
  XCircle,
  Eye,
  Phone,
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  Order,
  OrderStats,
  OrderStatus,
  PaymentStatus,
  getOrderStatusColor,
  getPaymentStatusColor,
  getOrderStatusText,
  formatPrice,
  formatDateTime,
} from "@/lib/mockData/orders";
import OrderFilters from "./components/OrderFilters";
import OrderStatusModal from "./components/OrderStatusModal";
import { useAuth } from "@/contexts/AuthContext";
import { orderService, OrderResponseDto } from "@/lib/services/orderService";
import { buildAbsoluteUrl } from "@/lib/config/env";

interface OrderFilters {
  search: string;
  status: OrderStatus | "ALL";
  paymentStatus: PaymentStatus | "ALL";
  dateFrom: string;
  dateTo: string;
  sortBy: "createdAt" | "totalAmount" | "customerName";
  order: "asc" | "desc";
}

export default function OrdersPage() {
  const { currentStore, userRole, refreshStore } = useAuth();
  const storeId = currentStore?.id;

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    status: "ALL",
    paymentStatus: "ALL",
    dateFrom: "",
    dateTo: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const loadOrders = async () => {
    if (!storeId) {
      setOrders([]);
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data: OrderResponseDto[] = await orderService.getByStore(storeId);
      const resolveAvatar = (url?: string | null, name?: string | null) => {
        // Only allow local/server-hosted images; fallback to generated avatar
        const absolute =
          url && !/^https?:\/\//i.test(url) ? buildAbsoluteUrl(url) : undefined;
        if (absolute) return absolute;
        const safeName = encodeURIComponent(name || "User");
        return `https://ui-avatars.com/api/?name=${safeName}&background=E5E7EB&color=111827`;
      };

      // Map backend DTO -> UI Order model with safe fallbacks
      const mapped: Order[] = data.map((o) => ({
        id: String(o.id),
        customerId: o.customerId || "",
        customer: {
          id: o.customerId || "",
          name: o.customerName || "Khách hàng",
          email: "",
          phone: o.customerPhone || "",
          avatar: resolveAvatar(o.customerAvatar, o.customerName),
        },
        storeId: String(o.storeId || ""),
        driverId: o.driverId ? String(o.driverId) : undefined,
        driver: o.driverId
          ? {
              id: String(o.driverId),
              name: o.driverName || "Tài xế",
              phone: o.driverPhone || "",
              vehicleType: "",
              vehiclePlate: "",
            }
          : undefined,
        shippingAddress: {
          id: o.shippingAddressId ? String(o.shippingAddressId) : "",
          receiver: o.customerName || "",
          phone: o.customerPhone || "",
          address: o.shippingAddress || "",
        },
        items: [],
        totalAmount: Number(o.totalAmount ?? 0),
        shippingFee: Number(o.shippingFee ?? 0),
        adminVoucherId: o.adminVoucherId ? String(o.adminVoucherId) : undefined,
        sellerVoucherId: o.sellerVoucherId
          ? String(o.sellerVoucherId)
          : undefined,
        paymentMethod: o.paymentMethod || "COD",
        paymentStatus: o.paymentStatus || "PENDING",
        paidAt: o.paidAt || undefined,
        orderStatus: o.orderStatus || "PENDING",
        note: o.note || undefined,
        cancelReason: o.cancelReason || undefined,
        expectedDeliveryTime: o.expectedDeliveryTime || undefined,
        ratingStatus: o.ratingStatus ?? false,
        createdAt: o.createdAt || "",
        updatedAt: o.updatedAt || "",
      }));

      // Client-side filters reused from mock implementation
      const filtered = mapped.filter((order) => {
        const matchesStatus =
          filters.status === "ALL" || order.orderStatus === filters.status;
        const matchesPayment =
          filters.paymentStatus === "ALL" ||
          order.paymentStatus === filters.paymentStatus;
        const matchesSearch = filters.search
          ? order.id.toLowerCase().includes(filters.search.toLowerCase())
          : true;

        const inDateFrom = filters.dateFrom
          ? new Date(order.createdAt) >= new Date(filters.dateFrom)
          : true;
        const inDateTo = filters.dateTo
          ? new Date(order.createdAt) <= new Date(filters.dateTo)
          : true;

        return (
          matchesStatus &&
          matchesPayment &&
          matchesSearch &&
          inDateFrom &&
          inDateTo
        );
      });

      // Sorting
      const sorted = [...filtered].sort((a, b) => {
        let aVal: number | string;
        let bVal: number | string;
        switch (filters.sortBy) {
          case "totalAmount":
            aVal = a.totalAmount;
            bVal = b.totalAmount;
            break;
          case "customerName":
            aVal = a.customer.name;
            bVal = b.customer.name;
            break;
          case "createdAt":
          default:
            aVal = new Date(a.createdAt).getTime();
            bVal = new Date(b.createdAt).getTime();
        }
        return filters.order === "asc" ? aVal - bVal : bVal - aVal;
      });

      // Compute stats from full mapped list
      const statsData: OrderStats = {
        totalOrders: mapped.length,
        pendingOrders: mapped.filter((o) => o.orderStatus === "PENDING").length,
        confirmedOrders: mapped.filter((o) => o.orderStatus === "CONFIRMED")
          .length,
        preparingOrders: mapped.filter((o) => o.orderStatus === "PREPARING")
          .length,
        shippingOrders: mapped.filter((o) => o.orderStatus === "SHIPPING")
          .length,
        deliveredOrders: mapped.filter((o) => o.orderStatus === "DELIVERED")
          .length,
        cancelledOrders: mapped.filter((o) => o.orderStatus === "CANCELLED")
          .length,
        totalRevenue: mapped
          .filter((o) => o.orderStatus === "DELIVERED")
          .reduce((sum, o) => sum + o.totalAmount, 0),
        todayOrders: mapped.filter(
          (o) =>
            new Date(o.createdAt).toDateString() === new Date().toDateString()
        ).length,
        todayRevenue: mapped
          .filter(
            (o) =>
              o.orderStatus === "DELIVERED" &&
              new Date(o.createdAt).toDateString() === new Date().toDateString()
          )
          .reduce((sum, o) => sum + o.totalAmount, 0),
      };

      setOrders(sorted);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, storeId]);

  useEffect(() => {
    if (userRole === "SELLER" && !storeId) {
      refreshStore();
    }
  }, [userRole, storeId, refreshStore]);

  const handleUpdateStatus = async (status: OrderStatus, note?: string) => {
    if (!selectedOrder) return;

    setUpdateLoading(true);
    try {
      // Call API to update order status
      await orderService.updateStatus(Number(selectedOrder.id), status);

      // Update local state
      const updatedOrder = {
        ...selectedOrder,
        orderStatus: status,
        cancelReason:
          status === "CANCELLED" ? note : selectedOrder.cancelReason,
      };

      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );

      setShowStatusModal(false);
      setSelectedOrder(null);

      // Reload stats
      await loadOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return Clock;
      case "CONFIRMED":
        return CheckCircle;
      case "PREPARING":
        return Package;
      case "SHIPPING":
        return Truck;
      case "DELIVERED":
        return MapPin;
      case "CANCELLED":
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <MainLayout userRole="seller">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản Lý Đơn Hàng
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi tất cả đơn hàng của cửa hàng
          </p>
        </div>

        {/* Stats Cards */}
        {/* {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng Đơn</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chờ Xử Lý</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pendingOrders}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đã Xác Nhận
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.confirmedOrders}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đang Chuẩn Bị
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.preparingOrders}
                  </p>
                </div>
                <Package className="w-8 h-8 text-orange-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang Giao</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.shippingOrders}
                  </p>
                </div>
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã Giao</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.deliveredOrders}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
            </Card>

            
          </div>
        )} */}

        {/* Filters */}
        <OrderFilters
          filters={filters}
          onFiltersChange={setFilters}
          onApply={loadOrders}
          isLoading={loading}
        />

        {/* Orders List */}
        {loading ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Đang tải đơn hàng...</span>
            </div>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-gray-600">
              {filters.search ||
              filters.status !== "ALL" ||
              filters.paymentStatus !== "ALL"
                ? "Thử điều chỉnh bộ lọc để xem thêm đơn hàng"
                : "Đơn hàng sẽ xuất hiện ở đây khi khách hàng đặt hàng"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.orderStatus);

              return (
                <Card
                  key={order.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    {/* Left Side - Order Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Đơn hàng #{order.id}
                            </h3>
                            <Badge
                              className={getOrderStatusColor(order.orderStatus)}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {getOrderStatusText(order.orderStatus)}
                            </Badge>
                            <Badge
                              className={getPaymentStatusColor(
                                order.paymentStatus
                              )}
                            >
                              {order.paymentStatus}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{formatDateTime(order.createdAt)}</span>
                            <span>•</span>
                            <span>{order.paymentMethod}</span>
                            <span>•</span>
                            <span className="font-medium">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Khách Hàng
                          </h4>
                          <div className="flex items-center gap-3">
                            {order.customer.avatar && (
                              <img
                                src={order.customer.avatar}
                                alt={order.customer.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.customer.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                {order.customer.phone}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Địa Chỉ Giao Hàng
                          </h4>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.address}
                          </p>
                          {order.note && (
                            <p className="text-sm text-orange-600 mt-1">
                              <strong>Ghi chú:</strong> {order.note}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex flex-col gap-2 ml-6">
                      <Link href={`/seller/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Xem Chi Tiết
                        </Button>
                      </Link>

                      {order.orderStatus !== "DELIVERED" &&
                        order.orderStatus !== "CANCELLED" && (
                          <Button
                            size="sm"
                            onClick={() => openStatusModal(order)}
                            className="bg-orange-500 hover:bg-orange-600 w-full"
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Cập Nhật Trạng Thái
                          </Button>
                        )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Status Update Modal */}
        {selectedOrder && (
          <OrderStatusModal
            isOpen={showStatusModal}
            onClose={() => {
              setShowStatusModal(false);
              setSelectedOrder(null);
            }}
            onUpdateStatus={handleUpdateStatus}
            order={selectedOrder}
            isLoading={updateLoading}
          />
        )}
      </div>
    </MainLayout>
  );
}
