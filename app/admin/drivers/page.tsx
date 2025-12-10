"use client";

import { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { DriverTable } from "@/components/admin/DriverTable";
import { DriverDetailModal } from "@/components/admin/DriverDetailModal";
import { DriverStats } from "@/components/admin/DriverStats";
import {
  Driver,
  DriverStats as DriverStatsType,
  DriverFilters,
  VerificationStatus,
  DriverDocument,
} from "@/types/driver";
import { driverService } from "@/lib/services/driverService";

export default function DriversPage() {
  const [activeTab, setActiveTab] = useState<"drivers" | "verification">(
    "drivers"
  );
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState<DriverStatsType>({
    total_drivers: 0,
    verified_drivers: 0,
    pending_verification: 0,
    rejected_drivers: 0,
    new_drivers_this_month: 0,
    active_drivers: 0,
    inactive_drivers: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filter states
  const [driverFilters, setDriverFilters] = useState<DriverFilters>({});

  // Fetch drivers and stats on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [driversData, statsData] = await Promise.all([
          driverService.getAllDrivers(),
          driverService.getDriverStats(),
        ]);
        setDrivers(driversData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch drivers data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle driver actions
  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDriverModal(true);
  };

  const handleVerificationAction = async (
    driverId: number,
    action: "approve" | "reject",
    reason?: string
  ) => {
    try {
      const status =
        action === "approve"
          ? VerificationStatus.APPROVED
          : VerificationStatus.REJECTED;

      // Call API to update verification status
      const updatedDriver = await driverService.updateVerificationStatus(
        driverId,
        status
      );

      // Update local state
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver.id === driverId ? updatedDriver : driver
        )
      );

      // Refresh stats
      const updatedStats = await driverService.getDriverStats();
      setStats(updatedStats);

      console.log(
        `Driver ${driverId} ${action}ed${
          reason ? ` with reason: ${reason}` : ""
        }`
      );
    } catch (error) {
      console.error("Failed to update verification status:", error);
      alert("Không thể cập nhật trạng thái xác minh. Vui lòng thử lại.");
    }
  };

  const handleDriverSave = async (updatedDriver: Driver) => {
    try {
      // Call API to update driver
      const updated = await driverService.updateDriver(updatedDriver.id, {
        fullName: updatedDriver.full_name,
        phone: updatedDriver.phone,
        avatarUrl: updatedDriver.avatar_url,
        vehicleType: updatedDriver.vehicle_type,
        vehiclePlate: updatedDriver.vehicle_plate,
        cccdNumber: updatedDriver.cccd_number,
        licenseNumber: updatedDriver.license_number,
      });

      // Update local state
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver.id === updated.id ? updated : driver
        )
      );

      console.log("Driver updated:", updated);
    } catch (error) {
      console.error("Failed to update driver:", error);
      alert("Không thể cập nhật thông tin tài xế. Vui lòng thử lại.");
    }
  };

  // Filter functions
  const filteredDrivers = drivers.filter((driver) => {
    if (
      driverFilters.verification_status &&
      driver.verification_status !== driverFilters.verification_status
    ) {
      return false;
    }
    if (
      driverFilters.verified !== undefined &&
      driver.verified !== driverFilters.verified
    ) {
      return false;
    }
    if (driverFilters.search) {
      const searchLower = driverFilters.search.toLowerCase();
      return (
        driver.full_name.toLowerCase().includes(searchLower) ||
        driver.phone.toLowerCase().includes(searchLower) ||
        driver.license_number.toLowerCase().includes(searchLower) ||
        driver.vehicle_type.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getDriverDocuments = (): DriverDocument[] => {
    // TODO: Implement document fetching from API if needed
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Driver Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage drivers, verifications, and deliveries
          </p>
        </div>
      </div>

      {/* Stats Overview - Always visible */}
      <DriverStats stats={stats} loading={loading} />

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "drivers" | "verification")
        }
      >
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("verification")}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "verification"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending Verification (
            {
              drivers.filter(
                (d) => d.verification_status === VerificationStatus.PENDING
              ).length
            }
            )
          </button>
          <button
            onClick={() => setActiveTab("drivers")}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "drivers"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All Drivers ({filteredDrivers.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "drivers" && (
            <DriverTable
              drivers={filteredDrivers}
              loading={loading}
              onDriverClick={handleDriverClick}
              onVerificationAction={handleVerificationAction}
              onFilterChange={setDriverFilters}
            />
          )}

          {activeTab === "verification" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Pending Verification (
                  {
                    drivers.filter(
                      (d) =>
                        d.verification_status === VerificationStatus.PENDING
                    ).length
                  }
                  )
                </h3>
                <DriverTable
                  drivers={drivers.filter(
                    (d) => d.verification_status === VerificationStatus.PENDING
                  )}
                  loading={loading}
                  onDriverClick={handleDriverClick}
                  onVerificationAction={handleVerificationAction}
                  showFilters={false}
                />
              </div>
            </div>
          )}
        </div>
      </Tabs>

      {/* Driver Detail Modal */}
      <DriverDetailModal
        driver={selectedDriver}
        isOpen={showDriverModal}
        onClose={() => {
          setShowDriverModal(false);
          setSelectedDriver(null);
        }}
        onSave={handleDriverSave}
        onVerificationAction={handleVerificationAction}
        documents={getDriverDocuments()}
      />
    </div>
  );
}
