"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Store,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldX,
  Loader2,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { userService, UserResponse } from "@/lib/services/userService";
import { storeService, Store as StoreType } from "@/lib/services/storeService";
import { buildAbsoluteUrl } from "@/lib/utils";

interface Seller extends UserResponse {
  store?: StoreType;
  totalProducts?: number;
  totalOrders?: number;
  revenue?: number;
}

interface PendingSeller extends UserResponse {
  store?: StoreType;
  businessLicense?: string;
  description?: string;
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [pendingSellers, setPendingSellers] = useState<PendingSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [openStatusFilter, setOpenStatusFilter] = useState<
    "ALL" | "OPEN" | "CLOSED"
  >("ALL");
  const [viewingStore, setViewingStore] = useState<StoreType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch pending stores using the new API endpoint
        const pendingStores = await storeService.getByStatus("PENDING");

        // Fetch user information for each pending store
        const pendingWithUsers = await Promise.all(
          pendingStores.map(async (store) => {
            try {
              const user = await userService.getById(store.ownerId);
              return {
                ...user,
                store,
              } as PendingSeller;
            } catch (error) {
              console.error(`Failed to fetch user ${store.ownerId}:`, error);
              return null;
            }
          })
        );

        // Filter out any null values
        const validPendingSellers = pendingWithUsers.filter(
          (seller): seller is PendingSeller => seller !== null
        );

        setPendingSellers(validPendingSellers);

        // Fetch all sellers with stats (products, orders, revenue) for the table
        const sellersWithStats = await userService.getSellersWithStats();

        // Keep only sellers that are not PENDING
        const activeSellers: Seller[] = sellersWithStats
          .filter((seller) => seller.store && seller.store.status !== "PENDING")
          .map((seller) => ({
            ...seller,
            revenue: seller.totalRevenue,
          }));

        setSellers(activeSellers);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (seller.store?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || seller.store?.status === statusFilter;
    const matchesOpenStatus =
      openStatusFilter === "ALL" || seller.store?.opStatus === openStatusFilter;
    return matchesSearch && matchesStatus && matchesOpenStatus;
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

  // Reusable function to refresh data
  const refreshData = async () => {
    try {
      // Fetch pending stores using the new API endpoint
      const pendingStores = await storeService.getByStatus("PENDING");

      // Fetch user information for each pending store
      const pendingWithUsers = await Promise.all(
        pendingStores.map(async (store) => {
          try {
            const user = await userService.getById(store.ownerId);
            return {
              ...user,
              store,
            } as PendingSeller;
          } catch (error) {
            console.error(`Failed to fetch user ${store.ownerId}:`, error);
            return null;
          }
        })
      );

      // Filter out any null values
      const validPendingSellers = pendingWithUsers.filter(
        (seller): seller is PendingSeller => seller !== null
      );

      setPendingSellers(validPendingSellers);

      // Fetch all sellers with stats (products, orders, revenue) for the table
      const sellersWithStats = await userService.getSellersWithStats();

      // Keep only sellers that are not PENDING
      const activeSellers: Seller[] = sellersWithStats
        .filter((seller) => seller.store && seller.store.status !== "PENDING")
        .map((seller) => ({
          ...seller,
          revenue: seller.totalRevenue,
        }));

      setSellers(activeSellers);
    } catch (error) {
      console.error("Failed to refresh data:", error);
      throw error;
    }
  };

  const handleApprove = async (pendingSeller: PendingSeller) => {
    if (window.confirm("Bạn có chắc chắn muốn duyệt yêu cầu này?")) {
      try {
        if (pendingSeller.store) {
          // Update store status to ACTIVE
          await storeService.setStatus(pendingSeller.store.id, "ACTIVE");

          // Add SELLER role to user
          await userService.addRole(pendingSeller.id, "SELLER");

          // Refresh data
          await refreshData();
        }
      } catch (error) {
        console.error("Failed to approve seller:", error);
        alert("Không thể duyệt yêu cầu. Vui lòng thử lại.");
      }
    }
  };

  const handleReject = async (pendingSeller: PendingSeller) => {
    if (window.confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?")) {
      try {
        if (pendingSeller.store) {
          // Update store status to SUSPENDED
          await storeService.setStatus(pendingSeller.store.id, "SUSPENDED");

          // Refresh data
          await refreshData();
        }
      } catch (error) {
        console.error("Failed to reject seller:", error);
        alert("Không thể từ chối yêu cầu. Vui lòng thử lại.");
      }
    }
  };

  const handleBan = async (seller: Seller) => {
    if (window.confirm("Bạn có chắc chắn muốn huỷ kích hoạt store này?")) {
      try {
        if (seller.store) {
          await storeService.setStatus(seller.store.id, "INACTIVE");
          // Refresh sellers list
          await refreshData();
        }
      } catch (error) {
        console.error("Failed to deactivate store:", error);
        alert("Không thể huỷ kích hoạt store. Vui lòng thử lại.");
      }
    }
  };

  const handleUnban = async (seller: Seller) => {
    if (window.confirm("Bạn có chắc chắn muốn kích hoạt lại store này?")) {
      try {
        if (seller.store) {
          await storeService.setStatus(seller.store.id, "ACTIVE");
          // Refresh sellers list
          await refreshData();
        }
      } catch (error) {
        console.error("Failed to activate store:", error);
        alert("Không thể kích hoạt store. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sellers</h1>
          <p className="text-gray-600 mt-1">
            Manage seller accounts and stores
          </p>
        </div>
      </div>

      {/* Pending Sellers Section */}
      {pendingSellers.length > 0 && (
        <Card className="p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Seller Requests
              </h2>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                {pendingSellers.length}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {pendingSellers.map((pending) => (
              <div
                key={pending.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {pending.store?.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={buildAbsoluteUrl(pending.store.imageUrl)}
                        alt={pending.store.name || pending.fullName}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <Store className="w-6 h-6 text-orange-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {pending.fullName}
                      </p>
                      <span className="text-gray-400">•</span>
                      <p className="text-sm text-gray-600 truncate">
                        {pending.store?.name || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Mail className="w-3 h-3 mr-1" />
                        {pending.email}
                      </div>
                      {pending.phone && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Phone className="w-3 h-3 mr-1" />
                          {pending.phone}
                        </div>
                      )}
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(pending.createdAt)}
                      </div>
                    </div>
                    {pending.store?.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                        {pending.store.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApprove(pending)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 border-red-300"
                    onClick={() => handleReject(pending)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Sellers</p>
              <p className="text-xl font-bold text-gray-900">
                {sellers.length}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Active</p>
              <p className="text-xl font-bold text-gray-900">
                {sellers.filter((s) => s.isActive).length}
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
              <p className="text-xs font-medium text-gray-600">Banned</p>
              <p className="text-xl font-bold text-gray-900">
                {sellers.filter((s) => !s.isActive).length}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <ShieldX className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-xl font-bold text-gray-900">
                {sellers.reduce((sum, s) => sum + (s.totalProducts || 0), 0)}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <Package className="w-5 h-5 text-purple-600" />
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
              placeholder="Search by name, store name or email..."
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
            <option value="PENDING">Chờ duyệt</option>
            <option value="ACTIVE">Kích hoạt</option>
            <option value="INACTIVE">Huỷ kích hoạt</option>
          </select>
          <select
            value={openStatusFilter}
            onChange={(e) =>
              setOpenStatusFilter(e.target.value as typeof openStatusFilter)
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả store</option>
            <option value="OPEN">Mở cửa</option>
            <option value="CLOSED">Đóng cửa</option>
          </select>
        </div>
      </Card>

      {/* Sellers Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="text-center py-12">
            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No sellers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cửa hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    THông tin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
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
                {filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {seller.store?.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={buildAbsoluteUrl(seller.store.imageUrl)}
                              alt={seller.store.name || seller.fullName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Store className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {seller.fullName}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Store className="w-3 h-3 mr-1" />
                            {seller.store?.name || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {seller.email}
                        </div>
                        {seller.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-3 h-3 mr-1" />
                            {seller.phone}
                          </div>
                        )}
                        {seller.store?.address && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">
                              {seller.store.address}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {seller.totalProducts || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {seller.totalOrders || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {seller.revenue ? formatCurrency(seller.revenue) : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          seller.store?.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : seller.store?.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {seller.store?.status === "ACTIVE" ? (
                          <Shield className="w-3 h-3 mr-1" />
                        ) : seller.store?.status === "PENDING" ? (
                          <Clock className="w-3 h-3 mr-1" />
                        ) : (
                          <ShieldX className="w-3 h-3 mr-1" />
                        )}
                        {seller.store?.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(seller.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          seller.store && setViewingStore(seller.store)
                        }
                      >
                        View
                      </Button>
                      {seller.store?.status === "ACTIVE" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleBan(seller)}
                        >
                          Huỷ kích hoạt
                        </Button>
                      ) : seller.store?.status === "INACTIVE" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600"
                          onClick={() => handleUnban(seller)}
                        >
                          Kích hoạt
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Store Detail Modal */}
      {viewingStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chi tiết Store
                </h2>
                <button
                  onClick={() => setViewingStore(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Store Image */}
                {viewingStore.imageUrl && (
                  <div className="flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={buildAbsoluteUrl(viewingStore.imageUrl)}
                      alt={viewingStore.name}
                      className="w-48 h-48 rounded-lg object-cover border-2 border-gray-200"
                    />
                  </div>
                )}

                {/* Store Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tên Store
                    </label>
                    <p className="mt-1 text-base text-gray-900">
                      {viewingStore.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Trạng thái
                    </label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          viewingStore.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : viewingStore.status === "PENDING"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {viewingStore.status === "ACTIVE"
                          ? "Kích hoạt"
                          : viewingStore.status === "PENDING"
                          ? "Chờ duyệt"
                          : "Huỷ kích hoạt"}
                      </span>
                    </p>
                  </div>

                  {viewingStore.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Số điện thoại
                      </label>
                      <p className="mt-1 text-base text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {viewingStore.phone}
                      </p>
                    </div>
                  )}

                  {viewingStore.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="mt-1 text-base text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {viewingStore.email}
                      </p>
                    </div>
                  )}

                  {viewingStore.address && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">
                        Địa chỉ
                      </label>
                      <p className="mt-1 text-base text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {viewingStore.address}
                      </p>
                    </div>
                  )}

                  {viewingStore.description && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">
                        Mô tả
                      </label>
                      <p className="mt-1 text-base text-gray-700">
                        {viewingStore.description}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Ngày tạo
                    </label>
                    <p className="mt-1 text-base text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(viewingStore.createdAt)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Cập nhật lần cuối
                    </label>
                    <p className="mt-1 text-base text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(viewingStore.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setViewingStore(null)}
                  >
                    Đóng
                  </Button>
                  {viewingStore.status === "PENDING" && (
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Bạn có chắc chắn muốn duyệt store này?"
                          )
                        ) {
                          try {
                            await storeService.setStatus(
                              viewingStore.id,
                              "ACTIVE"
                            );
                            setViewingStore(null);
                            // Refresh data
                            const sellersWithStats =
                              await userService.getSellersWithStats();
                            const activeSellers: Seller[] = [];
                            const pending: PendingSeller[] = [];
                            sellersWithStats.forEach((seller) => {
                              if (
                                seller.store &&
                                seller.store.status === "PENDING"
                              ) {
                                pending.push(seller);
                              } else if (seller.store) {
                                activeSellers.push({
                                  ...seller,
                                  revenue: seller.totalRevenue,
                                });
                              }
                            });
                            setSellers(activeSellers);
                            setPendingSellers(pending);
                          } catch (error) {
                            console.error("Failed to approve store:", error);
                            alert("Không thể duyệt store. Vui lòng thử lại.");
                          }
                        }
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Duyệt Store
                    </Button>
                  )}
                  {viewingStore.status === "ACTIVE" && (
                    <Button
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 border-red-300"
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Bạn có chắc chắn muốn huỷ kích hoạt store này?"
                          )
                        ) {
                          try {
                            await storeService.setStatus(
                              viewingStore.id,
                              "INACTIVE"
                            );
                            setViewingStore(null);
                            // Refresh data
                            const sellersWithStats =
                              await userService.getSellersWithStats();
                            const activeSellers: Seller[] = [];
                            const pending: PendingSeller[] = [];
                            sellersWithStats.forEach((seller) => {
                              if (
                                seller.store &&
                                seller.store.status === "PENDING"
                              ) {
                                pending.push(seller);
                              } else if (seller.store) {
                                activeSellers.push({
                                  ...seller,
                                  revenue: seller.totalRevenue,
                                });
                              }
                            });
                            setSellers(activeSellers);
                            setPendingSellers(pending);
                          } catch (error) {
                            console.error("Failed to deactivate store:", error);
                            alert(
                              "Không thể huỷ kích hoạt store. Vui lòng thử lại."
                            );
                          }
                        }
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Huỷ kích hoạt
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
