// Wallet system data types and mock data aligned with database schema

////////////////////////////////////////////////////
// ENUM DEFINITIONS (matching database schema)
////////////////////////////////////////////////////

export enum TransactionType {
  DEPOSIT = "DEPOSIT", // Nạp tiền
  WITHDRAW = "WITHDRAW", // Rút tiền
  EARN = "EARN", // Thu nhập từ đơn hàng
  REFUND = "REFUND", // Hoàn tiền
  PAYMENT = "PAYMENT", // Thanh toán
}

export enum PaymentMethod {
  COD = "COD", // Cash on Delivery
  QTIWALLET = "QTIWALLET", // QtiWallet payment
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

////////////////////////////////////////////////////
// WALLET INTERFACES
////////////////////////////////////////////////////

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  transaction_type: TransactionType;
  description: string;
  created_at: string;
  order_id?: string; // For order-related transactions
  store_name?: string; // For display purposes
  customer_name?: string; // For display purposes
  status?: PaymentStatus; // For pending transactions
}

export interface WalletStats {
  current_balance: number;
  total_earned: number;
  total_withdrawn: number;
  total_refunded: number;
  pending_withdrawals: number;
  monthly_earnings: number;
  weekly_earnings: number;
  total_transactions: number;
  recent_transaction_count: number;
}

export interface MonthlyEarning {
  month: string;
  year: number;
  total_earnings: number;
  total_orders: number;
  average_order_value: number;
}

export interface DailyEarning {
  date: string;
  earnings: number;
  orders: number;
  refunds: number;
}

export interface WithdrawalRequest {
  id: string;
  wallet_id: string;
  amount: number;
  bank_account: string;
  bank_name: string;
  account_holder: string;
  status: PaymentStatus;
  requested_at: string;
  processed_at?: string;
  notes?: string;
}

////////////////////////////////////////////////////
// UTILITY FUNCTIONS
////////////////////////////////////////////////////

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const getTransactionTypeLabel = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.DEPOSIT:
      return "Nạp tiền";
    case TransactionType.WITHDRAW:
      return "Rút tiền";
    case TransactionType.EARN:
      return "Thu nhập";
    case TransactionType.REFUND:
      return "Hoàn tiền";
    case TransactionType.PAYMENT:
      return "Thanh toán";
    default:
      return type;
  }
};

export const getTransactionTypeColor = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.DEPOSIT:
      return "text-blue-600 bg-blue-100";
    case TransactionType.WITHDRAW:
      return "text-orange-600 bg-orange-100";
    case TransactionType.EARN:
      return "text-green-600 bg-green-100";
    case TransactionType.REFUND:
      return "text-red-600 bg-red-100";
    case TransactionType.PAYMENT:
      return "text-purple-600 bg-purple-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.SUCCESS:
      return "text-green-600 bg-green-100";
    case PaymentStatus.PENDING:
      return "text-yellow-600 bg-yellow-100";
    case PaymentStatus.FAILED:
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const isPositiveTransaction = (type: TransactionType): boolean => {
  return [TransactionType.DEPOSIT, TransactionType.EARN].includes(type);
};

export const isNegativeTransaction = (type: TransactionType): boolean => {
  return [
    TransactionType.WITHDRAW,
    TransactionType.PAYMENT,
    TransactionType.REFUND,
  ].includes(type);
};

////////////////////////////////////////////////////
// MOCK DATA
////////////////////////////////////////////////////

// Mock wallet data for seller
export const mockWallet: Wallet = {
  id: "wallet_001",
  user_id: "seller_001",
  balance: 15750000, // 15.75M VND
  updated_at: "2024-11-27T10:30:00Z",
};

// Mock wallet statistics
export const mockWalletStats: WalletStats = {
  current_balance: 15750000,
  total_earned: 45230000,
  total_withdrawn: 25000000,
  total_refunded: 1480000,
  pending_withdrawals: 2500000,
  monthly_earnings: 8750000,
  weekly_earnings: 2150000,
  total_transactions: 156,
  recent_transaction_count: 24,
};

// Mock transactions data
export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: "txn_001",
    wallet_id: "wallet_001",
    amount: 125000,
    transaction_type: TransactionType.EARN,
    description: "Thu nhập từ đơn hàng #ORD001",
    created_at: "2024-11-27T09:15:00Z",
    order_id: "ORD001",
    customer_name: "Nguyen Van A",
    status: PaymentStatus.SUCCESS,
  },
  {
    id: "txn_002",
    wallet_id: "wallet_001",
    amount: 2500000,
    transaction_type: TransactionType.WITHDRAW,
    description: "Rút tiền về tài khoản ngân hàng Vietcombank",
    created_at: "2024-11-27T08:30:00Z",
    status: PaymentStatus.PENDING,
  },
  {
    id: "txn_003",
    wallet_id: "wallet_001",
    amount: 89000,
    transaction_type: TransactionType.EARN,
    description: "Thu nhập từ đơn hàng #ORD002",
    created_at: "2024-11-26T19:45:00Z",
    order_id: "ORD002",
    customer_name: "Tran Thi B",
    status: PaymentStatus.SUCCESS,
  },
  {
    id: "txn_004",
    wallet_id: "wallet_001",
    amount: 45000,
    transaction_type: TransactionType.REFUND,
    description: "Hoàn tiền đơn hàng bị hủy #ORD003",
    created_at: "2024-11-26T16:20:00Z",
    order_id: "ORD003",
    customer_name: "Le Van C",
    status: PaymentStatus.SUCCESS,
  },
  {
    id: "txn_005",
    wallet_id: "wallet_001",
    amount: 5000000,
    transaction_type: TransactionType.DEPOSIT,
    description: "Nạp tiền từ tài khoản ngân hàng",
    created_at: "2024-11-26T14:10:00Z",
    status: PaymentStatus.SUCCESS,
  },
  {
    id: "txn_006",
    wallet_id: "wallet_001",
    amount: 178000,
    transaction_type: TransactionType.EARN,
    description: "Thu nhập từ đơn hàng #ORD004",
    created_at: "2024-11-26T12:30:00Z",
    order_id: "ORD004",
    customer_name: "Pham Thi D",
    status: PaymentStatus.SUCCESS,
  },
  {
    id: "txn_007",
    wallet_id: "wallet_001",
    amount: 95000,
    transaction_type: TransactionType.EARN,
    description: "Thu nhập từ đơn hàng #ORD005",
    created_at: "2024-11-25T20:15:00Z",
    order_id: "ORD005",
    customer_name: "Hoang Van E",
    status: PaymentStatus.SUCCESS,
  },
  {
    id: "txn_008",
    wallet_id: "wallet_001",
    amount: 1000000,
    transaction_type: TransactionType.WITHDRAW,
    description: "Rút tiền về tài khoản ngân hàng BIDV",
    created_at: "2024-11-25T15:45:00Z",
    status: PaymentStatus.SUCCESS,
  },
  {
    id: "txn_009",
    wallet_id: "wallet_001",
    amount: 156000,
    transaction_type: TransactionType.EARN,
    description: "Thu nhập từ đơn hàng #ORD006",
    created_at: "2024-11-25T11:20:00Z",
    order_id: "ORD006",
    customer_name: "Vu Thi F",
    status: PaymentStatus.SUCCESS,
  },
  {
    id: "txn_010",
    wallet_id: "wallet_001",
    amount: 67000,
    transaction_type: TransactionType.REFUND,
    description: "Hoàn tiền đơn hàng có vấn đề #ORD007",
    created_at: "2024-11-24T18:10:00Z",
    order_id: "ORD007",
    customer_name: "Do Van G",
    status: PaymentStatus.SUCCESS,
  },
];

// Mock monthly earnings data
export const mockMonthlyEarnings: MonthlyEarning[] = [
  {
    month: "Jan",
    year: 2024,
    total_earnings: 12500000,
    total_orders: 145,
    average_order_value: 86207,
  },
  {
    month: "Feb",
    year: 2024,
    total_earnings: 14200000,
    total_orders: 167,
    average_order_value: 85030,
  },
  {
    month: "Mar",
    year: 2024,
    total_earnings: 16800000,
    total_orders: 189,
    average_order_value: 88889,
  },
  {
    month: "Apr",
    year: 2024,
    total_earnings: 15600000,
    total_orders: 178,
    average_order_value: 87640,
  },
  {
    month: "May",
    year: 2024,
    total_earnings: 18900000,
    total_orders: 201,
    average_order_value: 94030,
  },
  {
    month: "Jun",
    year: 2024,
    total_earnings: 17300000,
    total_orders: 195,
    average_order_value: 88718,
  },
  {
    month: "Jul",
    year: 2024,
    total_earnings: 19450000,
    total_orders: 208,
    average_order_value: 93510,
  },
  {
    month: "Aug",
    year: 2024,
    total_earnings: 21200000,
    total_orders: 224,
    average_order_value: 94643,
  },
  {
    month: "Sep",
    year: 2024,
    total_earnings: 18750000,
    total_orders: 198,
    average_order_value: 94697,
  },
  {
    month: "Oct",
    year: 2024,
    total_earnings: 20100000,
    total_orders: 215,
    average_order_value: 93488,
  },
  {
    month: "Nov",
    year: 2024,
    total_earnings: 8750000,
    total_orders: 89,
    average_order_value: 98315,
  },
];

// Mock daily earnings for current month
export const mockDailyEarnings: DailyEarning[] = [
  { date: "2024-11-01", earnings: 450000, orders: 5, refunds: 0 },
  { date: "2024-11-02", earnings: 380000, orders: 4, refunds: 25000 },
  { date: "2024-11-03", earnings: 620000, orders: 7, refunds: 0 },
  { date: "2024-11-04", earnings: 295000, orders: 3, refunds: 0 },
  { date: "2024-11-05", earnings: 520000, orders: 6, refunds: 15000 },
  { date: "2024-11-06", earnings: 410000, orders: 5, refunds: 0 },
  { date: "2024-11-07", earnings: 680000, orders: 8, refunds: 30000 },
  { date: "2024-11-08", earnings: 345000, orders: 4, refunds: 0 },
  { date: "2024-11-09", earnings: 590000, orders: 6, refunds: 0 },
  { date: "2024-11-10", earnings: 475000, orders: 5, refunds: 20000 },
];

// Mock withdrawal requests
export const mockWithdrawalRequests: WithdrawalRequest[] = [
  {
    id: "withdraw_001",
    wallet_id: "wallet_001",
    amount: 2500000,
    bank_account: "1234567890",
    bank_name: "Vietcombank",
    account_holder: "NGUYEN VAN SELLER",
    status: PaymentStatus.PENDING,
    requested_at: "2024-11-27T08:30:00Z",
    notes: "Rút tiền định kỳ cuối tuần",
  },
  {
    id: "withdraw_002",
    wallet_id: "wallet_001",
    amount: 1000000,
    bank_account: "0987654321",
    bank_name: "BIDV",
    account_holder: "NGUYEN VAN SELLER",
    status: PaymentStatus.SUCCESS,
    requested_at: "2024-11-25T15:45:00Z",
    processed_at: "2024-11-25T16:30:00Z",
  },
  {
    id: "withdraw_003",
    wallet_id: "wallet_001",
    amount: 3000000,
    bank_account: "1122334455",
    bank_name: "Techcombank",
    account_holder: "NGUYEN VAN SELLER",
    status: PaymentStatus.SUCCESS,
    requested_at: "2024-11-20T10:15:00Z",
    processed_at: "2024-11-20T14:20:00Z",
  },
];

////////////////////////////////////////////////////
// API SIMULATION FUNCTIONS
////////////////////////////////////////////////////

export const walletAPI = {
  // Get wallet information
  getWallet: async (): Promise<Wallet> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockWallet;
  },

  // Get wallet statistics
  getWalletStats: async (): Promise<WalletStats> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockWalletStats;
  },

  // Get transaction history with pagination
  getTransactions: async (
    page: number = 1,
    limit: number = 10
  ): Promise<{
    transactions: WalletTransaction[];
    total: number;
    hasMore: boolean;
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const transactions = mockWalletTransactions.slice(startIndex, endIndex);

    return {
      transactions,
      total: mockWalletTransactions.length,
      hasMore: endIndex < mockWalletTransactions.length,
    };
  },

  // Get transactions by type
  getTransactionsByType: async (
    type: TransactionType
  ): Promise<WalletTransaction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockWalletTransactions.filter(
      (txn) => txn.transaction_type === type
    );
  },

  // Get monthly earnings
  getMonthlyEarnings: async (): Promise<MonthlyEarning[]> => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return mockMonthlyEarnings;
  },

  // Get daily earnings for current month
  getDailyEarnings: async (): Promise<DailyEarning[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockDailyEarnings;
  },

  // Get withdrawal requests
  getWithdrawalRequests: async (): Promise<WithdrawalRequest[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockWithdrawalRequests;
  },

  // Create withdrawal request
  createWithdrawalRequest: async (
    request: Omit<WithdrawalRequest, "id" | "status" | "requested_at">
  ): Promise<WithdrawalRequest> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newRequest: WithdrawalRequest = {
      ...request,
      id: `withdraw_${Date.now()}`,
      status: PaymentStatus.PENDING,
      requested_at: new Date().toISOString(),
    };

    mockWithdrawalRequests.unshift(newRequest);
    return newRequest;
  },

  // Cancel withdrawal request
  cancelWithdrawalRequest: async (requestId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const requestIndex = mockWithdrawalRequests.findIndex(
      (req) => req.id === requestId
    );
    if (
      requestIndex !== -1 &&
      mockWithdrawalRequests[requestIndex].status === PaymentStatus.PENDING
    ) {
      mockWithdrawalRequests.splice(requestIndex, 1);
      return true;
    }
    return false;
  },

  // Search transactions
  searchTransactions: async (query: string): Promise<WalletTransaction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const searchTerm = query.toLowerCase();
    return mockWalletTransactions.filter(
      (txn) =>
        txn.description.toLowerCase().includes(searchTerm) ||
        txn.customer_name?.toLowerCase().includes(searchTerm) ||
        txn.order_id?.toLowerCase().includes(searchTerm)
    );
  },

  // Filter transactions by date range
  getTransactionsByDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<WalletTransaction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const start = new Date(startDate);
    const end = new Date(endDate);

    return mockWalletTransactions.filter((txn) => {
      const txnDate = new Date(txn.created_at);
      return txnDate >= start && txnDate <= end;
    });
  },
};
