// lib/services/walletService.ts
import axiosInstance from "@/lib/api/axiosConfig";

export interface WalletResponseDto {
  id: number;
  userId: string;
  balance: string;
  totalDeposited: string;
  totalWithdrawn: string;
  totalEarned: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransactionResponseDto {
  id: number;
  walletId: number;
  userId: string;
  transactionType: TransactionType;
  status: TransactionStatus;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  description: string;
  referenceId: string | null;
  referenceType: string | null;
  createdAt: string;
}

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  EARN = "EARN",
  REFUND = "REFUND",
  PAYMENT = "PAYMENT",
  RECEIVE = "RECEIVE",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUCCESSFUL = "SUCCESSFUL",
  REJECTED = "REJECTED",
}

export interface DepositRequest {
  amount: string | number;
  description?: string;
}

export interface WithdrawalRequest {
  amount: string | number;
  bankAccount?: string;
  description?: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

class WalletService {
  private readonly basePath = "/api/wallets";

  /**
   * Get wallet info for a user
   * GET /api/wallets/{userId}
   */
  async getWallet(userId: string): Promise<WalletResponseDto> {
    const response = await axiosInstance.get(`${this.basePath}/${userId}`);
    return response.data;
  }

  /**
   * Initialize a new wallet for a user
   * POST /api/wallets/{userId}/initialize
   */
  async initializeWallet(userId: string): Promise<WalletResponseDto> {
    const response = await axiosInstance.post(
      `${this.basePath}/${userId}/initialize`
    );
    return response.data;
  }

  /**
   * Deposit money to wallet
   * POST /api/wallets/{userId}/deposit
   */
  async deposit(
    userId: string,
    request: DepositRequest
  ): Promise<WalletTransactionResponseDto> {
    const response = await axiosInstance.post(
      `${this.basePath}/${userId}/deposit`,
      {
        ...request,
        amount: String(request.amount),
      }
    );
    return response.data;
  }

  /**
   * Withdraw money from wallet
   * POST /api/wallets/{userId}/withdraw
   */
  async withdraw(
    userId: string,
    request: WithdrawalRequest
  ): Promise<WalletResponseDto> {
    const response = await axiosInstance.post(
      `${this.basePath}/${userId}/withdraw`,
      {
        ...request,
        amount: String(request.amount),
      }
    );
    return response.data;
  }

  /**
   * Get all transactions for a wallet with optional filtering
   * GET /api/wallets/{userId}/transactions
   */
  async getTransactions(
    userId: string,
    filters?: TransactionFilters
  ): Promise<PageResponse<WalletTransactionResponseDto>> {
    const params: Record<string, string | number> = {
      page: filters?.page ?? 0,
      size: filters?.size ?? 20,
    };

    if (filters?.type) {
      params.type = filters.type;
    }

    const response = await axiosInstance.get(
      `${this.basePath}/${userId}/transactions`,
      { params }
    );
    return response.data;
  }

  /**
   * Get transactions by type
   * GET /api/wallets/{userId}/transactions/type/{type}
   */
  async getTransactionsByType(
    userId: string,
    type: TransactionType,
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<WalletTransactionResponseDto>> {
    const response = await axiosInstance.get(
      `${this.basePath}/${userId}/transactions/type/${type}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  }

  /**
   * Admin approve withdrawal request
   * POST /api/wallets/admin/withdrawals/{transactionId}/approve
   */
  async approveWithdrawal(
    transactionId: number
  ): Promise<WalletTransactionResponseDto> {
    const response = await axiosInstance.post(
      `${this.basePath}/admin/withdrawals/${transactionId}/approve`
    );
    return response.data;
  }

  /**
   * Admin reject withdrawal request
   * POST /api/wallets/admin/withdrawals/{transactionId}/reject
   */
  async rejectWithdrawal(
    transactionId: number,
    reason: string
  ): Promise<WalletTransactionResponseDto> {
    const response = await axiosInstance.post(
      `${this.basePath}/admin/withdrawals/${transactionId}/reject`,
      null,
      {
        params: { reason },
      }
    );
    return response.data;
  }

  /**
   * Get all withdrawal requests by status (for admin)
   * GET /api/wallets/admin/withdrawals/status?status=PENDING&page=0&size=20
   */
  async getWithdrawalsByStatus(
    status: TransactionStatus,
    page?: number,
    size?: number
  ): Promise<
    PageResponse<WalletTransactionResponseDto> | WalletTransactionResponseDto[]
  > {
    const params: Record<string, string | number> = {
      status: status,
    };

    if (page !== undefined && size !== undefined) {
      params.page = page;
      params.size = size;
    }

    const response = await axiosInstance.get(
      `${this.basePath}/admin/withdrawals/status`,
      { params }
    );
    return response.data;
  }

  /**
   * Get all pending withdrawal requests (for admin)
   * Convenience method that calls getWithdrawalsByStatus with PENDING status
   */
  async getPendingWithdrawals(
    page: number = 0,
    size: number = 20
  ): Promise<WalletTransactionResponseDto[]> {
    const result = await this.getWithdrawalsByStatus(
      TransactionStatus.PENDING,
      page,
      size
    );

    // If paginated response, return content
    if (result && typeof result === "object" && "content" in result) {
      return result.content;
    }

    // Otherwise return the array directly
    return Array.isArray(result) ? result : [];
  }
}

export const walletService = new WalletService();
export default walletService;
