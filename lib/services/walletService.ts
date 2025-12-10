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
  ): Promise<WalletTransactionResponseDto> {
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
}

export const walletService = new WalletService();
export default walletService;
