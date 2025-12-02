"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  User,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  MessageCircle,
  Navigation,
} from "lucide-react";
import {
  Order,
  getOrderByIdAPI,
  updateOrderStatusAPI,
  assignDriverAPI,
  getOrderStatusColor,
  getPaymentStatusColor,
  getOrderStatusText,
  formatPrice,
  formatDateTime,
  mockDrivers,
} from "@/lib/mockData/orders";
import OrderStatusModal from "../components/OrderStatusModal";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const orderData = await getOrderByIdAPI(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: any, note?: string) => {
    if (!order) return;

    setUpdateLoading(true);
    try {
      const updatedOrder = await updateOrderStatusAPI(order.id, status, note);
      setOrder(updatedOrder);
      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusTimeline = () => {
    const statuses = [
      { key: "PENDING", label: "Order Placed", icon: Clock },
      { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
      { key: "PREPARING", label: "Preparing", icon: Package },
      { key: "SHIPPING", label: "Out for Delivery", icon: Truck },
      { key: "DELIVERED", label: "Delivered", icon: MapPin },
    ];

    if (!order) return [];

    const currentStatusIndex = statuses.findIndex(
      (s) => s.key === order.orderStatus
    );

    return statuses.map((status, index) => ({
      ...status,
      completed:
        index <= currentStatusIndex && order.orderStatus !== "CANCELLED",
      current: status.key === order.orderStatus,
      cancelled: order.orderStatus === "CANCELLED" && index > 0,
    }));
  };

  if (loading) {
    return (
      <MainLayout userRole="seller">
        <div className="p-6">
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">
                Loading order details...
              </span>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout userRole="seller">
        <div className="p-6">
          <Card className="p-12 text-center">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Order Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              The order with ID #{orderId} could not be found.
            </p>
            <Link href="/seller/orders">
              <Button>Back to Orders</Button>
            </Link>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const timeline = getStatusTimeline();

  return (
    <MainLayout userRole="seller">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/seller/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.id}
              </h1>
              <p className="text-gray-600">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              className={getOrderStatusColor(order.orderStatus)}
              className="text-sm"
            >
              {getOrderStatusText(order.orderStatus)}
            </Badge>
            <Badge
              className={getPaymentStatusColor(order.paymentStatus)}
              className="text-sm"
            >
              {order.paymentStatus}
            </Badge>
            {order.orderStatus !== "DELIVERED" &&
              order.orderStatus !== "CANCELLED" && (
                <Button
                  onClick={() => setShowStatusModal(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Update Status
                </Button>
              )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Status
              </h2>
              <div className="relative">
                {timeline.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === timeline.length - 1;

                  return (
                    <div key={step.key} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            step.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : step.current
                              ? "bg-orange-500 border-orange-500 text-white"
                              : step.cancelled
                              ? "bg-gray-300 border-gray-300 text-gray-500"
                              : "bg-white border-gray-300 text-gray-400"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 h-12 ${
                              step.completed
                                ? "bg-green-500"
                                : step.cancelled
                                ? "bg-gray-300"
                                : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="ml-4 pb-8">
                        <p
                          className={`font-medium ${
                            step.completed || step.current
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </p>
                        {step.current && (
                          <p className="text-sm text-orange-600 mt-1">
                            Current status
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {order.orderStatus === "CANCELLED" && order.cancelReason && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-medium text-red-800">
                    Cancellation Reason
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {order.cancelReason}
                  </p>
                </div>
              )}
            </Card>

            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      {formatPrice(order.totalAmount - order.shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Fee</span>
                    <span>{formatPrice(order.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {order.customer.avatar && (
                    <img
                      src={order.customer.avatar}
                      alt={order.customer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.customer.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.customer.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="hover:text-orange-600 transition-colors"
                  >
                    {order.customer.phone}
                  </a>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Customer
                </Button>
              </div>
            </Card>

            {/* Delivery Information */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.receiver}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.phone}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {order.shippingAddress.address}
                  </p>
                </div>

                {order.expectedDeliveryTime && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <div>
                      <p className="text-sm">Expected Delivery</p>
                      <p className="font-medium">
                        {formatDateTime(order.expectedDeliveryTime)}
                      </p>
                    </div>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full">
                  <Navigation className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              </div>
            </Card>

            {/* Driver Information */}
            {order.driver && (
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Driver Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {order.driver.avatar && (
                      <img
                        src={order.driver.avatar}
                        alt={order.driver.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.driver.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.driver.vehicleType}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>Phone: {order.driver.phone}</p>
                    <p>Vehicle: {order.driver.vehiclePlate}</p>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Driver
                  </Button>
                </div>
              </Card>
            )}

            {/* Payment Information */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                {order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid At</span>
                    <span className="text-sm">
                      {formatDateTime(order.paidAt)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-semibold text-lg">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Additional Notes */}
            {order.note && (
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Notes
                </h3>
                <p className="text-gray-600 text-sm">{order.note}</p>
              </Card>
            )}
          </div>
        </div>

        {/* Status Update Modal */}
        <OrderStatusModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onUpdateStatus={handleUpdateStatus}
          order={order}
          isLoading={updateLoading}
        />
      </div>
    </MainLayout>
  );
}
