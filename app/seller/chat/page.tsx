"use client";

import MainLayout from "@/components/layout/MainLayout";
import { ChatWindow } from "@/components/chat";
import { useBackendAuth } from "@/hooks/useBackendAuth";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function SellerChatPage() {
  useAuthGuard("/seller/login");
  const { user, loading } = useBackendAuth();

  if (loading) {
    return (
      <MainLayout userRole="seller" title="Tin nhắn" noPadding>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout userRole="seller" title="Tin nhắn" noPadding>
      <ChatWindow userRole="seller" />
    </MainLayout>
  );
}
