"use client";

import { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { UserTable } from "@/components/admin/UserTable";
import { SellerManagement } from "@/components/admin/SellerManagement";
import { UserDetailModal } from "@/components/admin/UserDetailModal";
import { UserStats } from "@/components/admin/UserStats";
import {
  User,
  Seller,
  UserStats as UserStatsType,
  UserFilters,
  SellerFilters,
  StoreStatus,
  RoleType,
  Address,
} from "@/types/user";

// Mock data - replace with real API calls
const mockStats: UserStatsType = {
  total_users: 15847,
  active_users: 14562,
  total_sellers: 2847,
  pending_sellers: 156,
  active_sellers: 2234,
  banned_sellers: 23,
  new_users_this_month: 428,
  new_sellers_this_month: 89,
};

const mockUsers: User[] = [
  {
    id: 1,
    email: "admin@qtifood.com",
    full_name: "Admin User",
    phone: "+1234567890",
    gender: "male",
    date_of_birth: "1990-01-15",
    avatar_url: "",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-11-28T14:20:00Z",
    roles: [
      { id: 1, name: RoleType.ADMIN, description: "System Administrator" },
    ],
  },
  {
    id: 2,
    email: "john.seller@example.com",
    full_name: "John Seller",
    phone: "+1234567891",
    gender: "male",
    date_of_birth: "1988-05-20",
    avatar_url: "",
    is_active: true,
    created_at: "2024-02-10T09:15:00Z",
    updated_at: "2024-11-27T16:45:00Z",
    roles: [{ id: 2, name: RoleType.SELLER, description: "Store Owner" }],
  },
  {
    id: 3,
    email: "jane.customer@example.com",
    full_name: "Jane Customer",
    phone: "+1234567892",
    gender: "female",
    date_of_birth: "1995-08-12",
    avatar_url: "",
    is_active: true,
    created_at: "2024-03-05T14:22:00Z",
    updated_at: "2024-11-28T08:30:00Z",
    roles: [
      { id: 3, name: RoleType.CUSTOMER, description: "Regular Customer" },
    ],
  },
  {
    id: 4,
    email: "mike.pizza@example.com",
    full_name: "Mike Pizza Master",
    phone: "+1234567893",
    gender: "male",
    date_of_birth: "1985-12-03",
    avatar_url: "",
    is_active: false,
    created_at: "2024-01-20T11:45:00Z",
    updated_at: "2024-11-25T13:15:00Z",
    roles: [{ id: 2, name: RoleType.SELLER, description: "Store Owner" }],
  },
];

const mockSellers: Seller[] = [
  {
    id: 2,
    email: "john.seller@example.com",
    full_name: "John Seller",
    phone: "+1234567891",
    gender: "male",
    date_of_birth: "1988-05-20",
    avatar_url: "",
    is_active: true,
    created_at: "2024-02-10T09:15:00Z",
    updated_at: "2024-11-27T16:45:00Z",
    roles: [{ id: 2, name: RoleType.SELLER, description: "Store Owner" }],
    store: {
      id: 1,
      owner_id: 2,
      name: "John's Burger House",
      description: "Best burgers in town with fresh ingredients",
      address: "123 Main St, Food District",
      phone: "+1234567891",
      image_url: "",
      store_status: StoreStatus.ACTIVE,
      open_status: "OPEN" as any,
      open_time: "08:00",
      close_time: "22:00",
      created_at: "2024-02-10T09:30:00Z",
      updated_at: "2024-11-27T16:45:00Z",
    },
  },
  {
    id: 4,
    email: "mike.pizza@example.com",
    full_name: "Mike Pizza Master",
    phone: "+1234567893",
    gender: "male",
    date_of_birth: "1985-12-03",
    avatar_url: "",
    is_active: false,
    created_at: "2024-01-20T11:45:00Z",
    updated_at: "2024-11-25T13:15:00Z",
    roles: [{ id: 2, name: RoleType.SELLER, description: "Store Owner" }],
    store: {
      id: 2,
      owner_id: 4,
      name: "Mike's Pizza Corner",
      description: "Authentic Italian pizza with wood-fired oven",
      address: "456 Pizza Ave, Little Italy",
      phone: "+1234567893",
      image_url: "",
      store_status: StoreStatus.PENDING,
      open_status: "CLOSED" as any,
      open_time: "11:00",
      close_time: "23:00",
      created_at: "2024-01-20T12:00:00Z",
      updated_at: "2024-11-25T13:15:00Z",
    },
  },
  {
    id: 5,
    email: "sarah.sushi@example.com",
    full_name: "Sarah Sushi Chef",
    phone: "+1234567894",
    gender: "female",
    date_of_birth: "1992-07-18",
    avatar_url: "",
    is_active: true,
    created_at: "2024-03-15T16:20:00Z",
    updated_at: "2024-11-28T10:15:00Z",
    roles: [{ id: 2, name: RoleType.SELLER, description: "Store Owner" }],
    store: {
      id: 3,
      owner_id: 5,
      name: "Sarah's Sushi Bar",
      description: "Fresh sushi and Japanese cuisine",
      address: "789 Sushi Lane, Japan Town",
      phone: "+1234567894",
      image_url: "",
      store_status: StoreStatus.ACTIVE,
      open_status: "OPEN" as any,
      open_time: "12:00",
      close_time: "21:00",
      created_at: "2024-03-15T16:30:00Z",
      updated_at: "2024-11-28T10:15:00Z",
    },
  },
];

const mockAddresses: Address[] = [
  {
    id: 1,
    user_id: 3,
    receiver: "Jane Customer",
    phone: "+1234567892",
    address: "789 Customer Ave, Residential Area",
    latitude: 40.7128,
    longitude: -74.006,
    is_default: true,
    created_at: "2024-03-05T14:30:00Z",
    updated_at: "2024-11-20T09:45:00Z",
  },
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "sellers">(
    "overview"
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [sellers, setSellers] = useState<Seller[]>(mockSellers);
  const [stats, setStats] = useState<UserStatsType>(mockStats);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [userFilters, setUserFilters] = useState<UserFilters>({});
  const [sellerFilters, setSellerFilters] = useState<SellerFilters>({});

  // Handle user actions
  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUserStatusChange = async (userId: number, isActive: boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, is_active: isActive } : user
      )
    );
    // TODO: Call API to update user status
    console.log(
      `User ${userId} status changed to ${isActive ? "active" : "inactive"}`
    );
  };

  const handleUserSave = async (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    // TODO: Call API to save user changes
    console.log("User updated:", updatedUser);
  };

  // Handle seller actions
  const handleSellerClick = (seller: Seller) => {
    setSelectedUser(seller);
    setShowUserModal(true);
  };

  const handleStoreStatusChange = async (
    sellerId: number,
    storeId: number,
    status: StoreStatus
  ) => {
    setSellers((prevSellers) =>
      prevSellers.map((seller) => {
        if (seller.id === sellerId && seller.store) {
          return {
            ...seller,
            store: { ...seller.store, store_status: status },
          };
        }
        return seller;
      })
    );
    // TODO: Call API to update store status
    console.log(`Store ${storeId} status changed to ${status}`);
  };

  // Filter functions
  const filteredUsers = users.filter((user) => {
    if (
      userFilters.role &&
      !user.roles.some((role) => role.name === userFilters.role)
    ) {
      return false;
    }
    if (
      userFilters.is_active !== undefined &&
      user.is_active !== userFilters.is_active
    ) {
      return false;
    }
    if (userFilters.search) {
      const searchLower = userFilters.search.toLowerCase();
      return (
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const filteredSellers = sellers.filter((seller) => {
    if (
      sellerFilters.store_status &&
      seller.store?.store_status !== sellerFilters.store_status
    ) {
      return false;
    }
    if (
      sellerFilters.open_status &&
      seller.store?.open_status !== sellerFilters.open_status
    ) {
      return false;
    }
    if (sellerFilters.search) {
      const searchLower = sellerFilters.search.toLowerCase();
      return (
        seller.full_name.toLowerCase().includes(searchLower) ||
        seller.email.toLowerCase().includes(searchLower) ||
        (seller.store?.name &&
          seller.store.name.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const getUserAddresses = (userId: number): Address[] => {
    return mockAddresses.filter((address) => address.user_id === userId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage users, sellers, and their accounts
          </p>
        </div>
      </div>

      {/* Stats Overview - Always visible */}
      <UserStats stats={stats} loading={loading} />

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "users"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All Users ({filteredUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("sellers")}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "sellers"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Sellers ({filteredSellers.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                <UserTable
                  users={users.slice(0, 5)}
                  loading={loading}
                  onUserClick={handleUserClick}
                  onUserStatusChange={handleUserStatusChange}
                />
              </div>

              {/* Pending Sellers */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Pending Sellers</h3>
                <SellerManagement
                  sellers={sellers.filter(
                    (s) => s.store?.store_status === StoreStatus.PENDING
                  )}
                  loading={loading}
                  onSellerClick={handleSellerClick}
                  onStoreStatusChange={handleStoreStatusChange}
                />
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <UserTable
              users={filteredUsers}
              loading={loading}
              onUserClick={handleUserClick}
              onUserStatusChange={handleUserStatusChange}
              onFilterChange={setUserFilters}
            />
          )}

          {activeTab === "sellers" && (
            <SellerManagement
              sellers={filteredSellers}
              loading={loading}
              onSellerClick={handleSellerClick}
              onStoreStatusChange={handleStoreStatusChange}
              onFilterChange={setSellerFilters}
            />
          )}
        </div>
      </Tabs>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        onSave={handleUserSave}
        onStatusChange={handleUserStatusChange}
        addresses={selectedUser ? getUserAddresses(selectedUser.id) : []}
      />
    </div>
  );
}
