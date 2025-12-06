"use client";

import { useState } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserDropdown from "./UserDropdown";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  title?: string;
  showSearch?: boolean;
  userRole?: "admin" | "seller";
}

export default function Header({
  onToggleSidebar,
  isSidebarOpen = false,
  title = "Dashboard",
  showSearch = true,
  userRole = "seller",
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const userName = user?.displayName || user?.email || "User";
  const userEmail = user?.email || "";
  const userAvatar = user?.photoURL || undefined;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section - Logo & Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </Button>

          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-md">
              <span className="text-white font-bold text-sm">QTI</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                {title}
              </h1>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        {showSearch && (
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm, đơn hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-9 w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
          </div>
        )}

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          {showSearch && (
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          )}

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                3
              </span>
            </Button>
          </div>

          {/* User Dropdown */}
          <UserDropdown
            userRole={userRole}
            userName={userName}
            userEmail={userEmail}
            userAvatar={userAvatar}
          />
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-9 w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg bg-white"
            />
          </div>
        </div>
      )}
    </header>
  );
}
