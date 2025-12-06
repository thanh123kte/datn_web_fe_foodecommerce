"use client";
import { useState, useCallback, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PersonalInfo,
  StoreInfo,
  BusinessHours,
} from "./components/ProfileInfo";
import { SettingsSection } from "./components/SettingsSection";
import { User, Store } from "@/lib/mockData/profile";
import { profileService, SellerProfile } from "@/lib/services/profileService";
import { authApiService } from "@/lib/services/authApiService";
import { useAuth } from "@/contexts/AuthContext";
import { buildAbsoluteUrl } from "@/lib/config/env";
import { User as UserIcon, Store as StoreIcon, Settings } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { userRole } = useAuth();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper function to resolve avatar - handle both absolute and relative URLs
  const resolveAvatar = useCallback(
    (url?: string | null, name?: string | null) => {
      // If no URL, use generated avatar
      if (!url) {
        const safeName = encodeURIComponent(name || "User");
        return `https://ui-avatars.com/api/?name=${safeName}&background=E5E7EB&color=111827`;
      }

      // If absolute URL (http/https), use as is
      if (/^https?:\/\//i.test(url)) {
        return url;
      }

      // Fix backend URL that starts with /users/ - should be /uploads/users/
      let normalizedUrl = url;
      if (url.startsWith("/users/")) {
        normalizedUrl = `/uploads${url}`;
      } else if (url.startsWith("users/")) {
        normalizedUrl = `/uploads/${url}`;
      }

      // Build absolute URL
      const absolute = buildAbsoluteUrl(normalizedUrl);

      if (absolute) {
        return absolute;
      }

      // Fallback to generated avatar if buildAbsoluteUrl fails
      const safeName = encodeURIComponent(name || "User");
      return `https://ui-avatars.com/api/?name=${safeName}&background=E5E7EB&color=111827`;
    },
    []
  );

  // Initial fetch
  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = authApiService.getCurrentUser();
      if (!currentUser?.id) {
        setProfile(null);
        return;
      }
      setLoading(true);
      try {
        const data = await profileService.getSellerProfile(currentUser.id);

        // Apply avatar resolution logic
        const profileWithResolvedAvatar: SellerProfile = {
          ...data,
          user: {
            ...data.user,
            avatar_url: resolveAvatar(
              data.user.avatar_url,
              data.user.full_name
            ),
          },
        };

        setProfile(profileWithResolvedAvatar);
      } catch (err) {
        console.error("Error loading profile", err);
        toast.error("Không tải được thông tin hồ sơ");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userRole, resolveAvatar]);

  // User update handler
  const handleUserUpdate = useCallback(
    async (userData: Partial<User>) => {
      if (!profile) return;
      setLoading(true);
      try {
        const updatedUser = await profileService.updateUser(
          profile.user.id,
          userData
        );

        // Apply avatar resolution if avatar_url exists in update
        const userWithResolvedAvatar = {
          ...updatedUser,
          avatar_url: resolveAvatar(
            updatedUser.avatar_url || profile.user.avatar_url,
            updatedUser.full_name || profile.user.full_name
          ),
        };

        setProfile((prev) =>
          prev
            ? { ...prev, user: { ...prev.user, ...userWithResolvedAvatar } }
            : prev
        );
        toast.success("Personal information updated successfully");
      } catch {
        toast.error("Error updating personal information");
      } finally {
        setLoading(false);
      }
    },
    [profile, resolveAvatar]
  );

  // Store update handler
  const handleStoreUpdate = useCallback(
    async (storeData: Partial<Store>) => {
      if (!profile?.store.id) return;
      setLoading(true);
      try {
        const updatedStore = await profileService.updateStore(
          profile.store.id,
          storeData
        );
        setProfile((prev) =>
          prev ? { ...prev, store: { ...prev.store, ...updatedStore } } : prev
        );
        toast.success("Store information updated successfully");
      } catch {
        toast.error("Error updating store information");
      } finally {
        setLoading(false);
      }
    },
    [profile?.store.id]
  );

  // Open time update handler
  const handleBusinessHoursUpdate = useCallback(
    async (openTime: string, closeTime: string) => {
      if (!profile?.store.id) return;
      setLoading(true);
      try {
        const updatedStore = await profileService.updateStore(
          profile.store.id,
          { open_time: openTime, close_time: closeTime }
        );
        setProfile((prev) =>
          prev ? { ...prev, store: { ...prev.store, ...updatedStore } } : prev
        );
        toast.success("Open time updated successfully");
      } catch {
        toast.error("Error updating open time");
      } finally {
        setLoading(false);
      }
    },
    [profile?.store.id]
  );

  // Avatar upload handler
  const handleAvatarUpload = useCallback(
    async (file: File) => {
      if (!profile) return;
      setLoading(true);
      try {
        const updatedUser = await profileService.uploadAvatar(
          profile.user.id,
          file
        );

        // Apply avatar resolution to updated user
        const userWithResolvedAvatar = {
          ...updatedUser,
          avatar_url: resolveAvatar(
            updatedUser.avatar_url,
            updatedUser.full_name
          ),
        };

        setProfile((prev) =>
          prev
            ? { ...prev, user: { ...prev.user, ...userWithResolvedAvatar } }
            : prev
        );
        toast.success("Avatar updated successfully");
      } catch {
        toast.error("Error uploading avatar");
      } finally {
        setLoading(false);
      }
    },
    [profile, resolveAvatar]
  );

  // Store image upload handler
  const handleStoreImageUpload = useCallback(
    async (file: File) => {
      if (!profile?.store.id) return;
      setLoading(true);
      try {
        const updatedStore = await profileService.uploadStoreImage(
          profile.store.id,
          file
        );

        setProfile((prev) =>
          prev ? { ...prev, store: { ...prev.store, ...updatedStore } } : prev
        );
        toast.success("Store image updated successfully");
      } catch {
        toast.error("Error uploading store image");
      } finally {
        setLoading(false);
      }
    },
    [profile?.store.id]
  );

  // Settings handlers
  const handleChangePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      setLoading(true);
      try {
        await profileService.changePassword(oldPassword, newPassword);
        toast.success("Password changed successfully");
      } catch {
        toast.error("Error changing password");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleUpdateNotifications = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (settings: {
      email_notifications: boolean;
      order_notifications: boolean;
      promotion_notifications: boolean;
      review_notifications: boolean;
    }) => {
      setLoading(true);
      try {
        // TODO: Update settings properly with correct structure
        toast.info("Notification settings update not implemented yet");
      } catch {
        toast.error("Error updating settings");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  if (!profile) {
    return (
      <MainLayout userRole="seller" title="Store Profile">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">
              {loading ? "Loading profile..." : "No profile data"}
            </span>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout userRole="seller" title="Store Profile">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Store Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your personal information, store details and account
              settings
            </p>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2">
              <StoreIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Store</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <PersonalInfo
              user={profile.user}
              onUpdate={handleUserUpdate}
              onUploadAvatar={handleAvatarUpload}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="store" className="space-y-6">
            <StoreInfo
              store={profile.store}
              onUpdate={handleStoreUpdate}
              onUploadImage={handleStoreImageUpload}
              loading={loading}
            />
            <BusinessHours
              openTime={profile.store.open_time}
              closeTime={profile.store.close_time}
              onUpdate={handleBusinessHoursUpdate}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsSection
              onChangePassword={handleChangePassword}
              onUpdateNotifications={handleUpdateNotifications}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
