import axios from "axios";
import { Notification, NotificationType } from "@/types/notification";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const notificationService = {
  // Get all notifications for seller
  getNotifications: async (sellerId: number): Promise<Notification[]> => {
    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // const response = await axios.get<Notification[]>(
      //   `${API_BASE_URL}/api/notifications/seller/${sellerId}`
      // );
      // return response.data;

      // Mock data for now
      return [
        {
          id: 1,
          title: "Đơn hàng mới #12345",
          message: "Bạn có một đơn hàng mới cần xử lý",
          type: NotificationType.ORDER,
          priority: "HIGH" as any,
          is_read: false,
          created_at: new Date().toISOString(),
          link: "/seller/orders",
        },
        {
          id: 2,
          title: "Đánh giá mới",
          message: "Khách hàng vừa để lại đánh giá 5 sao cho món ăn của bạn",
          type: NotificationType.REVIEW,
          priority: "MEDIUM" as any,
          is_read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          link: "/seller/reviews",
        },
        {
          id: 3,
          title: "Doanh thu tăng trưởng",
          message: "Doanh thu tuần này tăng 15% so với tuần trước",
          type: NotificationType.REVENUE,
          priority: "LOW" as any,
          is_read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          link: "/seller/revenue",
        },
      ];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Get unread count
  getUnreadCount: async (sellerId: number): Promise<number> => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await axios.get<{ count: number }>(
      //   `${API_BASE_URL}/api/notifications/seller/${sellerId}/unread-count`
      // );
      // return response.data.count;

      // Mock data
      return 2;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: number): Promise<void> => {
    try {
      // TODO: Replace with actual API endpoint
      // await axios.put(
      //   `${API_BASE_URL}/api/notifications/${notificationId}/read`
      // );
      console.log("Marked notification as read:", notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (sellerId: number): Promise<void> => {
    try {
      // TODO: Replace with actual API endpoint
      // await axios.put(
      //   `${API_BASE_URL}/api/notifications/seller/${sellerId}/read-all`
      // );
      console.log("Marked all notifications as read for seller:", sellerId);
    } catch (error) {
      console.error("Error marking all as read:", error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId: number): Promise<void> => {
    try {
      // TODO: Replace with actual API endpoint
      // await axios.delete(
      //   `${API_BASE_URL}/api/notifications/${notificationId}`
      // );
      console.log("Deleted notification:", notificationId);
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
};
