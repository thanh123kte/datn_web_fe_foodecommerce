// Enums based on database schema
export enum RoleType {
  ADMIN = "ADMIN",
  SELLER = "SELLER",
  CUSTOMER = "CUSTOMER",
}

export enum StoreStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
  MAINTENANCE = "MAINTENANCE",
}

export enum OpenStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum VerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// Core User interface
export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles: Role[];
}

// Role interface
export interface Role {
  id: number;
  name: RoleType;
  description?: string;
}

// Address interface
export interface Address {
  id: number;
  user_id: number;
  receiver: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Store interface for sellers
export interface Store {
  id: number;
  owner_id: number;
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

// Seller interface (User with Store)
export interface Seller extends User {
  store?: Store;
}

// User Statistics interface
export interface UserStats {
  total_users: number;
  active_users: number;
  total_sellers: number;
  pending_sellers: number;
  active_sellers: number;
  banned_sellers: number;
  new_users_this_month: number;
  new_sellers_this_month: number;
}

// Filter and Search interfaces
export interface UserFilters {
  role?: RoleType;
  is_active?: boolean;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface SellerFilters {
  store_status?: StoreStatus;
  open_status?: OpenStatus;
  search?: string;
  verification_status?: VerificationStatus;
  date_from?: string;
  date_to?: string;
}

// Pagination interface
export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// API Response interfaces
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface SellerListResponse {
  sellers: Seller[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
