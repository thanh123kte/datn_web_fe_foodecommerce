export enum NotificationType {
  ORDER = "ORDER",
  PROMOTION = "PROMOTION",
  REVIEW = "REVIEW",
  SYSTEM = "SYSTEM",
  REVENUE = "REVENUE",
}

export enum NotificationPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  is_read: boolean;
  created_at: string;
  link?: string;
  metadata?: any;
}
