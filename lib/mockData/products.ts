export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  categoryName: string;
  images: string[];
  status: "active" | "inactive" | "out_of_stock";
  inventory: number;
  sold: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeature: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Traditional Pho Bo",
    description:
      "Authentic Vietnamese beef noodle soup with tender beef slices, rice noodles, and aromatic herbs in rich bone broth",
    price: 85000,
    originalPrice: 100000,
    categoryId: "1",
    categoryName: "Noodle Soups",
    images: [
      "https://images.unsplash.com/photo-1555816901-89d96e8df3ea?w=800",
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800",
    ],
    status: "active",
    inventory: 50,
    sold: 245,
    rating: 4.8,
    reviewCount: 89,
    tags: ["popular", "traditional", "beef"],
    isFeature: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-11-20",
  },
  {
    id: "2",
    name: "Grilled Pork Banh Mi",
    description:
      "Crispy Vietnamese baguette filled with marinated grilled pork, fresh vegetables, and homemade sauce",
    price: 45000,
    categoryId: "4",
    categoryName: "Bread & Cakes",
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
    ],
    status: "active",
    inventory: 30,
    sold: 156,
    rating: 4.6,
    reviewCount: 45,
    tags: ["quick", "popular"],
    isFeature: false,
    createdAt: "2024-01-20",
    updatedAt: "2024-11-18",
  },
  {
    id: "3",
    name: "Broken Rice with Grilled Pork",
    description:
      "Traditional Southern Vietnamese broken rice served with grilled pork chop, egg, and pickled vegetables",
    price: 65000,
    categoryId: "3",
    categoryName: "Rice Dishes",
    images: [
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
    ],
    status: "active",
    inventory: 25,
    sold: 98,
    rating: 4.7,
    reviewCount: 32,
    tags: ["traditional", "hearty"],
    isFeature: true,
    createdAt: "2024-02-01",
    updatedAt: "2024-11-15",
  },
  {
    id: "4",
    name: "Fresh Spring Rolls",
    description:
      "Light and healthy fresh spring rolls with shrimp, vegetables, and herbs served with peanut dipping sauce",
    price: 35000,
    categoryId: "4",
    categoryName: "Bread & Cakes",
    images: ["https://images.unsplash.com/photo-1559847844-d72956db6a7e?w=800"],
    status: "active",
    inventory: 40,
    sold: 78,
    rating: 4.5,
    reviewCount: 28,
    tags: ["healthy", "fresh"],
    isFeature: false,
    createdAt: "2024-02-05",
    updatedAt: "2024-11-12",
  },
  {
    id: "5",
    name: "Vietnamese Iced Coffee",
    description:
      "Strong Vietnamese coffee served with condensed milk over ice - perfect for hot weather",
    price: 25000,
    categoryId: "5",
    categoryName: "Beverages",
    images: ["https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800"],
    status: "active",
    inventory: 100,
    sold: 312,
    rating: 4.9,
    reviewCount: 156,
    tags: ["popular", "refreshing", "coffee"],
    isFeature: true,
    createdAt: "2024-02-10",
    updatedAt: "2024-11-10",
  },
  {
    id: "6",
    name: "Beef Noodle Soup (Bun Bo Hue)",
    description:
      "Spicy and flavorful Central Vietnamese noodle soup with beef, pork, and thick rice noodles",
    price: 75000,
    categoryId: "2",
    categoryName: "Rice Noodles",
    images: [
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
    ],
    status: "active",
    inventory: 20,
    sold: 67,
    rating: 4.4,
    reviewCount: 23,
    tags: ["spicy", "traditional"],
    isFeature: false,
    createdAt: "2024-02-15",
    updatedAt: "2024-11-08",
  },
  {
    id: "7",
    name: "Coconut Ice Cream",
    description:
      "Creamy coconut ice cream served in fresh coconut shell with toppings",
    price: 30000,
    categoryId: "6",
    categoryName: "Desserts",
    images: ["https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800"],
    status: "out_of_stock",
    inventory: 0,
    sold: 45,
    rating: 4.3,
    reviewCount: 18,
    tags: ["dessert", "coconut"],
    isFeature: false,
    createdAt: "2024-02-20",
    updatedAt: "2024-11-05",
  },
  {
    id: "8",
    name: "Mango Smoothie",
    description:
      "Fresh mango smoothie made with ripe Vietnamese mangoes and ice",
    price: 35000,
    categoryId: "5",
    categoryName: "Beverages",
    images: ["https://images.unsplash.com/photo-1546173159-315724a31696?w=800"],
    status: "inactive",
    inventory: 15,
    sold: 23,
    rating: 4.2,
    reviewCount: 12,
    tags: ["fresh", "fruit"],
    isFeature: false,
    createdAt: "2024-03-01",
    updatedAt: "2024-11-01",
  },
];

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeature?: boolean;
  sortBy?: "name" | "price" | "sold" | "rating" | "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  images: string[];
  status: "active" | "inactive" | "out_of_stock";
  inventory: number;
  tags: string[];
  isFeature: boolean;
}

// Mock API functions
export const getProductsAPI = async (
  filters: ProductFilters = {}
): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockProducts];

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Category filter
      if (filters.categoryId) {
        filtered = filtered.filter(
          (product) => product.categoryId === filters.categoryId
        );
      }

      // Status filter
      if (filters.status && filters.status !== "all") {
        filtered = filtered.filter(
          (product) => product.status === filters.status
        );
      }

      // Price filters
      if (filters.minPrice !== undefined) {
        filtered = filtered.filter(
          (product) => product.price >= filters.minPrice!
        );
      }
      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(
          (product) => product.price <= filters.maxPrice!
        );
      }

      // Feature filter
      if (filters.isFeature !== undefined) {
        filtered = filtered.filter(
          (product) => product.isFeature === filters.isFeature
        );
      }

      // Sorting
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          const aVal = a[filters.sortBy as keyof Product] as any;
          const bVal = b[filters.sortBy as keyof Product] as any;

          if (filters.order === "desc") {
            return bVal > aVal ? 1 : -1;
          }
          return aVal > bVal ? 1 : -1;
        });
      }

      resolve(filtered);
    }, 500);
  });
};

export const createProductAPI = async (
  data: ProductFormData
): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...data,
        originalPrice: data.originalPrice || undefined,
        categoryName:
          mockProducts.find((p) => p.categoryId === data.categoryId)
            ?.categoryName || "Unknown",
        sold: 0,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };

      mockProducts.push(newProduct);
      resolve(newProduct);
    }, 800);
  });
};

export const updateProductAPI = async (
  id: string,
  data: ProductFormData
): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index === -1) {
        reject(new Error("Product not found"));
        return;
      }

      const updatedProduct: Product = {
        ...mockProducts[index],
        ...data,
        categoryName:
          mockProducts.find((p) => p.categoryId === data.categoryId)
            ?.categoryName || "Unknown",
        updatedAt: new Date().toISOString().split("T")[0],
      };

      mockProducts[index] = updatedProduct;
      resolve(updatedProduct);
    }, 800);
  });
};

export const deleteProductAPI = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index === -1) {
        reject(new Error("Product not found"));
        return;
      }

      mockProducts.splice(index, 1);
      resolve();
    }, 500);
  });
};
