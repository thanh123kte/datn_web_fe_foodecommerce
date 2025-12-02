"use client";

import { useState, useEffect } from "react";
import { Driver, VerificationStatus, DriverDocument } from "@/types/driver";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface DriverDetailModalProps {
  driver: Driver | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (driver: Driver) => void;
  onVerificationAction?: (
    driverId: number,
    action: "approve" | "reject",
    reason?: string
  ) => void;
  documents?: DriverDocument[];
}

export function DriverDetailModal({
  driver,
  isOpen,
  onClose,
  onSave,
  onVerificationAction,
  documents = [],
}: DriverDetailModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Driver>>({});
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (driver) {
      setFormData({
        full_name: driver.full_name,
        phone: driver.phone,
        vehicle_type: driver.vehicle_type,
        vehicle_plate: driver.vehicle_plate,
        cccd_number: driver.cccd_number,
        license_number: driver.license_number,
      });
    }
  }, [driver]);

  if (!isOpen || !driver) return null;

  const handleSave = () => {
    if (onSave) {
      onSave({ ...driver, ...formData } as Driver);
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      full_name: driver.full_name,
      phone: driver.phone,
      vehicle_type: driver.vehicle_type,
      vehicle_plate: driver.vehicle_plate,
      cccd_number: driver.cccd_number,
      license_number: driver.license_number,
    });
    setEditMode(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVerificationBadgeColor = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case VerificationStatus.APPROVED:
        return "bg-green-100 text-green-800";
      case VerificationStatus.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVehicleIcon = (vehicleDescription: string) => {
    const description = vehicleDescription.toLowerCase();
    if (
      description.includes("wave") ||
      description.includes("xe máy") ||
      description.includes("motor")
    ) {
      return "🏍️";
    }
    if (description.includes("xe đạp") || description.includes("bicycle")) {
      return "🚴";
    }
    if (description.includes("ô tô") || description.includes("car")) {
      return "🚗";
    }
    if (
      description.includes("xe tay ga") ||
      description.includes("scooter") ||
      description.includes("sh") ||
      description.includes("lead")
    ) {
      return "🛵";
    }
    return "🚚";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {driver.avatar_url ? (
                <img
                  src={driver.avatar_url}
                  alt={driver.full_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-medium">
                  {driver.full_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{driver.full_name}</h2>
                <p className="text-gray-600">Driver ID: #{driver.id}</p>
                <p className="text-gray-600">📞 {driver.phone}</p>
              </div>
            </div>
            <div className="space-y-1">
              <Badge
                className={getVerificationBadgeColor(
                  driver.verification_status
                )}
              >
                {driver.verification_status}
              </Badge>
              <Badge
                className={
                  driver.verified
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {driver.verified ? "Verified" : "Not Verified"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
                {driver.verification_status === VerificationStatus.PENDING && (
                  <>
                    <Button
                      onClick={() =>
                        onVerificationAction?.(driver.id, "approve")
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (
                          rejectionReason ||
                          confirm(
                            "Are you sure you want to reject without reason?"
                          )
                        ) {
                          onVerificationAction?.(
                            driver.id,
                            "reject",
                            rejectionReason
                          );
                        }
                      }}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Reject
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            )}
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                {editMode ? (
                  <Input
                    id="full_name"
                    value={formData.full_name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">
                    {driver.full_name}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {editMode ? (
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">{driver.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cccd_number">CCCD Number</Label>
                {editMode ? (
                  <Input
                    id="cccd_number"
                    value={formData.cccd_number || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, cccd_number: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">
                    {driver.cccd_number}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="license_number">License Number</Label>
                {editMode ? (
                  <Input
                    id="license_number"
                    value={formData.license_number || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        license_number: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">
                    {driver.license_number}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle_type">Vehicle Description</Label>
                {editMode ? (
                  <Input
                    id="vehicle_type"
                    value={formData.vehicle_type || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicle_type: e.target.value })
                    }
                    placeholder="e.g., Wave trắng, Airblack đen, Honda SH 150"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded flex items-center gap-2">
                    <span>{getVehicleIcon(driver.vehicle_type)}</span>
                    <span>{driver.vehicle_type}</span>
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="vehicle_plate">Vehicle Plate</Label>
                {editMode ? (
                  <Input
                    id="vehicle_plate"
                    value={formData.vehicle_plate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicle_plate: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">
                    {driver.vehicle_plate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Current Status</Label>
                <div className="mt-1 space-y-2">
                  <Badge
                    className={getVerificationBadgeColor(
                      driver.verification_status
                    )}
                  >
                    {driver.verification_status}
                  </Badge>
                  <Badge
                    className={
                      driver.verified
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {driver.verified
                      ? "Documents Verified"
                      : "Documents Not Verified"}
                  </Badge>
                </div>
              </div>
              {driver.verification_status === VerificationStatus.PENDING && (
                <div>
                  <Label htmlFor="rejection_reason">
                    Rejection Reason (Optional)
                  </Label>
                  <textarea
                    id="rejection_reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection if applicable..."
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          {documents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Submitted Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <Card key={doc.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">
                          {doc.document_type.replace("_", " ")}
                        </span>
                        <Badge
                          className={
                            doc.verified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {doc.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={doc.document_url}
                          alt={`${doc.document_type} document`}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() =>
                            window.open(doc.document_url, "_blank")
                          }
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Uploaded: {formatDate(doc.created_at)}
                      </p>
                      {doc.verified && doc.verified_at && (
                        <p className="text-xs text-green-600">
                          ✅ Verified: {formatDate(doc.verified_at)}
                        </p>
                      )}
                      {doc.rejection_reason && (
                        <p className="text-xs text-red-600">
                          ❌ {doc.rejection_reason}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Account Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Created At</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded">
                  {formatDate(driver.created_at)}
                </p>
              </div>
              <div>
                <Label>Last Updated</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded">
                  {formatDate(driver.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
