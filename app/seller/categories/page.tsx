"use client";

import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Grid,
  List,
  ArrowUpDown,
} from "lucide-react";
import {
  StoreCategory,
  storeCategoryService,
  CreateStoreCategoryDto,
  UpdateStoreCategoryDto,
} from "@/lib/services/storeCategoryService";
import { categoriesService, Category } from "@/lib/services/categoriesService";
import CategoryFormModal, {
  CategoryFormData,
} from "@/components/categories/CategoryFormModal";
import DeleteCategoryModal from "@/components/categories/DeleteCategoryModal";

type ViewMode = "grid" | "table";
type SortField = "name" | "createdAt" | "updatedAt";
type SortOrder = "asc" | "desc";

export default function CategoriesPage() {
  // State
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Platform categories filter
  const [platformCategories, setPlatformCategories] = useState<Category[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    number | null
  >(null);

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<StoreCategory | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Get store info from auth context
  const { currentStore, userRole, refreshStore } = useAuth();
  const storeId = currentStore?.id;

  // Ensure store info is loaded after auth (e.g., Google/Firebase login)
  useEffect(() => {
    if (userRole === "SELLER" && !storeId) {
      refreshStore();
    }
  }, [userRole, storeId, refreshStore]);

  // Load platform categories
  const loadPlatformCategories = useCallback(async () => {
    try {
      const data = await categoriesService.getActiveCategories();
      setPlatformCategories(data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục toàn sàn:", error);
    }
  }, []);

  useEffect(() => {
    loadPlatformCategories();
  }, [loadPlatformCategories]);

  // Load categories
  const loadCategories = useCallback(async () => {
    if (!storeId) {
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await storeCategoryService.searchByStore(storeId, {
        search: searchTerm || undefined,
        categoryId: selectedCategoryFilter || undefined,
      });

      // Sort data
      const sortedData = [...data].sort((a, b) => {
        const aValue = a[sortField as keyof StoreCategory];
        const bValue = b[sortField as keyof StoreCategory];

        if (aValue === undefined || bValue === undefined) return 0;

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setCategories(sortedData);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [storeId, searchTerm, selectedCategoryFilter, sortField, sortOrder]);

  // Effects
  useEffect(() => {
    loadCategories();
  }, [
    searchTerm,
    selectedCategoryFilter,
    sortField,
    sortOrder,
    storeId,
    loadCategories,
  ]);

  // Handlers
  const handleCreateCategory = async (data: CategoryFormData) => {
    if (!storeId) {
      console.error("Store ID not available");
      return;
    }

    setModalLoading(true);
    try {
      const createData: CreateStoreCategoryDto = {
        storeId: storeId,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
      };
      // Creating category
      await storeCategoryService.create(createData);
      await loadCategories();
      setShowFormModal(false);
      // Show success message (you can implement toast notifications)
    } catch (error) {
      console.error("Lỗi khi tạo danh mục:", error);
      // Log the full error response
      if (error && typeof error === "object" && "response" in error) {
        // Error response
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateCategory = async (data: CategoryFormData) => {
    if (!selectedCategory) return;

    setModalLoading(true);
    try {
      const updateData: UpdateStoreCategoryDto = {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
      };
      await storeCategoryService.update(selectedCategory.id, updateData);
      await loadCategories();
      setShowFormModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setModalLoading(true);
    try {
      await storeCategoryService.softDelete(selectedCategory.id);

      // Remove from local state immediately
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== selectedCategory.id)
      );

      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const openEditModal = (category: StoreCategory) => {
    setSelectedCategory(category);
    setShowFormModal(true);
  };

  const openDeleteModal = (category: StoreCategory) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  return (
    <MainLayout userRole="seller">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Category Management
          </h1>
          <p className="text-gray-600">
            Manage your store&apos;s product categories
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Categories
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Grid className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {categories.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Platform Categories
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(categories.map((c) => c.categoryId)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Grid className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Store ID</p>
                <p className="text-2xl font-bold text-orange-600">
                  {storeId || "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <List className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Left side - Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Platform Category Filter */}
              <div className="min-w-48">
                <select
                  value={selectedCategoryFilter || ""}
                  onChange={(e) =>
                    setSelectedCategoryFilter(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Danh mục sàn</option>
                  {platformCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Count Info */}
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
                {categories.length} categories
              </div>
            </div>

            {/* Right side - View Mode and Add Button */}
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 ${
                    viewMode === "table"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
              </div>

              {/* Add Button */}
              <Button
                onClick={() => setShowFormModal(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        </Card>

        {/* Content */}
        {loading ? (
          <Card className="p-12">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          </Card>
        ) : !storeId ? (
          <Card className="p-12 text-center">
            <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Store Information Not Available
            </h3>
            <p className="text-gray-600 mb-6">
              Please make sure you have a store associated with your account or
              contact support.
            </p>
            {userRole !== "SELLER" && (
              <p className="text-red-600 text-sm">
                You need SELLER role to access this feature.
              </p>
            )}
          </Card>
        ) : categories.length === 0 ? (
          <Card className="p-12 text-center">
            <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first category to start managing products
            </p>
            <Button
              onClick={() => setShowFormModal(true)}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={!storeId}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add First Category
            </Button>
          </Card>
        ) : viewMode === "table" ? (
          /* Table View */
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-2 hover:text-orange-600"
                      >
                        Category
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Description
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Platform Category
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      <button
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center gap-2 hover:text-orange-600"
                      >
                        Created
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="text-right py-4 px-6 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <h3 className="font-medium text-gray-900">
                          {category.name}
                        </h3>
                      </td>
                      <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                        {category.description}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {category.categoryName || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(category.createdAt).toLocaleDateString(
                          "en-US"
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(category)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow"
              >
                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {category.name}
                    </h3>
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {category.description}
                  </p>

                  {/* Platform Category */}
                  <div className="mb-3">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category.categoryName || "N/A"}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Store {category.storeId}</span>
                    <span>
                      {new Date(category.createdAt).toLocaleDateString("en-US")}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(category)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteModal(category)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={
          selectedCategory ? handleUpdateCategory : handleCreateCategory
        }
        category={selectedCategory || undefined}
        isLoading={modalLoading}
      />

      <DeleteCategoryModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteCategory}
        category={selectedCategory}
        isLoading={modalLoading}
      />
    </MainLayout>
  );
}
