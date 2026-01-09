// lib/services/driverService.ts
import axiosInstance from "@/lib/api/axiosConfig";
import { Driver, DriverStats, VerificationStatus } from "@/types/driver";

export interface CreateDriverDto {
  fullName: string;
  phone: string;
  avatarUrl?: string;
  vehicleType: string;
  vehiclePlate: string;
  cccdNumber: string;
  licenseNumber: string;
}

export interface UpdateDriverDto {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  cccdNumber?: string;
  licenseNumber?: string;
}

export interface DriverResponse {
  id: number;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  vehicleType: string;
  vehiclePlate: string;
  vehiclePlateImageUrl?: string;
  vehicleRegistrationImageUrl?: string;
  cccdNumber: string;
  cccdFrontImageUrl?: string;
  cccdBackImageUrl?: string;
  licenseNumber: string;
  licenseImageUrl?: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

class DriverService {
  private readonly basePath = "/api/drivers";

  // Convert backend response to frontend Driver type
  private mapToDriver(response: DriverResponse): Driver {
    return {
      id: response.id,
      full_name: response.fullName,
      phone: response.phone,
      avatar_url: response.avatarUrl,
      vehicle_type: response.vehicleType,
      vehicle_plate: response.vehiclePlate,
      vehicle_plate_image_url: response.vehiclePlateImageUrl,
      vehicle_registration_image_url: response.vehicleRegistrationImageUrl,
      cccd_number: response.cccdNumber,
      cccd_front_image_url: response.cccdFrontImageUrl,
      cccd_back_image_url: response.cccdBackImageUrl,
      license_number: response.licenseNumber,
      license_image_url: response.licenseImageUrl,
      verified: response.verified,
      verification_status: response.verificationStatus,
      created_at: response.createdAt,
      updated_at: response.updatedAt,
    };
  }

  // Get all drivers
  async getAllDrivers(): Promise<Driver[]> {
    const response = await axiosInstance.get<DriverResponse[]>(this.basePath);
    return response.data.map((driver) => this.mapToDriver(driver));
  }

  // Get driver by ID
  async getDriverById(id: number): Promise<Driver> {
    const response = await axiosInstance.get<DriverResponse>(
      `${this.basePath}/${id}`
    );
    return this.mapToDriver(response.data);
  }

  // Get driver by phone
  async getDriverByPhone(phone: string): Promise<Driver> {
    const response = await axiosInstance.get<DriverResponse>(
      `${this.basePath}/phone/${phone}`
    );
    return this.mapToDriver(response.data);
  }

  // Create driver
  async createDriver(dto: CreateDriverDto): Promise<Driver> {
    const response = await axiosInstance.post<DriverResponse>(
      this.basePath,
      dto
    );
    return this.mapToDriver(response.data);
  }

  // Update driver
  async updateDriver(id: number, dto: UpdateDriverDto): Promise<Driver> {
    const response = await axiosInstance.put<DriverResponse>(
      `${this.basePath}/${id}`,
      dto
    );
    return this.mapToDriver(response.data);
  }

  // Delete driver
  async deleteDriver(id: number): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${id}`);
  }

  // Get drivers by verification status
  async getDriversByVerificationStatus(
    status: VerificationStatus
  ): Promise<Driver[]> {
    const response = await axiosInstance.get<DriverResponse[]>(
      `${this.basePath}/verification-status/${status}`
    );
    return response.data.map((driver) => this.mapToDriver(driver));
  }

  // Get verified drivers
  async getVerifiedDrivers(verified: boolean): Promise<Driver[]> {
    const response = await axiosInstance.get<DriverResponse[]>(
      `${this.basePath}/verified/${verified}`
    );
    return response.data.map((driver) => this.mapToDriver(driver));
  }

  // Search drivers by name
  async searchDriversByName(name: string): Promise<Driver[]> {
    const response = await axiosInstance.get<DriverResponse[]>(
      `${this.basePath}/search/name`,
      { params: { q: name } }
    );
    return response.data.map((driver) => this.mapToDriver(driver));
  }

  // Search drivers by phone
  async searchDriversByPhone(phone: string): Promise<Driver[]> {
    const response = await axiosInstance.get<DriverResponse[]>(
      `${this.basePath}/search/phone`,
      { params: { q: phone } }
    );
    return response.data.map((driver) => this.mapToDriver(driver));
  }

  // Get drivers by vehicle type
  async getDriversByVehicleType(vehicleType: string): Promise<Driver[]> {
    const response = await axiosInstance.get<DriverResponse[]>(
      `${this.basePath}/vehicle-type/${vehicleType}`
    );
    return response.data.map((driver) => this.mapToDriver(driver));
  }

  // Update verification status
  async updateVerificationStatus(
    id: number,
    status: VerificationStatus
  ): Promise<Driver> {
    const response = await axiosInstance.put<DriverResponse>(
      `${this.basePath}/${id}/verification-status/${status}`
    );
    return this.mapToDriver(response.data);
  }

  // Verify driver
  async verifyDriver(id: number, verified: boolean): Promise<Driver> {
    const response = await axiosInstance.put<DriverResponse>(
      `${this.basePath}/${id}/verify/${verified}`
    );
    return this.mapToDriver(response.data);
  }

  // Get driver statistics
  async getDriverStats(): Promise<DriverStats> {
    try {
      const allDrivers = await this.getAllDrivers();

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats: DriverStats = {
        total_drivers: allDrivers.length,
        verified_drivers: allDrivers.filter((d) => d.verified).length,
        pending_verification: allDrivers.filter(
          (d) => d.verification_status === VerificationStatus.PENDING
        ).length,
        rejected_drivers: allDrivers.filter(
          (d) => d.verification_status === VerificationStatus.REJECTED
        ).length,
        new_drivers_this_month: allDrivers.filter(
          (d) => new Date(d.created_at) >= firstDayOfMonth
        ).length,
        active_drivers: allDrivers.filter(
          (d) =>
            d.verified && d.verification_status === VerificationStatus.APPROVED
        ).length,
        inactive_drivers: allDrivers.filter((d) => !d.verified).length,
      };

      return stats;
    } catch (error) {
      console.error("Failed to calculate driver stats:", error);
      return {
        total_drivers: 0,
        verified_drivers: 0,
        pending_verification: 0,
        rejected_drivers: 0,
        new_drivers_this_month: 0,
        active_drivers: 0,
        inactive_drivers: 0,
      };
    }
  }

  // Get pending drivers count
  async getPendingDriversCount(): Promise<number> {
    try {
      const pendingDrivers = await this.getDriversByVerificationStatus(
        VerificationStatus.PENDING
      );
      return pendingDrivers.length;
    } catch (error) {
      console.error("Failed to get pending drivers count:", error);
      return 0;
    }
  }
}

export const driverService = new DriverService();
export default driverService;
