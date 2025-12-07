// contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { authService, SignInData, SignUpData } from "@/lib/authService";
import { authApiService } from "@/lib/services/authApiService";
import { storeService, Store } from "@/lib/services/storeService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  currentStore: Store | null;
  userRole: string | null;
  signIn: (
    data: SignInData,
    requiredRole?: "ADMIN" | "SELLER"
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshStore: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Load store của user (cho SELLER)
  const loadUserStore = useCallback(async (userId: string) => {
    try {
      const store = await storeService.getFirstStoreByOwner(userId);
      setCurrentStore(store);
    } catch {
      setCurrentStore(null);
    }
  }, []);

  // Load user info từ localStorage
  const loadUserInfo = useCallback(async () => {
    try {
      const userInfo = authApiService.getCurrentUser();

      if (userInfo) {
        setUserRole(userInfo.role);

        // Nếu là SELLER, load store information
        if (userInfo.role === "SELLER" && userInfo.id) {
          await loadUserStore(userInfo.id);
        }
      }
    } catch {
      // Error loading user info
    }
  }, [loadUserStore]);

  // Refresh store information
  const refreshStore = async () => {
    const userInfo = authApiService.getCurrentUser();
    if (userInfo && userInfo.role === "SELLER" && userInfo.id) {
      await loadUserStore(userInfo.id);
    }
  };

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);

        if (user) {
          // Load thông tin user từ localStorage
          await loadUserInfo();
        } else {
          // Clear user info khi logout
          setUserRole(null);
          setCurrentStore(null);
        }

        setLoading(false);
      });

      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, [loadUserInfo]);

  const signIn = async (
    data: SignInData,
    requiredRole: "ADMIN" | "SELLER" = "SELLER"
  ) => {
    try {
      setLoading(true);
      await authService.signIn(data, requiredRole);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true);
      await authService.signUp(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    currentStore,
    userRole,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    refreshStore,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
