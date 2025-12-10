"use client";

import { useState, useEffect } from "react";
import { User, RoleType, Address } from "@/types/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (user: User) => void;
  onStatusChange?: (userId: number, isActive: boolean) => void;
  addresses?: Address[];
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
  onSave,
  onStatusChange,
  addresses = [],
}: UserDetailModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        date_of_birth: user.date_of_birth || "",
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = () => {
    if (onSave) {
      onSave({ ...user, ...formData } as User);
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || "",
      gender: user.gender || "",
      date_of_birth: user.date_of_birth || "",
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

  const getRoleBadgeColor = (role: RoleType) => {
    switch (role) {
      case RoleType.ADMIN:
        return "bg-red-100 text-red-800";
      case RoleType.SELLER:
        return "bg-blue-100 text-blue-800";
      case RoleType.CUSTOMER:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-medium">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{user.full_name}</h2>
                <p className="text-gray-600">ID người dùng: #{user.id}</p>
              </div>
            </div>
            <Badge
              className={`${
                user.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.is_active ? "Hoạt động" : "Không hoạt động"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {!editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(true)}>
                  Chỉnh sửa
                </Button>
                <Button
                  variant={user.is_active ? "outline" : "default"}
                  onClick={() => onStatusChange?.(user.id, !user.is_active)}
                >
                  {user.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Hủy
                </Button>
                <Button onClick={handleSave}>Lưu thay đổi</Button>
              </>
            )}
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Họ tên</Label>
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
                    {user.full_name}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                {editMode ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">{user.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                {editMode ? (
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">
                    {user.phone || "N/A"}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                {editMode ? (
                  <select
                    id="gender"
                    value={formData.gender || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">
                    {user.gender || "N/A"}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="date_of_birth">Ngày sinh</Label>
                {editMode ? (
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">
                    {user.date_of_birth
                      ? new Date(user.date_of_birth).toLocaleDateString()
                      : "N/A"}
                  </p>
                )}
              </div>
              <div>
                <Label>Trạng thái tài khoản</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded">
                  {user.is_active ? "Hoạt động" : "Không hoạt động"}
                </p>
              </div>
            </div>
          </div>

          {/* Roles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Vai trò</h3>
            <div className="flex flex-wrap gap-2">
              {user.roles.map((role) => (
                <Badge key={role.id} className={getRoleBadgeColor(role.name)}>
                  {role.name}
                  {role.description && (
                    <span className="ml-2 text-xs opacity-75">
                      - {role.description}
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Addresses */}
          {addresses.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Địa chỉ</h3>
              <div className="space-y-3">
                {addresses.map((address) => (
                  <Card key={address.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">
                            {address.receiver}
                          </span>
                          <span className="text-gray-600">{address.phone}</span>
                          {address.is_default && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              Mặc định
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-700">{address.address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Đã thêm: {formatDate(address.created_at)}
                        </p>
                      </div>
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
                  {formatDate(user.created_at)}
                </p>
              </div>
              <div>
                <Label>Cập nhật lần cuối</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded">
                  {formatDate(user.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
