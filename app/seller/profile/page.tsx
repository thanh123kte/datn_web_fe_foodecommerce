"use client";

import { useState, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PersonalInfo,
  StoreInfo,
  BusinessHours,
} from "./components/ProfileInfo";
import { AddressList } from "./components/AddressList";
import { SettingsSection } from "./components/SettingsSection";
import {
  mockSellerProfile,
  profileAPI,
  User,
  Store,
  Address,
} from "@/lib/mockData/profile";
import {
  User as UserIcon,
  Store as StoreIcon,
  MapPin,
  Settings,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] = useState(mockSellerProfile);
  const [loading, setLoading] = useState(false);

  // User update handler
  const handleUserUpdate = useCallback(async (userData: Partial<User>) => {
    setLoading(true);
    try {
      const updatedUser = await profileAPI.updateUser(userData);
      setProfile((prev) => ({
        ...prev,
        user: { ...prev.user, ...updatedUser },
      }));
      toast.success("Personal information updated successfully");
    } catch {
      toast.error("Error updating personal information");
    } finally {
      setLoading(false);
    }
  }, []);

  // Store update handler
  const handleStoreUpdate = useCallback(async (storeData: Partial<Store>) => {
    setLoading(true);
    try {
      const updatedStore = await profileAPI.updateStore(storeData);
      setProfile((prev) => ({
        ...prev,
        store: { ...prev.store, ...updatedStore },
      }));
      toast.success("Store information updated successfully");
    } catch {
      toast.error("Error updating store information");
    } finally {
      setLoading(false);
    }
  }, []);

  // Business hours update handler
  const handleBusinessHoursUpdate = useCallback(
    async (openTime: string, closeTime: string) => {
      setLoading(true);
      try {
        const updatedStore = await profileAPI.updateStore({
          open_time: openTime,
          close_time: closeTime,
        });
        setProfile((prev) => ({
          ...prev,
          store: { ...prev.store, ...updatedStore },
        }));
        toast.success("Business hours updated successfully");
      } catch {
        toast.error("Error updating business hours");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Avatar upload handler
  const handleAvatarUpload = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const avatarUrl = await profileAPI.uploadImage(file);
      const updatedUser = await profileAPI.updateUser({ avatar: avatarUrl });
      setProfile((prev) => ({
        ...prev,
        user: { ...prev.user, ...updatedUser },
      }));
      toast.success("Avatar updated successfully");
    } catch {
      toast.error("Error uploading avatar");
    } finally {
      setLoading(false);
    }
  }, []);

  // Store image upload handler
  const handleStoreImageUpload = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const imageUrl = await profileAPI.uploadImage(file);
      const updatedStore = await profileAPI.updateStore({ image: imageUrl });
      setProfile((prev) => ({
        ...prev,
        store: { ...prev.store, ...updatedStore },
      }));
      toast.success("Store image updated successfully");
    } catch {
      toast.error("Error uploading store image");
    } finally {
      setLoading(false);
    }
  }, []);

  // Address handlers
  const handleAddAddress = useCallback(
    async (addressData: Omit<Address, "id" | "created_at" | "updated_at">) => {
      setLoading(true);
      try {
        const newAddress = await profileAPI.addAddress({
          ...addressData,
          user_id: profile.user.id,
        });
        setProfile((prev) => ({
          ...prev,
          addresses: [...prev.addresses, newAddress],
        }));
        toast.success("Address added successfully");
      } catch {
        toast.error("Error adding address");
      } finally {
        setLoading(false);
      }
    },
    [profile.user.id]
  );

  const handleUpdateAddress = useCallback(
    async (addressId: string, addressData: Partial<Address>) => {
      setLoading(true);
      try {
        const updatedAddress = await profileAPI.updateAddress(
          addressId,
          addressData
        );
        setProfile((prev) => ({
          ...prev,
          addresses: prev.addresses.map((addr) =>
            addr.id === addressId ? { ...addr, ...updatedAddress } : addr
          ),
        }));
        toast.success("Address updated successfully");
      } catch {
        toast.error("Error updating address");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleDeleteAddress = useCallback(async (addressId: string) => {
    setLoading(true);
    try {
      await profileAPI.deleteAddress(addressId);
      setProfile((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((addr) => addr.id !== addressId),
      }));
      toast.success("Address deleted successfully");
    } catch {
      toast.error("Error deleting address");
    } finally {
      setLoading(false);
    }
  }, []);

  // Settings handlers
  const handleChangePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      setLoading(true);
      try {
        await profileAPI.changePassword(oldPassword, newPassword);
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
    async (settings: Record<string, boolean>) => {
      setLoading(true);
      try {
        await profileAPI.updateSettings(settings);
        toast.success("Notification settings updated successfully");
      } catch {
        toast.error("Error updating settings");
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2">
              <StoreIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Store</span>
            </TabsTrigger>
            <TabsTrigger value="hours" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Hours</span>
            </TabsTrigger>
            <TabsTrigger value="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Address</span>
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
          </TabsContent>

          <TabsContent value="hours" className="space-y-6">
            <BusinessHours
              openTime={profile.store.open_time}
              closeTime={profile.store.close_time}
              onUpdate={handleBusinessHoursUpdate}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <AddressList
              addresses={profile.addresses}
              onAdd={handleAddAddress}
              onUpdate={handleUpdateAddress}
              onDelete={handleDeleteAddress}
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
