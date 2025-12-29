"use client";

import { useState, useEffect, useRef } from "react";
import { Conversation, Message, MessageType } from "@/types/chat";
import { chatService } from "@/lib/services/chatService";
import { webSocketChatService } from "@/lib/services/webSocketChatService";
import { ConversationList } from "./ConversationList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

interface ChatWindowProps {
  userRole: "seller" | "customer";
}

export function ChatWindow({ userRole }: ChatWindowProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const wsInitialized = useRef(false);

  // Get userId from localStorage
  useEffect(() => {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setCurrentUserId(user.id);
    } else {
      console.warn("[Chat] No user_info in localStorage");
    }
  }, []);

  // Initialize WebSocket connection on mount
  useEffect(() => {
    if (!currentUserId || wsInitialized.current) return;
    wsInitialized.current = true;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";

    webSocketChatService.connect({
      url: WS_URL,
      userId: currentUserId,
      onConnect: () => {
        setWsConnected(true);
        toast.success("Đã kết nối chat realtime");
      },
      onDisconnect: () => {
        setWsConnected(false);
        toast.error("Mất kết nối chat realtime");
      },
      onError: (error) => {
        console.error("[Chat] WebSocket error:", error);
      },
    });

    return () => {
      webSocketChatService.disconnect();
    };
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      loadConversations();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      subscribeToConversation(selectedConversation.id);
      // Mark conversation as read when user opens it
      markConversationAsRead(selectedConversation.id);
    }

    return () => {
      webSocketChatService.unsubscribe();
    };
  }, [selectedConversation, wsConnected]);

  const loadConversations = async () => {
    if (!currentUserId) {
      console.warn("[Chat] No currentUserId, skipping load conversations");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("[Chat] Loading conversations for sellerId:", currentUserId);
      const data = await chatService.getConversations(currentUserId, userRole);
      console.log("[Chat] Loaded conversations:", data);

      if (data && data.length > 0) {
        setConversations(data);
        console.log("[Chat] Set", data.length, "conversations");
      } else {
        setConversations([]);
        console.log("[Chat] No conversations found");
      }
    } catch (error: any) {
      console.error("Error loading conversations:", error);
      setConversations([]);

      if (error.response?.status === 404) {
        console.log("[Chat] User not found or no conversations");
      } else {
        toast.error("Không thể tải danh sách trò chuyện");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      const data = await chatService.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Không thể tải tin nhắn");
    }
  };

  const markConversationAsRead = async (conversationId: number) => {
    if (!currentUserId) return;

    try {
      await chatService.markConversationAsRead(conversationId, currentUserId);
      // Update local state to reset unread count
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
        )
      );
    } catch (error) {
      console.error("Error marking conversation as read:", error);
      // Don't show toast for this - it's a background operation
    }
  };

  const subscribeToConversation = (conversationId: number) => {
    if (!wsConnected) {
      console.warn("[Chat] WebSocket not connected, skipping subscription");
      return;
    }

    webSocketChatService.subscribe(conversationId, (newMessage: any) => {
      // Convert backend format to frontend format
      const message: Message = {
        id: newMessage.id,
        conversation_id: newMessage.conversationId,
        sender_id: newMessage.senderId,
        sender_name: newMessage.senderName,
        content: newMessage.content,
        message_type: MessageType.TEXT,
        is_read: newMessage.isRead || false,
        read_at: null,
        created_at: newMessage.createdAt,
      };

      // Add message to list if not already present (dedupe)
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });

      // Update last message in conversations list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                last_message: message.content,
                last_message_time: message.created_at,
              }
            : conv
        )
      );
    });
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

      // Try WebSocket first, fallback to REST
      if (wsConnected) {
        try {
          await webSocketChatService.sendMessage(
            selectedConversation.id,
            content
          );
          // Message will be added via WebSocket subscription
        } catch (wsError) {
          console.error(
            "[Chat] WebSocket send failed, falling back to REST:",
            wsError
          );
          // Fallback to REST API (commented for now)
          throw wsError;
        }
      } else {
        // WebSocket not connected, use REST API fallback
        if (!currentUserId) {
          toast.error("Không tìm thấy thông tin người dùng");
          return;
        }

        console.warn("[Chat] WebSocket not connected, using REST API fallback");
        const newMessage = await chatService.sendMessage(
          selectedConversation.id,
          currentUserId,
          content
        );

        // Add message to list
        setMessages((prev) => [...prev, newMessage]);

        // Update last message in conversation
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  last_message: content,
                  last_message_time: newMessage.created_at,
                }
              : conv
          )
        );
      }

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
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải tin nhắn...</p>
        </div>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Đang tải thông tin người dùng...</p>
        </div>
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
                {selectedConversation.customer_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold">
                  {selectedConversation.customer_name}
                </h3>
                <p className="text-xs text-gray-500">Khách hàng</p>
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
