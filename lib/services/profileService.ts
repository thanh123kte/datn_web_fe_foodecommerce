import axiosInstance from "@/lib/api/axiosConfig";
import {
  Address,
  ProfileSettings,
  ProfileStatistics,
  SellerProfile,
  Store,
  StoreStatus,
  VerificationStatus,
  User,
  mockProfileSettings,
  mockProfileStatistics,
} from "@/lib/mockData/profile";
import storeService from "./storeService";
import { buildAbsoluteUrl } from "@/lib/config/env";

type BackendUser = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type BackendStore = {
  id: number;
  ownerId: string;
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  imageUrl?: string;
  status: StoreStatus;
  opStatus?: string;
  openTime?: string;
  closeTime?: string;
  createdAt: string;
  updatedAt: string;
};

type BackendAddress = {
  id: number;
  receiver: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
};

const mapUser = (u: BackendUser): User => ({
  id: u.id,
  email: u.email,
  full_name: u.fullName,
  phone: u.phone,
  gender: u.gender,
  date_of_birth: u.dateOfBirth,
  avatar_url: u.avatarUrl, // Keep original URL, let resolveAvatar handle it
  is_active: u.isActive,
  created_at: u.createdAt,
  updated_at: u.updatedAt,
});

const mapStore = (s: BackendStore, ownerId: string): Store => ({
  id: String(s.id),
  owner_id: s.ownerId || ownerId,
  name: s.name,
  description: s.description,
  address: s.address,
  phone: s.phone,
  image_url: buildAbsoluteUrl(s.imageUrl),
  store_status: s.status,
  open_status: (s.opStatus as Store["open_status"]) || "OPEN",
  open_time: s.openTime || "",
  close_time: s.closeTime || "",
  created_at: s.createdAt,
  updated_at: s.updatedAt,
});

const emptyStore = (ownerId: string): Store => ({
  id: "",
  owner_id: ownerId,
  name: "",
  description: "",
  address: "",
  phone: "",
  image_url: "",
  store_status: StoreStatus.PENDING,
  open_status: "CLOSED",
  open_time: "",
  close_time: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const mapAddress = (a: BackendAddress, userId: string): Address => ({
  id: String(a.id),
  user_id: userId,
  receiver: a.receiver,
  phone: a.phone,
  address: a.address,
  latitude: a.latitude,
  longitude: a.longitude,
  is_default: !!a.isDefault,
  created_at: a.createdAt,
  updated_at: a.updatedAt,
});

const ensureSettings = (settings?: ProfileSettings): ProfileSettings => {
  if (!settings) return { ...mockProfileSettings };
  return {
    notifications: {
      ...mockProfileSettings.notifications,
      ...settings.notifications,
    },
    privacy: { ...mockProfileSettings.privacy, ...settings.privacy },
    business: { ...mockProfileSettings.business, ...settings.business },
  };
};

export const profileService = {
  async getSellerProfile(userId: string): Promise<SellerProfile> {
    const [userRes, storesRes, addressesRes] = await Promise.all([
      axiosInstance.get<BackendUser>(`/api/users/${userId}`),
      storeService.getByOwner(userId),
      axiosInstance.get<BackendAddress[]>(`/api/addresses/user/${userId}`),
    ]);

    const user = mapUser(userRes.data);
    const storeDto = (storesRes ?? [])[0];
    const store = storeDto
      ? mapStore(storeDto as unknown as BackendStore, userId)
      : emptyStore(userId);
    const addresses = (addressesRes.data ?? []).map((a) =>
      mapAddress(a, userId)
    );

    const statistics: ProfileStatistics = { ...mockProfileStatistics };
    const settings: ProfileSettings = ensureSettings();

    return {
      user,
      store,
      addresses,
      verification_status: VerificationStatus.APPROVED,
      business_documents: [],
      settings,
      statistics,
    };
  },

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const payload = {
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      avatarUrl: data.avatar_url,
      dateOfBirth: data.date_of_birth,
      gender: data.gender,
      isActive: data.is_active,
    };
    const res = await axiosInstance.put<BackendUser>(
      `/api/users/${userId}`,
      payload
    );
    return mapUser(res.data);
  },

  async uploadAvatar(userId: string, file: File): Promise<User> {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await axiosInstance.post<BackendUser>(
      `/api/users/${userId}/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return mapUser(res.data);
  },

  async updateStore(storeId: string, data: Partial<Store>): Promise<Store> {
    const payload = {
      name: data.name,
      address: data.address,
      description: data.description,
      phone: data.phone,
      email: undefined,
      imageUrl: data.image_url,
      openTime: data.open_time,
      closeTime: data.close_time,
      status: data.store_status,
    };
    const res = await axiosInstance.put<BackendStore>(
      `/api/stores/${storeId}`,
      payload
    );
    return mapStore(res.data, res.data.ownerId || data.owner_id || "");
  },

  async addAddress(
    userId: string,
    data: Omit<Address, "id" | "created_at" | "updated_at">
  ): Promise<Address> {
    const payload = {
      receiver: data.receiver,
      phone: data.phone,
      address: data.address,
      userId,
      latitude: data.latitude,
      longitude: data.longitude,
    };
    const res = await axiosInstance.post<BackendAddress>(
      "/api/addresses",
      payload
    );
    return mapAddress(res.data, userId);
  },

  async updateAddress(
    addressId: string,
    data: Partial<Address>,
    userId?: string
  ): Promise<Address> {
    const payload = {
      receiver: data.receiver,
      phone: data.phone,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
    };
    const res = await axiosInstance.put<BackendAddress>(
      `/api/addresses/${addressId}`,
      payload
    );
    return mapAddress(res.data, userId || data.user_id || "");
  },

  async deleteAddress(addressId: string): Promise<void> {
    await axiosInstance.delete(`/api/addresses/${addressId}`);
  },

  async updateSettings(settings: ProfileSettings): Promise<ProfileSettings> {
    // No backend endpoint yet; just return merged settings for now.
    return ensureSettings(settings);
  },

  async changePassword(
    _oldPassword: string,
    _newPassword: string
  ): Promise<void> {
    // Password change endpoint not provided in backend; placeholder to keep UI flow.
    return;
  },
};

export type { SellerProfile, User, Store, Address, ProfileSettings };
