import axios from "axios";
import { Conversation, Message, MessageType } from "@/types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Create axios instance with ngrok headers
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

interface UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  roles?: string[];
}

interface ConversationResponseDto {
  id: number;
  customer: UserResponseDto;
  seller: UserResponseDto;
  lastMessage: {
    id: number;
    content: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  createdAt: string;
  lastMessageAt: string;
}

interface MessageResponseDto {
  id: number;
  conversationId: number;
  sender: UserResponseDto;
  content: string;
  messageType: MessageType;
  createdAt: string;
}

const convertToConversation = (dto: ConversationResponseDto): Conversation => {
  return {
    id: dto.id,
    customer_id: dto.customer.id,
    customer_name: dto.customer.fullName,
    customer_avatar: dto.customer.avatarUrl,
    seller_id: dto.seller.id,
    seller_name: dto.seller.fullName,
    seller_avatar: dto.seller.avatarUrl,
    last_message: dto.lastMessage?.content,
    last_message_time: dto.lastMessageAt,
    unread_count: dto.unreadCount,
    created_at: dto.createdAt,
  };
};

const convertToMessage = (dto: MessageResponseDto): Message => {
  return {
    id: dto.id,
    conversation_id: dto.conversationId,
    sender_id: dto.sender.id,
    sender_name: dto.sender.fullName,
    content: dto.content,
    message_type: dto.messageType,
    is_read: false, // Default to false since backend doesn't provide this yet
    read_at: undefined,
    created_at: dto.createdAt,
  };
};

export const chatService = {
  // Create or get existing conversation
  createOrGetConversation: async (
    customerId: string,
    sellerId: string
  ): Promise<Conversation> => {
    try {
      const response = await axiosInstance.post<ConversationResponseDto>(
        `/api/chat/conversations`,
        { customerId, sellerId }
      );
      return convertToConversation(response.data);
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  },

  // Get conversations by seller
  getConversationsBySeller: async (
    sellerId: string
  ): Promise<Conversation[]> => {
    try {
      const url = `/api/conversations/seller/${sellerId}`;
      console.log("[ChatService] Fetching seller conversations from:", url);
      const response = await axiosInstance.get<ConversationResponseDto[]>(url);
      console.log("[ChatService] API response:", response.data);

      // Check if response.data is an array
      if (!Array.isArray(response.data)) {
        console.error(
          "[ChatService] Response data is not an array:",
          response.data
        );
        return [];
      }

      const conversations = response.data.map(convertToConversation);
      console.log("[ChatService] Converted conversations:", conversations);
      return conversations;
    } catch (error) {
      console.error("Error fetching seller conversations:", error);
      return [];
    }
  },

  // Get conversations (alias for seller)
  getConversations: async (
    userId: string,
    userRole?: "seller" | "customer"
  ): Promise<Conversation[]> => {
    return chatService.getConversationsBySeller(userId);
  },

  // Get conversation by ID
  getConversation: async (conversationId: number): Promise<Conversation> => {
    try {
      const response = await axiosInstance.get<ConversationResponseDto>(
        `/api/chat/conversations/${conversationId}`
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
      const response = await axiosInstance.get<MessageResponseDto[]>(
        `/api/chat/conversations/${conversationId}/messages`
      );

      // Check if response.data is an array
      if (!Array.isArray(response.data)) {
        console.error(
          "[ChatService] Messages response data is not an array:",
          response.data
        );
        return [];
      }

      return response.data.map(convertToMessage);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  },

  // Send a message
  sendMessage: async (
    conversationId: number,
    senderId: string,
    content: string,
    messageType: MessageType = MessageType.TEXT
  ): Promise<Message> => {
    try {
      const response = await axiosInstance.post<MessageResponseDto>(
        `/api/chat/messages?senderId=${senderId}`,
        {
          conversationId,
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
  markAsRead: async (conversationId: number, userId: string): Promise<void> => {
    try {
      await axiosInstance.put(
        `/api/chat/conversations/${conversationId}/read`,
        null,
        { params: { userId } }
      );
    } catch (error) {
      console.error("Error marking as read:", error);
      throw error;
    }
  },

  // Mark conversation as read (new endpoint)
  markConversationAsRead: async (
    conversationId: number,
    userId: string
  ): Promise<void> => {
    try {
      await axiosInstance.post(
        `/api/conversations/${conversationId}/mark-read?userId=${userId}`
      );
    } catch (error) {
      console.error("Error marking conversation as read:", error);
      throw error;
    }
  },
};
