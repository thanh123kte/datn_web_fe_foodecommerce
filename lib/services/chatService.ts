import axios from "axios";
import { Conversation, Message, MessageType } from "@/types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface ConversationResponseDto {
  id: number;
  customerId: number;
  customerName: string;
  customerAvatar: string | null;
  sellerId: number;
  sellerName: string;
  sellerAvatar: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
  createdAt: string;
}

interface MessageResponseDto {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  messageType: MessageType;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

const convertToConversation = (dto: ConversationResponseDto): Conversation => {
  return {
    id: dto.id,
    customer_id: dto.customerId,
    customer_name: dto.customerName,
    customer_avatar: dto.customerAvatar || undefined,
    seller_id: dto.sellerId,
    seller_name: dto.sellerName,
    seller_avatar: dto.sellerAvatar || undefined,
    last_message: dto.lastMessage || undefined,
    last_message_time: dto.lastMessageTime || undefined,
    unread_count: dto.unreadCount,
    created_at: dto.createdAt,
  };
};

const convertToMessage = (dto: MessageResponseDto): Message => {
  return {
    id: dto.id,
    conversation_id: dto.conversationId,
    sender_id: dto.senderId,
    sender_name: dto.senderName,
    content: dto.content,
    message_type: dto.messageType,
    is_read: dto.isRead,
    read_at: dto.readAt || undefined,
    created_at: dto.createdAt,
  };
};

export const chatService = {
  // Create or get existing conversation
  createOrGetConversation: async (
    customerId: number,
    sellerId: number
  ): Promise<Conversation> => {
    try {
      const response = await axios.post<ConversationResponseDto>(
        `${API_BASE_URL}/api/chat/conversations`,
        { customerId, sellerId }
      );
      return convertToConversation(response.data);
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  },

  // Get all conversations for a user
  getUserConversations: async (userId: number): Promise<Conversation[]> => {
    try {
      const response = await axios.get<ConversationResponseDto[]>(
        `${API_BASE_URL}/api/chat/conversations/user/${userId}`
      );
      return response.data.map(convertToConversation);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  },

  // Get conversation by ID
  getConversation: async (conversationId: number): Promise<Conversation> => {
    try {
      const response = await axios.get<ConversationResponseDto>(
        `${API_BASE_URL}/api/chat/conversations/${conversationId}`
      );
      return convertToConversation(response.data);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      throw error;
    }
  },

  // Get messages in a conversation
  getMessages: async (conversationId: number): Promise<Message[]> => {
    try {
      const response = await axios.get<MessageResponseDto[]>(
        `${API_BASE_URL}/api/chat/conversations/${conversationId}/messages`
      );
      return response.data.map(convertToMessage);
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // Send a message
  sendMessage: async (
    conversationId: number,
    senderId: number,
    content: string,
    messageType: MessageType = MessageType.TEXT
  ): Promise<Message> => {
    try {
      const response = await axios.post<MessageResponseDto>(
        `${API_BASE_URL}/api/chat/messages`,
        {
          conversationId,
          senderId,
          content,
          messageType,
        }
      );
      return convertToMessage(response.data);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Mark messages as read
  markAsRead: async (conversationId: number, userId: number): Promise<void> => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/chat/conversations/${conversationId}/read`,
        null,
        { params: { userId } }
      );
    } catch (error) {
      console.error("Error marking as read:", error);
      throw error;
    }
  },
};
