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

// Mock data - replace with real API calls
const mockStats: DriverStatsType = {
  total_drivers: 1247,
  verified_drivers: 892,
  pending_verification: 156,
  rejected_drivers: 23,
  new_drivers_this_month: 45,
  active_drivers: 869,
  inactive_drivers: 23,
};

const mockDrivers: Driver[] = [
  {
    id: 1,
    full_name: "Nguyen Van Duc",
    phone: "+84901234567",
    avatar_url: "",
    vehicle_type: "Honda Wave trắng",
    vehicle_plate: "59H1-12345",
    cccd_number: "025987654321",
    license_number: "B1-123456",
    verified: true,
    verification_status: VerificationStatus.APPROVED,
    created_at: "2024-10-15T08:30:00Z",
    updated_at: "2024-11-20T14:45:00Z",
  },
  {
    id: 2,
    full_name: "Tran Thi Mai",
    phone: "+84907654321",
    avatar_url: "",
    vehicle_type: "Xe đạp điện Yamaha",
    vehicle_plate: "N/A",
    cccd_number: "025123456789",
    license_number: "N/A",
    verified: false,
    verification_status: VerificationStatus.PENDING,
    created_at: "2024-11-25T10:15:00Z",
    updated_at: "2024-11-25T10:15:00Z",
  },
  {
    id: 3,
    full_name: "Le Van Son",
    phone: "+84909876543",
    avatar_url: "",
    vehicle_type: "Honda SH 150 đen",
    vehicle_plate: "29X1-98765",
    cccd_number: "025456789123",
    license_number: "A1-987654",
    verified: true,
    verification_status: VerificationStatus.APPROVED,
    created_at: "2024-09-20T14:22:00Z",
    updated_at: "2024-11-28T09:30:00Z",
  },
  {
    id: 4,
    full_name: "Pham Minh Khai",
    phone: "+84908765432",
    avatar_url: "",
    vehicle_type: "Yamaha Sirius xám",
    vehicle_plate: "43B1-55667",
    cccd_number: "025789123456",
    license_number: "B2-345678",
    verified: false,
    verification_status: VerificationStatus.REJECTED,
    created_at: "2024-11-10T16:45:00Z",
    updated_at: "2024-11-22T11:20:00Z",
  },
];

const mockDocuments: DriverDocument[] = [
  {
    id: 1,
    driver_id: 2,
    document_type: "cccd",
    document_url: "/placeholder-cccd.jpg",
    verified: false,
    created_at: "2024-11-25T10:20:00Z",
  },
  {
    id: 2,
    driver_id: 2,
    document_type: "avatar",
    document_url: "/placeholder-avatar.jpg",
    verified: true,
    verified_at: "2024-11-25T12:00:00Z",
    verified_by: 1,
    created_at: "2024-11-25T10:25:00Z",
  },
];

export default function DriversPage() {
  const [activeTab, setActiveTab] = useState<"drivers" | "verification">(
    "drivers"
  );
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [stats, setStats] = useState<DriverStatsType>(mockStats);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [driverFilters, setDriverFilters] = useState<DriverFilters>({});

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
    setDrivers((prevDrivers) =>
      prevDrivers.map((driver) => {
        if (driver.id === driverId) {
          return {
            ...driver,
            verification_status:
              action === "approve"
                ? VerificationStatus.APPROVED
                : VerificationStatus.REJECTED,
            verified: action === "approve",
          };
        }
        return driver;
      })
    );

    // Update stats
    setStats((prevStats) => {
      if (action === "approve") {
        return {
          ...prevStats,
          verified_drivers: prevStats.verified_drivers + 1,
          pending_verification: prevStats.pending_verification - 1,
        };
      } else {
        return {
          ...prevStats,
          rejected_drivers: prevStats.rejected_drivers + 1,
          pending_verification: prevStats.pending_verification - 1,
        };
      }
    });

    // TODO: Call API to update verification status
    console.log(
      `Driver ${driverId} ${action}ed${reason ? ` with reason: ${reason}` : ""}`
    );
  };

  const handleDriverSave = async (updatedDriver: Driver) => {
    setDrivers((prevDrivers) =>
      prevDrivers.map((driver) =>
        driver.id === updatedDriver.id ? updatedDriver : driver
      )
    );
    // TODO: Call API to save driver changes
    console.log("Driver updated:", updatedDriver);
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

  const getDriverDocuments = (driverId: number): DriverDocument[] => {
    return mockDocuments.filter((doc) => doc.driver_id === driverId);
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

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Rejected Drivers (
                  {
                    drivers.filter(
                      (d) =>
                        d.verification_status === VerificationStatus.REJECTED
                    ).length
                  }
                  )
                </h3>
                <DriverTable
                  drivers={drivers.filter(
                    (d) => d.verification_status === VerificationStatus.REJECTED
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
        documents={selectedDriver ? getDriverDocuments(selectedDriver.id) : []}
      />
    </div>
  );
}
