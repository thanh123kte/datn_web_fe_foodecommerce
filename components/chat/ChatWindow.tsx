"use client";

import { useState, useEffect } from "react";
import { Conversation, Message, MessageType } from "@/types/chat";
import { chatService } from "@/lib/services/chatService";
import { ConversationList } from "./ConversationList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

interface ChatWindowProps {
  currentUserId: number;
  userRole: "seller" | "customer";
}

// Mock data cho giao diện
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    customer_id: 1,
    customer_name: "Nguyễn Văn A",
    customer_avatar: null,
    seller_id: 2,
    seller_name: "Cửa hàng Phở Hà Nội",
    seller_avatar: null,
    last_message: "Cảm ơn shop, em đã nhận được món rồi ạ!",
    last_message_time: new Date(Date.now() - 300000).toISOString(), // 5 phút trước
    unread_count: 0,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    customer_id: 3,
    customer_name: "Trần Thị B",
    customer_avatar: null,
    seller_id: 2,
    seller_name: "Cửa hàng Phở Hà Nội",
    seller_avatar: null,
    last_message: "Shop ơi, đơn hàng của em đến khi nào vậy ạ?",
    last_message_time: new Date(Date.now() - 600000).toISOString(), // 10 phút trước
    unread_count: 2,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 3,
    customer_id: 4,
    customer_name: "Lê Văn C",
    customer_avatar: null,
    seller_id: 2,
    seller_name: "Cửa hàng Phở Hà Nội",
    seller_avatar: null,
    last_message: "Cho em hỏi shop có phở gà không ạ?",
    last_message_time: new Date(Date.now() - 3600000).toISOString(), // 1 giờ trước
    unread_count: 1,
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 1,
    customer_id: 1,
    customer_name: "Nguyễn Văn A",
    customer_avatar: null,
    seller_id: 2,
    seller_name: "Cửa hàng Phở Hà Nội",
    seller_avatar: null,
    last_message: "Cảm ơn shop, em đã nhận được món rồi ạ!",
    last_message_time: new Date(Date.now() - 300000).toISOString(), // 5 phút trước
    unread_count: 0,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 1,
    customer_id: 1,
    customer_name: "Nguyễn Văn A",
    customer_avatar: null,
    seller_id: 2,
    seller_name: "Cửa hàng Phở Hà Nội",
    seller_avatar: null,
    last_message: "Cảm ơn shop, em đã nhận được món rồi ạ!",
    last_message_time: new Date(Date.now() - 300000).toISOString(), // 5 phút trước
    unread_count: 0,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 11,
    customer_id: 1,
    customer_name: "Nguyễn Văn A",
    customer_avatar: null,
    seller_id: 2,
    seller_name: "Cửa hàng Phở Hà Nội",
    seller_avatar: null,
    last_message: "Cảm ơn shop, em đã nhận được món rồi ạ!",
    last_message_time: new Date(Date.now() - 300000).toISOString(), // 5 phút trước
    unread_count: 0,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 17,
    customer_id: 1,
    customer_name: "Nguyễn Văn A",
    customer_avatar: null,
    seller_id: 2,
    seller_name: "Cửa hàng Phở Hà Nội",
    seller_avatar: null,
    last_message: "Cảm ơn shop, em đã nhận được món rồi ạ!",
    last_message_time: new Date(Date.now() - 300000).toISOString(), // 5 phút trước
    unread_count: 0,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 18,
    customer_id: 1,
    customer_name: "Nguyễn Văn A",
    customer_avatar: null,
    seller_id: 2,
    seller_name: "Cửa hàng Phở Hà Nội",
    seller_avatar: null,
    last_message: "Cảm ơn shop, em đã nhận được món rồi ạ!",
    last_message_time: new Date(Date.now() - 300000).toISOString(), // 5 phút trước
    unread_count: 0,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 19,
    customer_id: 1,
    customer_name: "Nguyễn Văn A",
    customer_avatar: null,
    seller_id: 2,
    seller_name: "Cửa hàng Phở Hà Nội",
    seller_avatar: null,
    last_message: "Cảm ơn shop, em đã nhận được món rồi ạ!",
    last_message_time: new Date(Date.now() - 300000).toISOString(), // 5 phút trước
    unread_count: 0,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 10,
    customer_id: 1,
    customer_name: "Nguyễn Văn A",
    customer_avatar: null,
    seller_id: 2,
    seller_name: "Cửa hàng Phở Hà Nội",
    seller_avatar: null,
    last_message: "Cảm ơn shop, em đã nhận được món rồi ạ!",
    last_message_time: new Date(Date.now() - 300000).toISOString(), // 5 phút trước
    unread_count: 0,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const MOCK_MESSAGES: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      conversation_id: 1,
      sender_id: 1,
      sender_name: "Nguyễn Văn A",
      content: "Xin chào shop, em muốn hỏi về đơn hàng của em ạ",
      message_type: MessageType.TEXT,
      is_read: true,
      read_at: new Date(Date.now() - 290000).toISOString(),
      created_at: new Date(Date.now() - 310000).toISOString(),
    },
    {
      id: 2,
      conversation_id: 1,
      sender_id: 2,
      sender_name: "Cửa hàng Phở Hà Nội",
      content: "Chào anh, đơn hàng của anh đang được giao ạ",
      message_type: MessageType.TEXT,
      is_read: true,
      read_at: new Date(Date.now() - 305000).toISOString(),
      created_at: new Date(Date.now() - 305000).toISOString(),
    },
    {
      id: 3,
      conversation_id: 1,
      sender_id: 1,
      sender_name: "Nguyễn Văn A",
      content: "Cảm ơn shop, em đã nhận được món rồi ạ!",
      message_type: MessageType.TEXT,
      is_read: true,
      read_at: new Date(Date.now() - 300000).toISOString(),
      created_at: new Date(Date.now() - 300000).toISOString(),
    },
  ],
  2: [
    {
      id: 4,
      conversation_id: 2,
      sender_id: 3,
      sender_name: "Trần Thị B",
      content: "Shop ơi, đơn hàng của em đến khi nào vậy ạ?",
      message_type: MessageType.TEXT,
      is_read: false,
      read_at: null,
      created_at: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: 5,
      conversation_id: 2,
      sender_id: 3,
      sender_name: "Trần Thị B",
      content: "Em đang rất đói rồi 😢",
      message_type: MessageType.TEXT,
      is_read: false,
      read_at: null,
      created_at: new Date(Date.now() - 580000).toISOString(),
    },
  ],
  3: [
    {
      id: 6,
      conversation_id: 3,
      sender_id: 4,
      sender_name: "Lê Văn C",
      content: "Cho em hỏi shop có phở gà không ạ?",
      message_type: MessageType.TEXT,
      is_read: false,
      read_at: null,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};

export function ChatWindow({ currentUserId, userRole }: ChatWindowProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [currentUserId]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      // Sử dụng mock data
      await new Promise((resolve) => setTimeout(resolve, 500)); // Giả lập delay
      setConversations(MOCK_CONVERSATIONS);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast.error("Không thể tải danh sách trò chuyện");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      // Sử dụng mock data
      await new Promise((resolve) => setTimeout(resolve, 300)); // Giả lập delay
      const data = MOCK_MESSAGES[conversationId] || [];
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Không thể tải tin nhắn");
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);

    // Mark unread messages as read (mock)
    if (conversation.unread_count > 0) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversation.id ? { ...conv, unread_count: 0 } : conv
        )
      );
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    try {
      setSending(true);

      // Giả lập gửi tin nhắn
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newMessage: Message = {
        id: Date.now(),
        conversation_id: selectedConversation.id,
        sender_id: currentUserId,
        sender_name:
          userRole === "seller" ? "Cửa hàng Phở Hà Nội" : "Khách hàng",
        content,
        message_type: MessageType.TEXT,
        is_read: false,
        read_at: null,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);

      // Cập nhật last message trong conversation
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                last_message: content,
                last_message_time: new Date().toISOString(),
              }
            : conv
        )
      );

      toast.success("Đã gửi tin nhắn");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Không thể gửi tin nhắn");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
        <ConversationList
          conversations={conversations}
          currentUserId={currentUserId}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {(currentUserId === selectedConversation.customer_id
                  ? selectedConversation.seller_name
                  : selectedConversation.customer_name
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold">
                  {currentUserId === selectedConversation.customer_id
                    ? selectedConversation.seller_name
                    : selectedConversation.customer_name}
                </h3>
                <p className="text-xs text-gray-500">
                  {currentUserId === selectedConversation.customer_id
                    ? "Người bán"
                    : "Khách hàng"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <MessageList messages={messages} currentUserId={currentUserId} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t border-gray-200">
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={sending}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
}
