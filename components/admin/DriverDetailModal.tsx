"use client";

import { useState, useEffect } from "react";
import { Driver, VerificationStatus, DriverDocument } from "@/types/driver";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { resolveAvatarUrl, resolveMediaUrl } from "@/lib/utils/imageUtils";

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
  const [rejectionReason, setRejectionReason] = useState("");

  // Debug: Log driver data
  useEffect(() => {
    if (driver) {
      console.log("Driver data:", driver);
      console.log("Image URLs:", {
        cccd_front: driver.cccd_front_image_url,
        cccd_back: driver.cccd_back_image_url,
        license: driver.license_image_url,
        vehicle_plate: driver.vehicle_plate_image_url,
        vehicle_registration: driver.vehicle_registration_image_url,
      });
    }
  }, [driver]);

  if (!isOpen || !driver) return null;

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

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={resolveAvatarUrl(driver.avatar_url, driver.full_name)}
                alt={driver.full_name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{driver.full_name}</h2>
                <p className="text-gray-600">Mã tài xế: #{driver.id}</p>
                <p className="text-gray-600">📞 {driver.phone}</p>
              </div>
            </div>
            <div className="space-y-1">
              <Badge
                className={getVerificationBadgeColor(
                  driver.verification_status
                )}
              >
                {driver.verification_status === VerificationStatus.PENDING
                  ? "Chờ xác minh"
                  : driver.verification_status === VerificationStatus.APPROVED
                  ? "Đã xác minh"
                  : "Đã từ chối"}
              </Badge>
              <Badge
                className={
                  driver.verified
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {driver.verified ? "Hoạt động" : "Không hoạt động"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {driver.verification_status === VerificationStatus.PENDING && (
              <>
                <Button
                  onClick={() => onVerificationAction?.(driver.id, "approve")}
                >
                  Phê duyệt
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (
                      rejectionReason ||
                      confirm(
                        "Bạn có chắc chắn muốn từ chối mà không có lý do?"
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
                  Từ chối
                </Button>
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
            <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Họ và tên</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded">
                  {driver.full_name}
                </p>
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded">{driver.phone}</p>
              </div>
              <div>
                <Label htmlFor="cccd_number">Số CCCD</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded">
                  {driver.cccd_number}
                </p>
              </div>
              <div>
                <Label htmlFor="license_number">Số bằng lái</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded">
                  {driver.license_number}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Thông tin phương tiện
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle_type">Loại phương tiện</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded">
                  {driver.vehicle_type}
                </p>
              </div>
              <div>
                <Label htmlFor="vehicle_plate">Biển số xe</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded">
                  {driver.vehicle_plate}
                </p>
              </div>
            </div>
          </div>

          {/* Driver Document Images */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hình ảnh giấy tờ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* CCCD Front */}
            {driver.cccd_front_image_url && (
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">CCCD - Mặt trước</span>
                  </div>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={resolveMediaUrl(driver.cccd_front_image_url)}
                      alt="CCCD mặt trước"
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() =>
                        window.open(
                          resolveMediaUrl(driver.cccd_front_image_url),
                          "_blank"
                        )
                      }
                    />
                  </div>
                </div>
              </Card>
            )}

              {/* CCCD Back */}
              {driver.cccd_back_image_url && (
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">CCCD - Mặt sau</span>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={resolveMediaUrl(driver.cccd_back_image_url)}
                        alt="CCCD mặt sau"
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() =>
                          window.open(
                            resolveMediaUrl(driver.cccd_back_image_url),
                            "_blank"
                          )
                        }
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* License */}
              {driver.license_image_url && (
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Bằng lái xe</span>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={resolveMediaUrl(driver.license_image_url)}
                        alt="Bằng lái xe"
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() =>
                          window.open(
                            resolveMediaUrl(driver.license_image_url),
                            "_blank"
                          )
                        }
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* Vehicle Plate */}
              {driver.vehicle_plate_image_url && (
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Biển số xe</span>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={resolveMediaUrl(driver.vehicle_plate_image_url)}
                        alt="Biển số xe"
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() =>
                          window.open(
                            resolveMediaUrl(driver.vehicle_plate_image_url),
                            "_blank"
                          )
                        }
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* Vehicle Registration */}
              {driver.vehicle_registration_image_url && (
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Đăng ký xe</span>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={resolveMediaUrl(
                          driver.vehicle_registration_image_url
                        )}
                        alt="Đăng ký xe"
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() =>
                          window.open(
                            resolveMediaUrl(
                              driver.vehicle_registration_image_url
                            ),
                            "_blank"
                          )
                        }
                      />
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Trạng thái xác minh</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Trạng thái hiện tại</Label>
                <div className="mt-1 space-y-2">
                  <Badge
                    className={getVerificationBadgeColor(
                      driver.verification_status
                    )}
                  >
                    {driver.verification_status === VerificationStatus.PENDING
                      ? "Chờ xác minh"
                      : driver.verification_status ===
                        VerificationStatus.APPROVED
                      ? "Đã xác minh"
                      : "Đã từ chối"}
                  </Badge>
                  <Badge
                    className={
                      driver.verified
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {driver.verified ? "Đang hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>
              </div>
              {driver.verification_status === VerificationStatus.PENDING && (
                <div>
                  <Label htmlFor="rejection_reason">
                    Lý do từ chối (Tùy chọn)
                  </Label>
                  <textarea
                    id="rejection_reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Nhập lý do từ chối nếu có..."
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
              <h3 className="text-lg font-semibold mb-4">Giấy tờ đã nộp</h3>
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
                          {doc.verified ? "Đã xác minh" : "Chờ xác minh"}
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
                        Đã tải lên: {formatDate(doc.created_at)}
                      </p>
                      {doc.verified && doc.verified_at && (
                        <p className="text-xs text-green-600">
                          ✅ Xác minh: {formatDate(doc.verified_at)}
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
            <h3 className="text-lg font-semibold mb-4">Thông tin tài khoản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Ngày tạo</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded">
                  {formatDate(driver.created_at)}
                </p>
              </div>
              <div>
                <Label>Cập nhật lần cuối</Label>
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
