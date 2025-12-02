"use client";

import { useState } from "react";
import { User, UserFilters, RoleType } from "@/types/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onUserClick?: (user: User) => void;
  onUserStatusChange?: (userId: number, isActive: boolean) => void;
  onFilterChange?: (filters: UserFilters) => void;
}

export function UserTable({
  users,
  loading = false,
  onUserClick,
  onUserStatusChange,
  onFilterChange,
}: UserTableProps) {
  const [filters, setFilters] = useState<UserFilters>({});
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleSort = (field: string) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search users by name or email..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.role || ""}
              onChange={(e) =>
                handleFilterChange({
                  role: (e.target.value as RoleType) || undefined,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value={RoleType.ADMIN}>Admin</option>
              <option value={RoleType.SELLER}>Seller</option>
              <option value={RoleType.CUSTOMER}>Customer</option>
            </select>
            <select
              value={
                filters.is_active === undefined
                  ? ""
                  : filters.is_active.toString()
              }
              onChange={(e) =>
                handleFilterChange({
                  is_active:
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true",
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700">
                <button
                  onClick={() => handleSort("id")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  ID
                  {sortField === "id" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                <button
                  onClick={() => handleSort("full_name")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Name
                  {sortField === "full_name" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">Email</th>
              <th className="text-left p-4 font-medium text-gray-700">Phone</th>
              <th className="text-left p-4 font-medium text-gray-700">Roles</th>
              <th className="text-left p-4 font-medium text-gray-700">
                Status
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                <button
                  onClick={() => handleSort("created_at")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Created
                  {sortField === "created_at" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-8 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => onUserClick?.(user)}
                >
                  <td className="p-4 font-medium">#{user.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4 text-gray-600">{user.phone || "N/A"}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge
                          key={role.id}
                          className={`text-xs ${getRoleBadgeColor(role.name)}`}
                        >
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      className={`text-xs ${
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUserClick?.(user);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant={user.is_active ? "outline" : "default"}
                        onClick={(e) => {
                          e.stopPropagation();
                          onUserStatusChange?.(user.id, !user.is_active);
                        }}
                      >
                        {user.is_active ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
