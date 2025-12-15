"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { Notification, NotificationType } from "@/types/notification";
import { notificationService } from "@/lib/services/notificationService";
import { toast } from "sonner";
import {
  Bell,
  Check,
  Trash2,
  ShoppingBag,
  Star,
  TrendingUp,
  AlertCircle,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SellerNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const storeId = localStorage.getItem("store_id");
      if (!storeId) {
        toast.error("Không tìm thấy thông tin cửa hàng");
        return;
      }

      setLoading(true);
      const data = await notificationService.getNotifications(
        parseInt(storeId)
      );
      setNotifications(data);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      toast.success("Đã đánh dấu là đã đọc");
    } catch (error) {
      toast.error("Không thể cập nhật thông báo");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const storeId = localStorage.getItem("store_id");
      if (!storeId) return;

      await notificationService.markAllAsRead(parseInt(storeId));
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success("Đã đánh dấu tất cả là đã đọc");
    } catch (error) {
      toast.error("Không thể cập nhật thông báo");
    }
  };

  const handleDelete = async (notificationId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
      return;
    }

    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast.success("Đã xóa thông báo");
    } catch (error) {
      toast.error("Không thể xóa thông báo");
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER:
        return <ShoppingBag className="w-5 h-5" />;
      case NotificationType.REVIEW:
        return <Star className="w-5 h-5" />;
      case NotificationType.REVENUE:
        return <TrendingUp className="w-5 h-5" />;
      case NotificationType.PROMOTION:
        return <Gift className="w-5 h-5" />;
      case NotificationType.SYSTEM:
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER:
        return "bg-blue-100 text-blue-600";
      case NotificationType.REVIEW:
        return "bg-yellow-100 text-yellow-600";
      case NotificationType.REVENUE:
        return "bg-green-100 text-green-600";
      case NotificationType.PROMOTION:
        return "bg-purple-100 text-purple-600";
      case NotificationType.SYSTEM:
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread" && n.is_read) return false;
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <MainLayout userRole="seller" title="Thông Báo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thông Báo</h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả thông báo của cửa hàng
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount} chưa đọc
                </span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <Check className="w-4 h-4 mr-2" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "unread"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                typeFilter === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả loại
            </button>
            <button
              onClick={() => setTypeFilter(NotificationType.ORDER)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                typeFilter === NotificationType.ORDER
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Đơn hàng
            </button>
            <button
              onClick={() => setTypeFilter(NotificationType.REVIEW)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                typeFilter === NotificationType.REVIEW
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              }`}
            >
              Đánh giá
            </button>
            <button
              onClick={() => setTypeFilter(NotificationType.REVENUE)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                typeFilter === NotificationType.REVENUE
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              Doanh thu
            </button>
            <button
              onClick={() => setTypeFilter(NotificationType.PROMOTION)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                typeFilter === NotificationType.PROMOTION
                  ? "bg-purple-500 text-white"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              Khuyến mãi
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Đang tải thông báo...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Không có thông báo nào</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow p-4 transition-all hover:shadow-md cursor-pointer ${
                  !notification.is_read ? "border-l-4 border-blue-500" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full ${getTypeColor(
                      notification.type
                    )}`}
                  >
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`font-semibold ${
                          !notification.is_read
                            ? "text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {notification.message}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(notification.created_at).toLocaleString(
                        "vi-VN"
                      )}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!notification.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Đánh dấu đã đọc"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
