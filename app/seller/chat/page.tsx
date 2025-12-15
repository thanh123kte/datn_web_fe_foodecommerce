"use client";

import MainLayout from "@/components/layout/MainLayout";
import { ChatWindow } from "@/components/chat";

export default function SellerChatPage() {
  // Hardcode userId cho demo với mock data
  const userId = 2; // Seller ID

  return (
    <MainLayout userRole="seller" title="Tin nhắn" noPadding>
      <ChatWindow currentUserId={userId} userRole="seller" />
    </MainLayout>
  );
}
