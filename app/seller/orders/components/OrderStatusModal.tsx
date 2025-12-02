"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/ui/form-field";
import {
  X,
  Clock,
  CheckCircle,
  Package,
  Truck,
  MapPin,
  XCircle,
} from "lucide-react";
import {
  Order,
  OrderStatus,
  getOrderStatusColor,
  getOrderStatusText,
} from "@/lib/mockData/orders";

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (status: OrderStatus, note?: string) => void;
  order: Order;
  isLoading?: boolean;
}

const ORDER_STATUS_CONFIG = [
  {
    status: "CONFIRMED" as OrderStatus,
    label: "Confirm Order",
    description: "Accept the order and start preparation",
    icon: CheckCircle,
    color: "text-blue-600",
    allowedFrom: ["PENDING"],
  },
  {
    status: "PREPARING" as OrderStatus,
    label: "Start Preparing",
    description: "Begin cooking/preparing the order",
    icon: Package,
    color: "text-orange-600",
    allowedFrom: ["CONFIRMED"],
  },
  {
    status: "SHIPPING" as OrderStatus,
    label: "Ready for Delivery",
    description: "Order is ready and handed to driver",
    icon: Truck,
    color: "text-purple-600",
    allowedFrom: ["PREPARING"],
  },
  {
    status: "DELIVERED" as OrderStatus,
    label: "Mark as Delivered",
    description: "Order has been delivered successfully",
    icon: MapPin,
    color: "text-green-600",
    allowedFrom: ["SHIPPING"],
  },
  {
    status: "CANCELLED" as OrderStatus,
    label: "Cancel Order",
    description: "Cancel this order (reason required)",
    icon: XCircle,
    color: "text-red-600",
    allowedFrom: ["PENDING", "CONFIRMED", "PREPARING"],
    requiresReason: true,
  },
];

export default function OrderStatusModal({
  isOpen,
  onClose,
  onUpdateStatus,
  order,
  isLoading = false,
}: OrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null
  );
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const availableStatuses = ORDER_STATUS_CONFIG.filter((config) =>
    config.allowedFrom.includes(order.orderStatus)
  );

  const handleConfirm = () => {
    if (!selectedStatus) return;

    const config = ORDER_STATUS_CONFIG.find((c) => c.status === selectedStatus);
    if (config?.requiresReason && !note.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    onUpdateStatus(selectedStatus, note.trim() || undefined);
  };

  const resetForm = () => {
    setSelectedStatus(null);
    setNote("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Update Order Status
              </h2>
              <p className="text-gray-600 mt-1">
                Order #{order.id} - Current status:
                <Badge
                  className={`ml-2 ${getOrderStatusColor(order.orderStatus)}`}
                >
                  {getOrderStatusText(order.orderStatus)}
                </Badge>
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Order Info Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Customer:</span>
                <p className="text-gray-600">{order.customer.name}</p>
              </div>
              <div>
                <span className="font-medium">Phone:</span>
                <p className="text-gray-600">{order.customer.phone}</p>
              </div>
              <div>
                <span className="font-medium">Payment:</span>
                <p className="text-gray-600">{order.paymentMethod}</p>
              </div>
              <div>
                <span className="font-medium">Total:</span>
                <p className="text-gray-600 font-semibold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Options */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900">Select New Status:</h3>

            {availableStatuses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No status updates available for current order state</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {availableStatuses.map((config) => {
                  const Icon = config.icon;
                  const isSelected = selectedStatus === config.status;

                  return (
                    <button
                      key={config.status}
                      onClick={() => setSelectedStatus(config.status)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                      disabled={isLoading}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {config.label}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {config.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Note/Reason Field */}
          {selectedStatus && (
            <div className="mb-6">
              <FormField
                label={
                  selectedStatus === "CANCELLED"
                    ? "Cancellation Reason"
                    : "Note (Optional)"
                }
                required={selectedStatus === "CANCELLED"}
              >
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    selectedStatus === "CANCELLED"
                      ? "Please explain why this order is being cancelled..."
                      : "Add any additional notes..."
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </FormField>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedStatus || isLoading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update Status"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
