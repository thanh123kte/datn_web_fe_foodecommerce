"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryTable } from "@/components/admin/CategoryTable";
import { CategoryStatsComponent } from "@/components/admin/CategoryStats";
import CategoryFormModal from "@/components/categories/CategoryFormModal";
import DeleteCategoryModal from "@/components/categories/DeleteCategoryModal";
import { Category, CategoryFilters, CategoryStats } from "@/types/category";

// Mock data - replace with real API calls
const mockStats: CategoryStats = {
  total_categories: 18,
  active_categories: 15,
  inactive_categories: 3,
  total_products: 156,
  categories_with_products: 12,
  categories_without_products: 6,
  most_popular_categories: [],
  recent_categories: [],
};

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Vietnamese Noodle Soups",
    description:
      "Traditional Vietnamese noodle soups including Pho, Bun Bo Hue, and Mi Quang with authentic broths and fresh ingredients.",
    image_url:
      "https://images.unsplash.com/photo-1555816901-89d96e8df3ea?w=400",
    is_active: true,
    products_count: 15,
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-11-20T14:45:00Z",
  },
  {
    id: 2,
    name: "Rice Dishes",
    description:
      "Broken rice, clay pot rice, rice plates and other rice-based Vietnamese dishes with various toppings and sides.",
    image_url:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
    is_active: true,
    products_count: 22,
    created_at: "2024-02-01T10:15:00Z",
    updated_at: "2024-11-25T16:20:00Z",
  },
  {
    id: 3,
    name: "Street Food & Snacks",
    description:
      "Popular Vietnamese street food including Banh Mi, spring rolls, pancakes and other quick bites and snacks.",
    image_url:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    is_active: true,
    products_count: 28,
    created_at: "2024-02-10T14:22:00Z",
    updated_at: "2024-11-22T09:30:00Z",
  },
  {
    id: 4,
    name: "Beverages & Drinks",
    description:
      "Vietnamese coffee, tea, fresh fruit juices, smoothies and other traditional and modern beverages.",
    image_url:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
    is_active: true,
    products_count: 35,
    created_at: "2024-03-01T16:45:00Z",
    updated_at: "2024-11-28T11:20:00Z",
  },
  {
    id: 5,
    name: "Desserts & Sweets",
    description:
      "Traditional Vietnamese desserts including che, ice cream, cakes and various sweet treats and confections.",
    image_url:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
    is_active: true,
    products_count: 18,
    created_at: "2024-03-15T12:00:00Z",
    updated_at: "2024-11-15T18:45:00Z",
  },
  {
    id: 6,
    name: "Grilled & BBQ",
    description:
      "Vietnamese grilled meats, seafood and vegetables served with rice paper, herbs and dipping sauces.",
    image_url:
      "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400",
    is_active: false,
    products_count: 12,
    created_at: "2024-04-01T09:30:00Z",
    updated_at: "2024-10-20T15:10:00Z",
  },
];

// Update stats with actual data
mockStats.most_popular_categories = mockCategories
  .sort((a, b) => (b.products_count || 0) - (a.products_count || 0))
  .slice(0, 5);

mockStats.recent_categories = mockCategories
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  .slice(0, 3);

export default function AdminCategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [stats, setStats] = useState<CategoryStats>(mockStats);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilters>({});

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

    // TODO: Call API to update category status
    console.log(
      `Category ${categoryId} status changed to ${
        isActive ? "active" : "inactive"
      }`
    );
  };

  const handleCategorySave = async (updatedCategory: Category) => {
    setCategories((prevCategories) => {
      const existingIndex = prevCategories.findIndex(
        (c) => c.id === updatedCategory.id
      );
      if (existingIndex >= 0) {
        // Update existing category
        const newCategories = [...prevCategories];
        newCategories[existingIndex] = {
          ...updatedCategory,
          updated_at: new Date().toISOString(),
        };
        return newCategories;
      } else {
        // Add new category
        return [
          ...prevCategories,
          {
            ...updatedCategory,
            id: Date.now(), // Generate new ID
            products_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
      }
    });

    // Update stats for new category
    if (!categories.find((c) => c.id === updatedCategory.id)) {
      setStats((prevStats) => ({
        ...prevStats,
        total_categories: prevStats.total_categories + 1,
        active_categories: updatedCategory.is_active
          ? prevStats.active_categories + 1
          : prevStats.active_categories,
        inactive_categories: !updatedCategory.is_active
          ? prevStats.inactive_categories + 1
          : prevStats.inactive_categories,
        categories_without_products: prevStats.categories_without_products + 1,
      }));
    }

    setShowEditModal(false);
    setSelectedCategory(null);

    // TODO: Call API to save category changes
    console.log("Category updated:", updatedCategory);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

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
      total_products:
        prevStats.total_products - (selectedCategory.products_count || 0),
      categories_with_products:
        (selectedCategory.products_count || 0) > 0
          ? prevStats.categories_with_products - 1
          : prevStats.categories_with_products,
      categories_without_products:
        (selectedCategory.products_count || 0) === 0
          ? prevStats.categories_without_products - 1
          : prevStats.categories_without_products,
    }));

    setShowDeleteModal(false);
    setSelectedCategory(null);

    // TODO: Call API to delete category
    console.log("Category deleted:", selectedCategory.id);
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
            Category Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage product categories for the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory(null);
              setShowEditModal(true);
            }}
          >
            Add Category
          </Button>
          <Link href="/admin/categories/create">
            <Button>Create New Category</Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <CategoryStatsComponent stats={stats} loading={loading} />

      {/* Categories Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            All Categories ({filteredCategories.length})
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button variant="outline" size="sm">
              Import
            </Button>
          </div>
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

      {/* Quick Actions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.active_categories}</div>
          <div className="text-blue-100">Active Categories</div>
          <div className="mt-2">
            <Button
              size="sm"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
              onClick={() => setCategoryFilters({ is_active: true })}
            >
              View Active
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">
            {stats.categories_with_products}
          </div>
          <div className="text-green-100">With Products</div>
          <div className="mt-2">
            <Button
              size="sm"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-green-600"
            >
              View Details
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">
            {stats.categories_without_products}
          </div>
          <div className="text-orange-100">Empty Categories</div>
          <div className="mt-2">
            <Button
              size="sm"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-orange-600"
            >
              Add Products
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{stats.total_products}</div>
          <div className="text-purple-100">Total Products</div>
          <div className="mt-2">
            <Link href="/admin/products">
              <Button
                size="sm"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-purple-600"
              >
                Manage Products
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Management Tips */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4">
          Category Management Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-indigo-800 mb-2">
              Organization Best Practices
            </h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Create clear, descriptive category names</li>
              <li>• Use high-quality images for better user experience</li>
              <li>• Keep descriptions informative and concise</li>
              <li>• Regularly review and update categories</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-indigo-800 mb-2">
              Performance Optimization
            </h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Deactivate unused categories to reduce clutter</li>
              <li>• Monitor product distribution across categories</li>
              <li>• Merge similar categories when appropriate</li>
              <li>• Ensure each category has relevant products</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Edit Category Modal */}
      <CategoryFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={(formData) => {
          const categoryData: Category = {
            id: selectedCategory?.id || Date.now(),
            name: formData.name,
            description: formData.description,
            image_url: formData.image || undefined,
            is_active: formData.status === "active",
            products_count: selectedCategory?.products_count || 0,
            created_at:
              selectedCategory?.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          handleCategorySave(categoryData);
        }}
        category={
          selectedCategory
            ? {
                id: selectedCategory.id.toString(),
                name: selectedCategory.name,
                description: selectedCategory.description,
                image: selectedCategory.image_url,
                status: selectedCategory.is_active ? "active" : "inactive",
                productsCount: selectedCategory.products_count || 0,
                createdAt: selectedCategory.created_at,
                updatedAt: selectedCategory.updated_at,
              }
            : undefined
        }
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteConfirm}
        category={
          selectedCategory
            ? {
                id: selectedCategory.id.toString(),
                name: selectedCategory.name,
                description: selectedCategory.description,
                image: selectedCategory.image_url,
                status: selectedCategory.is_active ? "active" : "inactive",
                productsCount: selectedCategory.products_count || 0,
                createdAt: selectedCategory.created_at,
                updatedAt: selectedCategory.updated_at,
              }
            : null
        }
      />
    </div>
  );
}
