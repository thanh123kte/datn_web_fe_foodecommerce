// Mock categories data for testing
export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  status: "active" | "inactive";
  productsCount: number;
  createdAt: string;
  updatedAt: string;
}

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Noodle Soups",
    description:
      "Traditional Vietnamese noodle soups with rich, aromatic broth",
    image: "https://images.unsplash.com/photo-1555816901-89d96e8df3ea?w=400",
    status: "active",
    productsCount: 15,
    createdAt: "2024-01-15",
    updatedAt: "2024-11-20",
  },
  {
    id: "2",
    name: "Rice Noodles",
    description: "Bun Bo, Bun Cha, Bun Rieu and other rice noodle dishes",
    image: "https://images.unsplash.com/photo-1559847844-d72956db6a7e?w=400",
    status: "active",
    productsCount: 12,
    createdAt: "2024-01-20",
    updatedAt: "2024-11-15",
  },
  {
    id: "3",
    name: "Rice Dishes",
    description:
      "Broken rice, rice plates, clay pot rice and other rice dishes",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
    status: "active",
    productsCount: 18,
    createdAt: "2024-02-01",
    updatedAt: "2024-11-10",
  },
  {
    id: "4",
    name: "Bread & Cakes",
    description: "Banh Mi, steamed buns, rice rolls and various baked goods",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    status: "active",
    productsCount: 8,
    createdAt: "2024-02-10",
    updatedAt: "2024-11-05",
  },
  {
    id: "5",
    name: "Beverages",
    description: "Soft drinks, tea, coffee and various beverages",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
    status: "active",
    productsCount: 25,
    createdAt: "2024-02-15",
    updatedAt: "2024-11-01",
  },
  {
    id: "6",
    name: "Desserts",
    description: "Sweet soups, ice cream, cakes and various desserts",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
    status: "inactive",
    productsCount: 6,
    createdAt: "2024-03-01",
    updatedAt: "2024-10-20",
  },
];

// Mock API functions
export const getCategoriesAPI = async (filters?: {
  search?: string;
  status?: string;
  sortBy?: string;
}): Promise<Category[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let results = [...mockCategories];

  if (filters?.search) {
    results = results.filter(
      (category) =>
        category.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        category.description
          .toLowerCase()
          .includes(filters.search!.toLowerCase())
    );
  }

  if (filters?.status && filters.status !== "all") {
    results = results.filter((category) => category.status === filters.status);
  }

  if (filters?.sortBy) {
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "products":
          return b.productsCount - a.productsCount;
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });
  }

  return results;
};

export const createCategoryAPI = async (
  data: Omit<Category, "id" | "createdAt" | "updatedAt" | "productsCount">
): Promise<Category> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newCategory: Category = {
    ...data,
    id: Date.now().toString(),
    productsCount: 0,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };

  mockCategories.push(newCategory);
  return newCategory;
};

export const updateCategoryAPI = async (
  id: string,
  data: Partial<Category>
): Promise<Category> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const index = mockCategories.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Category not found");

  mockCategories[index] = {
    ...mockCategories[index],
    ...data,
    updatedAt: new Date().toISOString().split("T")[0],
  };

  return mockCategories[index];
};

export const deleteCategoryAPI = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockCategories.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Category not found");

  mockCategories.splice(index, 1);
};
