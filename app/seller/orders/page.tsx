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
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import {
  Order,
  OrderStats,
  OrderStatus,
  PaymentStatus,
  getOrdersAPI,
  updateOrderStatusAPI,
  getOrderStatusColor,
  getPaymentStatusColor,
  getOrderStatusText,
  formatPrice,
  formatDateTime,
} from "@/lib/mockData/orders";
import OrderFilters from "./components/OrderFilters";
import OrderStatusModal from "./components/OrderStatusModal";

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
    setLoading(true);
    try {
      const filterParams = {
        ...(filters.status !== "ALL" && { status: filters.status }),
        ...(filters.paymentStatus !== "ALL" && {
          paymentStatus: filters.paymentStatus,
        }),
        ...(filters.search && { search: filters.search }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
        sortBy: filters.sortBy,
        order: filters.order,
      };

      const data = await getOrdersAPI(filterParams);
      setOrders(data.orders);
      setStats(data.stats);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (status: OrderStatus, note?: string) => {
    if (!selectedOrder) return;

    setUpdateLoading(true);
    try {
      const updatedOrder = await updateOrderStatusAPI(
        selectedOrder.id,
        status,
        note
      );
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
            Order Management
          </h1>
          <p className="text-gray-600">
            Manage and track all your restaurant orders
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Pending</p>
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
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
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
                  <p className="text-sm font-medium text-gray-600">Preparing</p>
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
                  <p className="text-sm font-medium text-gray-600">Shipping</p>
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
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.deliveredOrders}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatPrice(stats.totalRevenue).replace("₫", "")}k
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </Card>
          </div>
        )}

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
              <span className="ml-3 text-gray-600">Loading orders...</span>
            </div>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              {filters.search ||
              filters.status !== "ALL" ||
              filters.paymentStatus !== "ALL"
                ? "Try adjusting your filters to see more orders"
                : "Orders will appear here when customers place them"}
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
                              Order #{order.id}
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
                            Customer
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
                            Delivery Address
                          </h4>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.address}
                          </p>
                          {order.note && (
                            <p className="text-sm text-orange-600 mt-1">
                              <strong>Note:</strong> {order.note}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Items ({order.items.length})
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          {order.items.slice(0, 4).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                            >
                              {item.productImage && (
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {item.quantity}x {formatPrice(item.price)} ={" "}
                                  {formatPrice(item.total)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="p-2 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
                              +{order.items.length - 4} more items
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex flex-col gap-2 ml-6">
                      <Link href={`/seller/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
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
                            Update Status
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
