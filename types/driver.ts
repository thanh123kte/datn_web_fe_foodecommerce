// Driver related enums from database schema
export enum VerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// Driver interface
export interface Driver {
  id: number;
  full_name: string;
  phone: string;
  avatar_url?: string;
  vehicle_type: string;
  vehicle_plate: string;
  cccd_number: string;
  license_number: string;
  verified: boolean;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

// Driver statistics interface
export interface DriverStats {
  total_drivers: number;
  verified_drivers: number;
  pending_verification: number;
  rejected_drivers: number;
  new_drivers_this_month: number;
  active_drivers: number;
  inactive_drivers: number;
}

// Driver performance metrics
export interface DriverPerformance {
  driver_id: number;
  total_deliveries: number;
  completed_deliveries: number;
  cancelled_deliveries: number;
  average_rating: number;
  total_distance: number;
  average_delivery_time: number;
  completion_rate: number;
  on_time_rate: number;
}

// Driver filters interface
export interface DriverFilters {
  verification_status?: VerificationStatus;
  verified?: boolean;
  search?: string;
  date_from?: string;
  date_to?: string;
}

// Driver verification documents
export interface DriverDocument {
  id: number;
  driver_id: number;
  document_type: "cccd" | "license" | "vehicle_registration" | "avatar";
  document_url: string;
  verified: boolean;
  verified_at?: string;
  verified_by?: number;
  rejection_reason?: string;
  created_at: string;
}

// Pagination interface (reuse from user types if exists)
export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// API Response interfaces
export interface DriverListResponse {
  drivers: Driver[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Driver verification request
export interface DriverVerificationRequest {
  driver_id: number;
  action: "approve" | "reject";
  rejection_reason?: string;
  verified_documents?: string[];
}
