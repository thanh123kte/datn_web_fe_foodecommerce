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
  Navigation,
  Copy,
  Printer,
  Check,
  FileText,
  CircleDollarSign,
  PhoneCall,
} from "lucide-react";
import {
  Order,
  getOrderStatusColor,
  getPaymentStatusColor,
  getOrderStatusText,
  formatPrice,
  formatDateTime,
} from "@/lib/mockData/orders";
import OrderStatusModal from "../components/OrderStatusModal";
import {
  orderService,
  OrderResponseDto,
  OrderStatus,
} from "@/lib/services/orderService";
import { buildAbsoluteUrl } from "@/lib/config/env";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const orderData = await orderService.getById(Number(orderId));
      setOrder(mapDtoToOrder(orderData));
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleUpdateStatus = async (status: OrderStatus) => {
    if (!order) return;

    setUpdateLoading(true);
    try {
      // Cập nhật status
      const updatedOrder = await orderService.updateStatus(
        Number(order.id),
        status
      );
      setOrder(mapDtoToOrder(updatedOrder));

      // Nếu status được cập nhật thành PREPARED, tự động gán driver
      if (status === "PREPARED") {
        try {
          // Gọi API gán driver
          const orderWithDriver = await orderService.assignDriver(
            Number(order.id)
          );
          // Cập nhật lại order với thông tin driver và status mới (SHIPPING)
          setOrder(mapDtoToOrder(orderWithDriver));
          alert(
            "Đã gán tài xế thành công! Đơn hàng chuyển sang trạng thái Đang giao hàng."
          );
        } catch (driverError) {
          console.error("Error assigning driver:", driverError);
          alert(
            "Đã cập nhật trạng thái nhưng không thể gán tài xế. Vui lòng thử lại sau."
          );
        }
      }

      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const mapDtoToOrder = (dto: OrderResponseDto): Order => {
    const resolveAvatar = (url?: string | null, name?: string | null) => {
      const absolute =
        url && !/^https?:\/\//i.test(url) ? buildAbsoluteUrl(url) : undefined;
      if (absolute) return absolute;
      const safeName = encodeURIComponent(name || "User");
      return `https://ui-avatars.com/api/?name=${safeName}&background=E5E7EB&color=111827`;
    };

    const items = (dto.items ?? []).map((item) => {
      const quantity = item.quantity ?? 0;
      const price = Number(item.price ?? 0);
      const total =
        item.totalPrice != null ? Number(item.totalPrice) : price * quantity;

      return {
        id: String(item.id),
        productId: item.productId ? String(item.productId) : "",
        productName: item.productName || "San pham",
        productImage: item.productImage,
        quantity,
        price,
        total,
      };
    });

    const normalizedItems = items.map((item) => ({
      ...item,
      productImage: buildAbsoluteUrl(item.productImage),
    }));

    const shippingReceiver = dto.shippingReceiver || dto.customerName || "";
    const shippingPhone = dto.shippingPhone || dto.customerPhone || "";

    return {
      id: String(dto.id),
      customerId: dto.customerId || "",
      customer: {
        id: dto.customerId || "",
        name: dto.customerName || "Khach hang",
        email: "",
        phone: dto.customerPhone || "",
        avatar: resolveAvatar(dto.customerAvatar, dto.customerName),
      },
      storeId: dto.storeId ? String(dto.storeId) : "",
      driverId: dto.driverId ? String(dto.driverId) : undefined,
      driver: dto.driverId
        ? {
            id: String(dto.driverId),
            name: dto.driverName || "Tai xe",
            phone: dto.driverPhone || "",
            avatar: undefined,
            vehicleType: "",
            vehiclePlate: "",
          }
        : undefined,
      shippingAddress: {
        id: dto.shippingAddressId ? String(dto.shippingAddressId) : "",
        receiver: shippingReceiver,
        phone: shippingPhone,
        address: dto.shippingAddress || "",
      },
      items: normalizedItems,
      totalAmount: Number(dto.totalAmount ?? 0),
      shippingFee: Number(dto.shippingFee ?? 0),
      discountAmount: Number(dto.discountAmount ?? 0),
      adminVoucherId: dto.adminVoucherId
        ? String(dto.adminVoucherId)
        : undefined,
      sellerVoucherId: dto.sellerVoucherId
        ? String(dto.sellerVoucherId)
        : undefined,
      paymentMethod: dto.paymentMethod || "COD",
      paymentStatus: dto.paymentStatus || "PENDING",
      paidAt: dto.paidAt || undefined,
      orderStatus: dto.orderStatus || "PENDING",
      note: dto.note || undefined,
      cancelReason: dto.cancelReason || undefined,
      expectedDeliveryTime: dto.expectedDeliveryTime || undefined,
      ratingStatus: dto.ratingStatus ?? false,
      createdAt: dto.createdAt || "",
      updatedAt: dto.updatedAt || "",
    };
  };

  const getStatusTimeline = () => {
    const statuses = [
      { key: "PENDING", label: "Chờ xác nhận", icon: Clock },
      { key: "CONFIRMED", label: "Đã xác nhận", icon: CheckCircle },
      { key: "PREPARING", label: "Đang chuẩn bị", icon: Package },
      { key: "PREPARED", label: "Đã chuẩn bị xong", icon: CheckCircle },
      { key: "SHIPPING", label: "Đang giao hàng", icon: Truck },
      { key: "DELIVERED", label: "Đã giao hàng", icon: MapPin },
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

  const resolveImage = (path?: string) => buildAbsoluteUrl(path);

  const timeline = getStatusTimeline();
  const itemsTotal = order.items.reduce((sum, item) => sum + item.total, 0);
  const discount = order.discountAmount ?? 0;
  const grandTotal = itemsTotal + order.shippingFee - discount;

  // Calculate seller net amount (excluding platform fees, if applicable)
  const sellerNetAmount = grandTotal;

  // Copy order ID to clipboard
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(`#${order.id}`);
  };

  // Copy customer phone to clipboard
  const handleCopyCustomerPhone = () => {
    navigator.clipboard.writeText(order.customer.phone);
  };

  // Quick actions
  const handlePrintInvoice = () => {
    window.print();
  };

  const handleCallCustomer = () => {
    window.location.href = `tel:${order.customer.phone}`;
  };

  const handleCallDriver = () => {
    if (order.driver?.phone) {
      window.location.href = `tel:${order.driver.phone}`;
    }
  };

  const totalItemsCount = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <MainLayout userRole="seller">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Back Button */}
          <div className="mb-4">
            <Link href="/seller/orders">
              <Button variant="ghost" size="sm" className="hover:bg-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Button>
            </Link>
          </div>

          {/* Header Section */}
          <Card className="mb-4 p-4 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              {/* Order ID & Time Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    #{order.id}
                  </h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyOrderId}
                    className="h-7"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">Đặt lúc:</span>
                    <span>{formatDateTime(order.createdAt)}</span>
                  </div>
                  {order.expectedDeliveryTime && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <Truck className="w-3.5 h-3.5" />
                      <span className="font-medium">Dự kiến giao:</span>
                      <span>{formatDateTime(order.expectedDeliveryTime)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badges & Actions */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <Badge
                    className={`${getPaymentStatusColor(
                      order.paymentStatus
                    )} text-sm px-3 py-1`}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Compact Status Stepper */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between relative">
                {timeline.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === timeline.length - 1;

                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center flex-1 relative z-10"
                    >
                      {!isLast && (
                        <div
                          className={`absolute top-4 left-[50%] w-full h-0.5 -z-10 ${
                            step.completed
                              ? "bg-green-500"
                              : step.cancelled
                              ? "bg-gray-300"
                              : "bg-gray-200"
                          }`}
                        />
                      )}

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          step.completed
                            ? "bg-green-500 text-white"
                            : step.current
                            ? "bg-orange-500 text-white ring-4 ring-orange-100"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <span
                        className={`mt-2 text-xs text-center ${
                          step.completed || step.current
                            ? "text-gray-900 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cancelled Reason */}
            {order.orderStatus === "CANCELLED" && order.cancelReason && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-red-800">
                      Lý do hủy đơn
                    </p>
                    <p className="text-sm text-red-700 mt-0.5">
                      {order.cancelReason}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Content - Order Items */}
            <div className="lg:col-span-2">
              <Card className="p-6 shadow-sm bg-white">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-500" />
                    Chi tiết đơn hàng
                  </h2>
                  <span className="text-sm font-medium text-gray-600">
                    Tổng {totalItemsCount} món
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-2 mb-5">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {item.productImage && (
                        <img
                          src={resolveImage(item.productImage)}
                          alt={item.productName}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm mb-1">
                          {item.productName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-semibold text-orange-600">
                            x{item.quantity}
                          </span>
                          <span>×</span>
                          <span>{formatPrice(item.price)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Note */}
                {order.note && (
                  <div className="mb-5 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-yellow-800 mb-1">
                          Ghi chú đơn hàng
                        </p>
                        <p className="text-sm text-yellow-900">{order.note}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Summary */}
                <div className="border-t pt-4">
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tổng giá món</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(itemsTotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí giao hàng</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(order.shippingFee)}
                      </span>
                    </div>

                    {order.adminVoucherId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Voucher Admin</span>
                        <span className="font-medium text-green-600">
                          -
                          {formatPrice(
                            Math.floor((discount * 50) / 100) || discount / 2
                          )}
                        </span>
                      </div>
                    )}

                    {order.sellerVoucherId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Voucher Seller</span>
                        <span className="font-medium text-green-600">
                          -
                          {formatPrice(
                            Math.ceil((discount * 50) / 100) || discount / 2
                          )}
                        </span>
                      </div>
                    )}

                    {!order.adminVoucherId &&
                      !order.sellerVoucherId &&
                      discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Giảm giá</span>
                          <span className="font-medium text-green-600">
                            -{formatPrice(discount)}
                          </span>
                        </div>
                      )}

                    <div className="flex justify-between pt-3 border-t-2">
                      <span className="font-bold text-gray-900">
                        Tổng thanh toán
                      </span>
                      <span className="font-bold text-xl text-orange-600">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 pb-2 px-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CircleDollarSign className="w-5 h-5 text-green-700" />
                        <span className="font-semibold text-sm text-green-900">
                          Seller thực nhận
                        </span>
                      </div>
                      <span className="font-bold text-lg text-green-700">
                        {formatPrice(sellerNetAmount)}
                      </span>
                    </div>

                    {order.paymentStatus === "PENDING" && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-center">
                        <p className="text-sm font-medium text-amber-800">
                          ⚠️ Chưa thanh toán - Thu tiền khi giao hàng (COD)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Thao tác nhanh
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {order.orderStatus === "PENDING" && (
                      <Button
                        onClick={() => handleUpdateStatus("CONFIRMED")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={updateLoading}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Xác nhận đơn
                      </Button>
                    )}

                    {order.orderStatus === "CONFIRMED" && (
                      <Button
                        onClick={() => handleUpdateStatus("PREPARING")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={updateLoading}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Đang chuẩn bị
                      </Button>
                    )}

                    {order.orderStatus === "PREPARING" && (
                      <Button
                        onClick={() => handleUpdateStatus("PREPARED")}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={updateLoading}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Đã chuẩn bị xong
                      </Button>
                    )}

                    {order.orderStatus === "SHIPPING" && (
                      <Button
                        onClick={() => handleUpdateStatus("DELIVERED")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={updateLoading}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Hoàn tất đơn
                      </Button>
                    )}

                    <Button
                      onClick={handlePrintInvoice}
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      In hoá đơn
                    </Button>

                    <Button
                      onClick={handleCallCustomer}
                      variant="outline"
                      className="border-blue-300 hover:bg-blue-50 text-blue-700"
                    >
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Gọi khách
                    </Button>

                    {order.driver && (
                      <Button
                        onClick={handleCallDriver}
                        variant="outline"
                        className="border-purple-300 hover:bg-purple-50 text-purple-700"
                      >
                        <PhoneCall className="w-4 h-4 mr-2" />
                        Gọi tài xế
                      </Button>
                    )}

                    {order.orderStatus !== "DELIVERED" &&
                      order.orderStatus !== "CANCELLED" && (
                        <Button
                          onClick={() => setShowStatusModal(true)}
                          variant="outline"
                          className="border-orange-300 hover:bg-orange-50 text-orange-700 col-span-2"
                        >
                          Cập nhật trạng thái khác
                        </Button>
                      )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - Compact Info */}
            <div className="space-y-4">
              {/* 3-in-1 Contact & Delivery Card */}
              <Card className="p-5 shadow-sm bg-white">
                {/* Customer Info */}
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    KHÁCH HÀNG
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-base">
                        {order.customer.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                        <a
                          href={`tel:${order.customer.phone}`}
                          className="text-sm text-gray-700 hover:text-orange-600 font-medium"
                        >
                          {order.customer.phone}
                        </a>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCopyCustomerPhone}
                          className="h-6 px-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCallCustomer}
                      className="w-full h-8 text-xs border-blue-300 hover:bg-blue-50 text-blue-700"
                    >
                      <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
                      Gọi khách hàng
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-5 mb-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    ĐỊA CHỈ GIAO HÀNG
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {order.shippingAddress.receiver}
                      </p>
                      <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-2.5 rounded">
                      {order.shippingAddress.address}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-8 text-xs border-red-300 hover:bg-red-50 text-red-700"
                    >
                      <Navigation className="w-3.5 h-3.5 mr-1.5" />
                      Xem bản đồ
                    </Button>
                  </div>
                </div>

                {/* Driver Info */}
                {order.driver && (
                  <div className="border-t pt-5">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-purple-500" />
                      TÀI XẾ
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-base">
                          {order.driver.name}
                        </p>
                        <div className="text-sm text-gray-700 mt-1 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <span>{order.driver.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Truck className="w-3 h-3 text-gray-500" />
                            <span>
                              {order.driver.vehicleType} -{" "}
                              {order.driver.vehiclePlate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCallDriver}
                        className="w-full h-8 text-xs border-purple-300 hover:bg-purple-50 text-purple-700"
                      >
                        <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
                        Gọi tài xế
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Payment Info */}
              <Card className="p-5 shadow-sm bg-white">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-500" />
                  THANH TOÁN
                </h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Phương thức</span>
                    <span className="font-semibold text-gray-900">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Trạng thái</span>
                    <Badge
                      className={`${getPaymentStatusColor(
                        order.paymentStatus
                      )} text-xs px-2 py-0.5`}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  {order.paidAt && (
                    <div className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                      Đã thanh toán: {formatDateTime(order.paidAt)}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2.5 border-t">
                    <span className="font-bold text-gray-900">Tổng tiền</span>
                    <span className="font-bold text-lg text-orange-600">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
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
