"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserDropdownProps {
  userRole?: "admin" | "seller";
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export default function UserDropdown({
  userRole = "admin",
  userName = "John Doe",
  userEmail = "john@qtifood.com",
  userAvatar,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("seller_data");
    localStorage.removeItem("seller_token");
    localStorage.removeItem("admin_data");
    localStorage.removeItem("admin_token");
    sessionStorage.removeItem("seller_data");
    sessionStorage.removeItem("seller_token");
    sessionStorage.removeItem("admin_data");
    sessionStorage.removeItem("admin_token");

    // Redirect based on role
    if (userRole === "seller") {
      window.location.href = "/seller/login";
    } else {
      window.location.href = "/admin/login";
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "seller":
        return <Store className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case "admin":
        return "Administrator";
      default:
        return "Seller";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 h-auto"
      >
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="relative">
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt="User Avatar"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {/* Online Status */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          {/* User Info - Hidden on mobile */}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {userName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              {getRoleIcon()}
              {getRoleLabel()}
            </p>
          </div>

          {/* Dropdown Arrow */}
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left rounded-md mx-1"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
