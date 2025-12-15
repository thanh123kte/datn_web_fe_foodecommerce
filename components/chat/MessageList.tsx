"use client";

import { Message } from "@/types/chat";
import { useEffect, useRef } from "react";

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
        </div>
      ) : (
        <>
          {messages.map((message) => {
            const isOwnMessage = message.sender_id === currentUserId;

            return (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                {!isOwnMessage && (
                  <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                    {message.sender_name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div
                  className={`flex flex-col max-w-[70%] ${
                    isOwnMessage ? "items-end" : "items-start"
                  }`}
                >
                  {!isOwnMessage && (
                    <span className="text-xs text-gray-600 mb-1">
                      {message.sender_name}
                    </span>
                  )}

                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatTime(message.created_at)}
                    </span>
                    {isOwnMessage && message.is_read && (
                      <span className="text-xs text-blue-500">✓✓</span>
                    )}
                  </div>
                </div>

                {isOwnMessage && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                    {message.sender_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
