// hooks/useBackendAuth.ts
"use client";

import { useState, useEffect } from "react";
import { authApiService } from "@/lib/services/authApiService";

export interface SellerUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
}

export const useBackendAuth = () => {
  const [user, setUser] = useState<SellerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        // Lấy user từ localStorage (từ API auth response)
        const authUser = authApiService.getCurrentUser();
        const token = authApiService.getAuthToken();

        if (authUser && token) {
          setUser(authUser);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const updateUser = (newUser: SellerUser | null) => {
    setUser(newUser);
  };

  const logout = () => {
    authApiService.clearUserSession();
    setUser(null);
  };

  return {
    user,
    loading,
    updateUser,
    logout,
    isAuthenticated: !!user,
  };
};
