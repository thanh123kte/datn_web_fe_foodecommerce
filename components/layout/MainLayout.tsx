"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  userRole: "admin" | "seller";
  title?: string;
  showSearch?: boolean;
  className?: string;
}

export default function MainLayout({
  children,
  userRole,
  title = "Dashboard",
  showSearch = true,
  className = "",
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header - Always on top */}
      <Header
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={sidebarOpen}
        title={title}
        showSearch={showSearch}
        userRole={userRole}
      />

      {/* Content wrapper with sidebar */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          userRole={userRole}
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 overflow-y-auto ${className}`}
        >
          <div className="min-h-full p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
