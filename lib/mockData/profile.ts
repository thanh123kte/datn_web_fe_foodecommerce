// Seller profile system data types and mock data aligned with database schema

////////////////////////////////////////////////////
// ENUM DEFINITIONS (matching database schema)
////////////////////////////////////////////////////

export enum StoreStatus {
  PENDING = "PENDING", // Chờ duyệt
  ACTIVE = "ACTIVE", // Hoạt động
  INACTIVE = "INACTIVE", // Tạm ngưng
  BANNED = "BANNED", // Bị cấm
  MAINTENANCE = "MAINTENANCE", // Bảo trì
}

export enum OpenStatus {
  OPEN = "OPEN", // Đang mở
  CLOSED = "CLOSED", // Đã đóng
}

export enum VerificationStatus {
  PENDING = "PENDING", // Chờ xét duyệt
  APPROVED = "APPROVED", // Đã duyệt
  REJECTED = "REJECTED", // Bị từ chối
}

export enum RoleType {
  ADMIN = "ADMIN",
  SELLER = "SELLER",
  CUSTOMER = "CUSTOMER",
}

////////////////////////////////////////////////////
// PROFILE INTERFACES
////////////////////////////////////////////////////

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  receiver: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  image_url?: string;
  store_status: StoreStatus;
  open_status: OpenStatus;
  open_time?: string;
  close_time?: string;
  created_at: string;
  updated_at: string;
}

export interface SellerProfile {
  user: User;
  store: Store;
  addresses: Address[];
  verification_status: VerificationStatus;
  business_documents?: BusinessDocument[];
  settings: ProfileSettings;
  statistics: ProfileStatistics;
}

export interface BusinessDocument {
  id: string;
  type: DocumentType;
  title: string;
  file_url: string;
  verification_status: VerificationStatus;
  submitted_at: string;
  reviewed_at?: string;
  notes?: string;
}

export interface ProfileSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  business: BusinessSettings;
}

export interface NotificationSettings {
  email_orders: boolean;
  email_reviews: boolean;
  email_promotions: boolean;
  sms_orders: boolean;
  sms_important: boolean;
  push_orders: boolean;
  push_reviews: boolean;
  push_chat: boolean;
}

export interface PrivacySettings {
  show_phone: boolean;
  show_email: boolean;
  allow_reviews: boolean;
  public_profile: boolean;
}

export interface BusinessSettings {
  auto_accept_orders: boolean;
  preparation_time: number; // minutes
  delivery_radius: number; // km
  minimum_order_value: number;
  service_fee: number;
  commission_rate: number;
}

export interface ProfileStatistics {
  total_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  average_rating: number;
  total_reviews: number;
  response_time: number; // minutes
  online_since: string;
  last_active: string;
}

////////////////////////////////////////////////////
// ENUMS FOR BUSINESS DOCUMENTS
////////////////////////////////////////////////////

export enum DocumentType {
  BUSINESS_LICENSE = "BUSINESS_LICENSE", // Giấy phép kinh doanh
  FOOD_SAFETY = "FOOD_SAFETY", // Giấy chứng nhận ATTP
  TAX_CODE = "TAX_CODE", // Mã số thuế
  IDENTITY_CARD = "IDENTITY_CARD", // CMND/CCCD
  BANK_ACCOUNT = "BANK_ACCOUNT", // Tài khoản ngân hàng
}

////////////////////////////////////////////////////
// UTILITY FUNCTIONS
////////////////////////////////////////////////////

export const getStoreStatusLabel = (status: StoreStatus): string => {
  switch (status) {
    case StoreStatus.PENDING:
      return "Chờ duyệt";
    case StoreStatus.ACTIVE:
      return "Hoạt động";
    case StoreStatus.INACTIVE:
      return "Tạm ngưng";
    case StoreStatus.BANNED:
      return "Bị cấm";
    case StoreStatus.MAINTENANCE:
      return "Bảo trì";
    default:
      return status;
  }
};

export const getStoreStatusColor = (status: StoreStatus): string => {
  switch (status) {
    case StoreStatus.PENDING:
      return "text-yellow-600 bg-yellow-100";
    case StoreStatus.ACTIVE:
      return "text-green-600 bg-green-100";
    case StoreStatus.INACTIVE:
      return "text-gray-600 bg-gray-100";
    case StoreStatus.BANNED:
      return "text-red-600 bg-red-100";
    case StoreStatus.MAINTENANCE:
      return "text-blue-600 bg-blue-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getOpenStatusLabel = (status: OpenStatus): string => {
  switch (status) {
    case OpenStatus.OPEN:
      return "Đang mở cửa";
    case OpenStatus.CLOSED:
      return "Đã đóng cửa";
    default:
      return status;
  }
};

export const getOpenStatusColor = (status: OpenStatus): string => {
  switch (status) {
    case OpenStatus.OPEN:
      return "text-green-600 bg-green-100";
    case OpenStatus.CLOSED:
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getVerificationStatusLabel = (
  status: VerificationStatus
): string => {
  switch (status) {
    case VerificationStatus.PENDING:
      return "Chờ xét duyệt";
    case VerificationStatus.APPROVED:
      return "Đã duyệt";
    case VerificationStatus.REJECTED:
      return "Bị từ chối";
    default:
      return status;
  }
};

export const getVerificationStatusColor = (
  status: VerificationStatus
): string => {
  switch (status) {
    case VerificationStatus.PENDING:
      return "text-yellow-600 bg-yellow-100";
    case VerificationStatus.APPROVED:
      return "text-green-600 bg-green-100";
    case VerificationStatus.REJECTED:
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getDocumentTypeLabel = (type: DocumentType): string => {
  switch (type) {
    case DocumentType.BUSINESS_LICENSE:
      return "Giấy phép kinh doanh";
    case DocumentType.FOOD_SAFETY:
      return "Chứng nhận ATTP";
    case DocumentType.TAX_CODE:
      return "Mã số thuế";
    case DocumentType.IDENTITY_CARD:
      return "CMND/CCCD";
    case DocumentType.BANK_ACCOUNT:
      return "Tài khoản ngân hàng";
    default:
      return type;
  }
};

export const formatBusinessHours = (
  openTime?: string,
  closeTime?: string
): string => {
  if (!openTime || !closeTime) return "Chưa thiết lập";
  return `${openTime} - ${closeTime}`;
};

export const isStoreOpen = (openTime?: string, closeTime?: string): boolean => {
  if (!openTime || !closeTime) return false;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [openHour, openMinute] = openTime.split(":").map(Number);
  const [closeHour, closeMinute] = closeTime.split(":").map(Number);

  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;

  return currentTime >= openMinutes && currentTime <= closeMinutes;
};

////////////////////////////////////////////////////
// MOCK DATA
////////////////////////////////////////////////////

// Mock user data
export const mockUser: User = {
  id: "user_001",
  email: "seller@qtifood.com",
  full_name: "Nguyễn Văn Seller",
  phone: "0901234567",
  gender: "male",
  date_of_birth: "1990-05-15",
  avatar_url:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  is_active: true,
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-11-27T14:30:00Z",
};

// Mock store data
export const mockStore: Store = {
  id: "store_001",
  owner_id: "user_001",
  name: "Nhà Hàng Cơm Tấm Sài Gòn",
  description:
    "Chuyên các món cơm tấm truyền thống Sài Gòn với hương vị đặc trưng. Nguyên liệu tươi ngon, chế biến theo công thức gia truyền.",
  address: "123 Đường Lê Văn Việt, Phường Tăng Nhơn Phú A, TP. Thủ Đức, TP.HCM",
  phone: "0901234567",
  image_url:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  store_status: StoreStatus.ACTIVE,
  open_status: OpenStatus.OPEN,
  open_time: "06:00",
  close_time: "22:00",
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-11-27T14:30:00Z",
};

// Mock addresses
export const mockAddresses: Address[] = [
  {
    id: "addr_001",
    user_id: "user_001",
    receiver: "Nguyễn Văn Seller",
    phone: "0901234567",
    address:
      "123 Đường Lê Văn Việt, Phường Tăng Nhơn Phú A, TP. Thủ Đức, TP.HCM",
    latitude: 10.8508,
    longitude: 106.7583,
    is_default: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "addr_002",
    user_id: "user_001",
    receiver: "Nguyễn Văn Seller",
    phone: "0901234567",
    address: "456 Đường Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP.HCM",
    is_default: false,
    created_at: "2024-02-10T15:30:00Z",
    updated_at: "2024-02-10T15:30:00Z",
  },
];

// Mock business documents
export const mockBusinessDocuments: BusinessDocument[] = [
  {
    id: "doc_001",
    type: DocumentType.BUSINESS_LICENSE,
    title: "Giấy chứng nhận đăng ký kinh doanh",
    file_url: "/documents/business-license.pdf",
    verification_status: VerificationStatus.APPROVED,
    submitted_at: "2024-01-20T09:00:00Z",
    reviewed_at: "2024-01-22T16:30:00Z",
  },
  {
    id: "doc_002",
    type: DocumentType.FOOD_SAFETY,
    title: "Giấy chứng nhận An toàn thực phẩm",
    file_url: "/documents/food-safety.pdf",
    verification_status: VerificationStatus.APPROVED,
    submitted_at: "2024-01-20T09:15:00Z",
    reviewed_at: "2024-01-23T10:00:00Z",
  },
  {
    id: "doc_003",
    type: DocumentType.TAX_CODE,
    title: "Giấy chứng nhận thuế",
    file_url: "/documents/tax-code.pdf",
    verification_status: VerificationStatus.PENDING,
    submitted_at: "2024-11-25T14:00:00Z",
    notes: "Đang chờ xem xét bởi bộ phận pháp lý",
  },
];

// Mock profile settings
export const mockProfileSettings: ProfileSettings = {
  notifications: {
    email_orders: true,
    email_reviews: true,
    email_promotions: false,
    sms_orders: true,
    sms_important: true,
    push_orders: true,
    push_reviews: true,
    push_chat: true,
  },
  privacy: {
    show_phone: true,
    show_email: false,
    allow_reviews: true,
    public_profile: true,
  },
  business: {
    auto_accept_orders: false,
    preparation_time: 20,
    delivery_radius: 5,
    minimum_order_value: 50000,
    service_fee: 5000,
    commission_rate: 15,
  },
};

// Mock profile statistics
export const mockProfileStatistics: ProfileStatistics = {
  total_orders: 1248,
  completed_orders: 1156,
  cancelled_orders: 92,
  average_rating: 4.6,
  total_reviews: 456,
  response_time: 12,
  online_since: "2024-01-15T10:00:00Z",
  last_active: "2024-11-27T14:30:00Z",
};

// Complete seller profile
export const mockSellerProfile: SellerProfile = {
  user: mockUser,
  store: mockStore,
  addresses: mockAddresses,
  verification_status: VerificationStatus.APPROVED,
  business_documents: mockBusinessDocuments,
  settings: mockProfileSettings,
  statistics: mockProfileStatistics,
};

////////////////////////////////////////////////////
// API SIMULATION FUNCTIONS
////////////////////////////////////////////////////

export const profileAPI = {
  // Get seller profile
  getSellerProfile: async (): Promise<SellerProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockSellerProfile;
  },

  // Update user information
  updateUser: async (userData: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const updatedUser = {
      ...mockUser,
      ...userData,
      updated_at: new Date().toISOString(),
    };
    Object.assign(mockUser, updatedUser);
    return updatedUser;
  },

  // Update store information
  updateStore: async (storeData: Partial<Store>): Promise<Store> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const updatedStore = {
      ...mockStore,
      ...storeData,
      updated_at: new Date().toISOString(),
    };
    Object.assign(mockStore, updatedStore);
    return updatedStore;
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Simulate file upload and return URL
    const avatarUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&t=${Date.now()}`;
    mockUser.avatar_url = avatarUrl;
    return avatarUrl;
  },

  // Upload store image
  uploadStoreImage: async (file: File): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const imageUrl = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&t=${Date.now()}`;
    mockStore.image_url = imageUrl;
    return imageUrl;
  },

  // Add address
  addAddress: async (
    addressData: Omit<Address, "id" | "created_at" | "updated_at">
  ): Promise<Address> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newAddress: Address = {
      ...addressData,
      id: `addr_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockAddresses.push(newAddress);
    return newAddress;
  },

  // Update address
  updateAddress: async (
    addressId: string,
    addressData: Partial<Address>
  ): Promise<Address> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const addressIndex = mockAddresses.findIndex(
      (addr) => addr.id === addressId
    );
    if (addressIndex !== -1) {
      const updatedAddress = {
        ...mockAddresses[addressIndex],
        ...addressData,
        updated_at: new Date().toISOString(),
      };
      mockAddresses[addressIndex] = updatedAddress;
      return updatedAddress;
    }
    throw new Error("Address not found");
  },

  // Delete address
  deleteAddress: async (addressId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const addressIndex = mockAddresses.findIndex(
      (addr) => addr.id === addressId
    );
    if (addressIndex !== -1) {
      mockAddresses.splice(addressIndex, 1);
      return true;
    }
    return false;
  },

  // Update settings
  updateSettings: async (
    settings: Partial<ProfileSettings>
  ): Promise<ProfileSettings> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const updatedSettings = {
      ...mockProfileSettings,
      ...settings,
      notifications: {
        ...mockProfileSettings.notifications,
        ...settings.notifications,
      },
      privacy: { ...mockProfileSettings.privacy, ...settings.privacy },
      business: { ...mockProfileSettings.business, ...settings.business },
    };
    Object.assign(mockProfileSettings, updatedSettings);
    return updatedSettings;
  },

  // Upload business document
  uploadDocument: async (
    file: File,
    type: DocumentType,
    title: string
  ): Promise<BusinessDocument> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newDocument: BusinessDocument = {
      id: `doc_${Date.now()}`,
      type,
      title,
      file_url: `/documents/${file.name}`,
      verification_status: VerificationStatus.PENDING,
      submitted_at: new Date().toISOString(),
    };
    mockBusinessDocuments.push(newDocument);
    return newDocument;
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Simulate password validation and update
    if (currentPassword === "current-password") {
      return true;
    }
    throw new Error("Mật khẩu hiện tại không đúng");
  },

  // Toggle store status
  toggleStoreStatus: async (): Promise<OpenStatus> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newStatus =
      mockStore.open_status === OpenStatus.OPEN
        ? OpenStatus.CLOSED
        : OpenStatus.OPEN;
    mockStore.open_status = newStatus;
    mockStore.updated_at = new Date().toISOString();
    return newStatus;
  },
};
