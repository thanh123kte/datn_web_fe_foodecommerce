import axiosInstance from "@/lib/api/axiosConfig";
import { Notification, NotificationType } from "@/types/notification";

export interface NotificationResponseDto {
  id: number;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export const notificationService = {
  // Get all notifications for user (seller)
  getNotifications: async (
    userId: string,
    limit: number = 20
  ): Promise<Notification[]> => {
    try {
      const response = await axiosInstance.get<{
        content: NotificationResponseDto[];
      }>(`/api/notifications/user/${userId}`, {
        params: { size: limit, sort: "createdAt,desc" },
      });

      // Map backend response to frontend Notification type
      return response.data.content.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type as NotificationType,
        priority: "MEDIUM" as any,
        is_read: n.isRead,
        created_at: n.createdAt,
        link: n.metadata?.link || "/seller/dashboard",
      }));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },

  // Get unread count
  getUnreadCount: async (userId: string): Promise<number> => {
    try {
      const response = await axiosInstance.get<{ unreadCount: number }>(
        `/api/notifications/user/${userId}/unread-count`
      );
      return response.data.unreadCount;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
  },

  // Mark notification as read
  markAsRead: async (userId: string, notificationId: number): Promise<void> => {
    try {
      await axiosInstance.put(
        `/api/notifications/user/${userId}/${notificationId}/read`
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: string): Promise<void> => {
    try {
      await axiosInstance.put(`/api/notifications/user/${userId}/read-all`);
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
