"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  UserCircle,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldX,
  Loader2,
  XCircle,
  User,
} from "lucide-react";
import { userService, UserResponse } from "@/lib/services/userService";
import { buildAbsoluteUrl } from "@/lib/utils";

interface Customer extends UserResponse {
  totalOrders?: number;
  totalSpent?: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BANNED">(
    "ALL"
  );
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const data = await userService.getCustomers();
        setCustomers(data as Customer[]);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && customer.isActive) ||
      (statusFilter === "BANNED" && !customer.isActive);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleBan = async (customerId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn cấm tài khoản này?")) {
      try {
        await userService.banUser(customerId);
        // Refresh customers list
        const data = await userService.getCustomers();
        setCustomers(data as Customer[]);
      } catch (error) {
        console.error("Failed to ban customer:", error);
        alert("Không thể cấm tài khoản. Vui lòng thử lại.");
      }
    }
  };

  const handleUnban = async (customerId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn gỡ cấm tài khoản này?")) {
      try {
        await userService.unbanUser(customerId);
        // Refresh customers list
        const data = await userService.getCustomers();
        setCustomers(data as Customer[]);
      } catch (error) {
        console.error("Failed to unban customer:", error);
        alert("Không thể gỡ cấm tài khoản. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Khách hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý tài khoản khách hàng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">
                Tổng khách hàng
              </p>
              <p className="text-xl font-bold text-gray-900">
                {customers.length}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <UserCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Hoạt động</p>
              <p className="text-xl font-bold text-gray-900">
                {customers.filter((c) => c.isActive).length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Đã khóa</p>
              <p className="text-xl font-bold text-gray-900">
                {customers.filter((c) => !c.isActive).length}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <ShieldX className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as typeof statusFilter)
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="BANNED">Đã khóa</option>
          </select>
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <UserCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy khách hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng chi tiêu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tham gia
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {customer.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              className="h-10 w-10 rounded-full"
                              src={buildAbsoluteUrl(customer.avatarUrl)}
                              alt={customer.fullName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserCircle className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.fullName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-3 h-3 mr-1" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.totalOrders || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.totalSpent
                          ? formatCurrency(customer.totalSpent)
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customer.isActive ? (
                          <Shield className="w-3 h-3 mr-1" />
                        ) : (
                          <ShieldX className="w-3 h-3 mr-1" />
                        )}
                        {customer.isActive ? "HOẠT ĐỘNG" : "ĐÃ KHÓA"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(customer.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingCustomer(customer)}
                      >
                        Xem
                      </Button>
                      {customer.isActive ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleBan(customer.id)}
                        >
                          Khóa
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600"
                          onClick={() => handleUnban(customer.id)}
                        >
                          Mở khóa
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Customer Detail Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chi tiết Customer
                </h2>
                <button
                  onClick={() => setViewingCustomer(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Avatar */}
                <div className="flex justify-center">
                  {viewingCustomer.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={buildAbsoluteUrl(viewingCustomer.avatarUrl)}
                      alt={viewingCustomer.fullName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-100">
                      <UserCircle className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Họ và tên
                    </label>
                    <p className="mt-1 text-base text-gray-900 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {viewingCustomer.fullName}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Trạng thái
                    </label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          viewingCustomer.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {viewingCustomer.isActive ? (
                          <Shield className="w-3 h-3 mr-1" />
                        ) : (
                          <ShieldX className="w-3 h-3 mr-1" />
                        )}
                        {viewingCustomer.isActive ? "Active" : "Banned"}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="mt-1 text-base text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {viewingCustomer.email}
                    </p>
                  </div>

                  {viewingCustomer.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Số điện thoại
                      </label>
                      <p className="mt-1 text-base text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {viewingCustomer.phone}
                      </p>
                    </div>
                  )}

                  {viewingCustomer.dateOfBirth && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Ngày sinh
                      </label>
                      <p className="mt-1 text-base text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(viewingCustomer.dateOfBirth)}
                      </p>
                    </div>
                  )}

                  {viewingCustomer.gender && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Giới tính
                      </label>
                      <p className="mt-1 text-base text-gray-900">
                        {viewingCustomer.gender === "MALE"
                          ? "Nam"
                          : viewingCustomer.gender === "FEMALE"
                          ? "Nữ"
                          : "Khác"}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tổng đơn hàng
                    </label>
                    <p className="mt-1 text-base text-gray-900">
                      {viewingCustomer.totalOrders || 0} đơn
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tổng chi tiêu
                    </label>
                    <p className="mt-1 text-base text-gray-900">
                      {viewingCustomer.totalSpent
                        ? formatCurrency(viewingCustomer.totalSpent)
                        : "0 ₫"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Ngày tham gia
                    </label>
                    <p className="mt-1 text-base text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(viewingCustomer.createdAt)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Cập nhật lần cuối
                    </label>
                    <p className="mt-1 text-base text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(viewingCustomer.updatedAt)}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">
                      Vai trò
                    </label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {viewingCustomer.roles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setViewingCustomer(null)}
                  >
                    Đóng
                  </Button>
                  {viewingCustomer.isActive ? (
                    <Button
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 border-red-300"
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Bạn có chắc chắn muốn cấm tài khoản này?"
                          )
                        ) {
                          try {
                            await handleBan(viewingCustomer.id);
                            setViewingCustomer(null);
                          } catch (error) {
                            console.error("Failed to ban customer:", error);
                          }
                        }
                      }}
                    >
                      <ShieldX className="w-4 h-4 mr-2" />
                      Ban Customer
                    </Button>
                  ) : (
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Bạn có chắc chắn muốn gỡ cấm tài khoản này?"
                          )
                        ) {
                          try {
                            await handleUnban(viewingCustomer.id);
                            setViewingCustomer(null);
                          } catch (error) {
                            console.error("Failed to unban customer:", error);
                          }
                        }
                      }}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Unban Customer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
