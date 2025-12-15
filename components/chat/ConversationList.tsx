"use client";

import { Conversation } from "@/types/chat";

const formatTimeAgo = (dateString: string): string => {
  const now = new Date().getTime();
  const past = new Date(dateString).getTime();
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "vừa xong";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  return `${Math.floor(diffInSeconds / 604800)} tuần trước`;
};

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: number;
  selectedConversationId?: number;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  currentUserId,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const getOtherUser = (conversation: Conversation) => {
    if (currentUserId === conversation.customer_id) {
      return {
        id: conversation.seller_id,
        name: conversation.seller_name,
        avatar: conversation.seller_avatar,
      };
    }
    return {
      id: conversation.customer_id,
      name: conversation.customer_name,
      avatar: conversation.customer_avatar,
    };
  };

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Tin nhắn</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Chưa có cuộc trò chuyện nào
          </div>
        ) : (
          conversations.map((conversation) => {
            const otherUser = getOtherUser(conversation);
            const isSelected = selectedConversationId === conversation.id;

            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-blue-50 border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {otherUser.avatar ? (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {otherUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {conversation.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold truncate ${
                        conversation.unread_count > 0 ? "text-blue-600" : ""
                      }`}
                    >
                      {otherUser.name}
                    </h3>
                    {conversation.last_message_time && (
                      <span className="text-xs text-gray-500 ml-2">
                        {formatTimeAgo(conversation.last_message_time)}
                      </span>
                    )}
                  </div>
                  {conversation.last_message && (
                    <p
                      className={`text-sm truncate ${
                        conversation.unread_count > 0
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {conversation.last_message}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
