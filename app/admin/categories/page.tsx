"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CategoryTable } from "@/components/admin/CategoryTable";
import {
  AdminCategoryFormModal,
  AdminCategoryFormData,
} from "@/components/admin/AdminCategoryFormModal";
import DeleteCategoryModal from "@/components/categories/DeleteCategoryModal";
import { Category, CategoryFilters, CategoryStats } from "@/types/category";
import { categoriesService } from "@/lib/services/categoriesService";
import { resolveMediaUrl } from "@/lib/utils/imageUtils";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats>({
    total_categories: 0,
    active_categories: 0,
    inactive_categories: 0,
    total_products: 0,
    categories_with_products: 0,
    categories_without_products: 0,
    most_popular_categories: [],
    recent_categories: [],
  });
  const [loading, setLoading] = useState(true);

  // Filter states
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilters>({});

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const apiCategories = await categoriesService.getAllCategories();

        // Map API response to frontend Category type
        const mappedCategories: Category[] = apiCategories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          image_url: resolveMediaUrl(
            cat.imageUrl,
            "/images/default-category.png"
          ),
          is_active: cat.isActive,
          products_count: 0, // TODO: Get from products API
          created_at: cat.createdAt,
          updated_at: cat.updatedAt,
        }));

        setCategories(mappedCategories);

        // Calculate stats
        const activeCount = mappedCategories.filter((c) => c.is_active).length;
        const inactiveCount = mappedCategories.length - activeCount;

        setStats({
          total_categories: mappedCategories.length,
          active_categories: activeCount,
          inactive_categories: inactiveCount,
          total_products: 0, // TODO: Calculate from products
          categories_with_products: 0, // TODO: Calculate from products
          categories_without_products: mappedCategories.length, // TODO: Calculate from products
          most_popular_categories: [],
          recent_categories: [],
        });

        toast.success(`Loaded ${mappedCategories.length} categories`);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle category actions
  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    // Could open detail modal here
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleStatusChange = async (categoryId: number, isActive: boolean) => {
    try {
      // Call API to update category status
      await categoriesService.updateCategory(categoryId, { isActive });

      // Update local state
      setCategories((prevCategories) =>
        prevCategories.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              is_active: isActive,
              updated_at: new Date().toISOString(),
            };
          }
          return category;
        })
      );

      // Update stats
      setStats((prevStats) => {
        const category = categories.find((c) => c.id === categoryId);
        if (!category) return prevStats;

        const newStats = { ...prevStats };

        if (category.is_active !== isActive) {
          if (isActive) {
            newStats.active_categories++;
            newStats.inactive_categories--;
          } else {
            newStats.active_categories--;
            newStats.inactive_categories++;
          }
        }

        return newStats;
      });

      toast.success(
        `Category ${isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Error updating category status:", error);
      toast.error("Failed to update category status");
    }
  };

  const handleCategorySave = useCallback(
    async (formData: AdminCategoryFormData) => {
      try {
        setLoading(true);

        if (selectedCategory) {
          // Update existing category
          const updatedCategory =
            await categoriesService.updateCategoryWithImage(
              selectedCategory.id,
              {
                name: formData.name,
                description: formData.description,
                isActive: formData.isActive,
              },
              formData.imageFile
            );

          // Update local state
          setCategories((prevCategories) =>
            prevCategories.map((c) =>
              c.id === selectedCategory.id
                ? {
                    ...c,
                    name: updatedCategory.name,
                    description: updatedCategory.description,
                    image_url: resolveMediaUrl(
                      updatedCategory.imageUrl,
                      "/images/default-category.png"
                    ),
                    is_active: updatedCategory.isActive,
                    updated_at: updatedCategory.updatedAt,
                  }
                : c
            )
          );

          // Update stats if status changed
          if (selectedCategory.is_active !== updatedCategory.isActive) {
            setStats((prevStats) => ({
              ...prevStats,
              active_categories: updatedCategory.isActive
                ? prevStats.active_categories + 1
                : prevStats.active_categories - 1,
              inactive_categories: !updatedCategory.isActive
                ? prevStats.inactive_categories + 1
                : prevStats.inactive_categories - 1,
            }));
          }

          toast.success("Category updated successfully");
        } else {
          // Create new category
          const newCategory = await categoriesService.createCategoryWithImage(
            {
              name: formData.name,
              description: formData.description,
              isActive: formData.isActive,
            },
            formData.imageFile
          );

          // Add to local state
          setCategories((prevCategories) => [
            ...prevCategories,
            {
              id: newCategory.id,
              name: newCategory.name,
              description: newCategory.description,
              image_url: resolveMediaUrl(
                newCategory.imageUrl,
                "/images/default-category.png"
              ),
              is_active: newCategory.isActive,
              products_count: 0,
              created_at: newCategory.createdAt,
              updated_at: newCategory.updatedAt,
            },
          ]);

          // Update stats
          setStats((prevStats) => ({
            ...prevStats,
            total_categories: prevStats.total_categories + 1,
            active_categories: newCategory.isActive
              ? prevStats.active_categories + 1
              : prevStats.active_categories,
            inactive_categories: !newCategory.isActive
              ? prevStats.inactive_categories + 1
              : prevStats.inactive_categories,
            categories_without_products:
              prevStats.categories_without_products + 1,
          }));

          toast.success("Category created successfully");
        }

        setShowEditModal(false);
        setSelectedCategory(null);
      } catch (error) {
        console.error("Error saving category:", error);
        toast.error(
          selectedCategory
            ? "Failed to update category"
            : "Failed to create category"
        );
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory]
  );

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      // Call API to soft delete category
      await categoriesService.softDeleteCategory(selectedCategory.id);

      // Remove from local state immediately
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== selectedCategory.id)
      );

      // Update stats
      setStats((prevStats) => ({
        ...prevStats,
        total_categories: prevStats.total_categories - 1,
        active_categories: selectedCategory.is_active
          ? prevStats.active_categories - 1
          : prevStats.active_categories,
        inactive_categories: !selectedCategory.is_active
          ? prevStats.inactive_categories - 1
          : prevStats.inactive_categories,
      }));

      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  // Filter functions
  const filteredCategories = categories.filter((category) => {
    if (
      categoryFilters.is_active !== undefined &&
      category.is_active !== categoryFilters.is_active
    ) {
      return false;
    }
    if (categoryFilters.search) {
      const searchLower = categoryFilters.search.toLowerCase();
      return (
        category.name.toLowerCase().includes(searchLower) ||
        category.description.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lí danh mục
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lí các danh mục sản phẩm cho nền tảng hệ thống của bạn.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setShowEditModal(true);
          }}
        >
          Thêm danh mục mới
        </Button>
      </div>

      {/* Categories Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Tất cả danh mục ({filteredCategories.length})
          </h2>
        </div>

        <CategoryTable
          categories={filteredCategories}
          loading={loading}
          onCategoryClick={handleCategoryClick}
          onStatusChange={handleStatusChange}
          onFilterChange={setCategoryFilters}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Edit Category Modal */}
      <AdminCategoryFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleCategorySave}
        category={selectedCategory}
        isLoading={loading}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteConfirm}
        category={selectedCategory}
        isLoading={loading}
      />
    </div>
  );
}
