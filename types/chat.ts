export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  SYSTEM = "SYSTEM",
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: string;
  sender_name: string;
  content: string;
  message_type: MessageType;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  customer_id: string;
  customer_name: string;
  customer_avatar?: string;
  seller_id: string;
  seller_name: string;
  seller_avatar?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  created_at: string;
}
