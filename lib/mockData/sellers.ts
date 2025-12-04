// Mock seller accounts for testing
export interface MockSeller {
  id: string;
  email: string;
  password: string;
  name: string;
  storeName: string;
  phone: string;
  status: "active" | "pending" | "suspended";
  joinDate: string;
}

export const mockSellers: MockSeller[] = [
  {
    id: "1",
    email: "admin@qtifood.com",
    password: "123456",
    name: "Nguyễn Văn An",
    storeName: "QtiFood Store",
    phone: "0901234567",
    status: "active",
    joinDate: "2024-01-15",
  },
];

// Mock authentication functions
export const authenticateSeller = (
  email: string,
  password: string
): MockSeller | null => {
  const seller = mockSellers.find(
    (s) => s.email === email && s.password === password
  );
  return seller || null;
};

export const getSellerByEmail = (email: string): MockSeller | null => {
  return mockSellers.find((s) => s.email === email) || null;
};

// Mock login response
export interface LoginResponse {
  success: boolean;
  message: string;
  seller?: MockSeller;
  token?: string;
}

export const mockLogin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const seller = authenticateSeller(email, password);

  if (!seller) {
    return {
      success: false,
      message: "Email hoặc mật khẩu không đúng!",
    };
  }

  return {
    success: true,
    message: "Đăng nhập thành công!",
    seller,
    token: `mock_token_${seller.id}_${Date.now()}`,
  };
};

// Test account info for developers
export const testAccount = {
  email: "seller@qtifood.com",
  password: "123456",
};
