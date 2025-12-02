export interface Category {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Additional fields for display
  products_count?: number;
}

export interface CategoryFilters {
  search?: string;
  is_active?: boolean;
  sort_by?: "name" | "products_count" | "created_at";
  sort_direction?: "asc" | "desc";
}

export interface CategoryStats {
  total_categories: number;
  active_categories: number;
  inactive_categories: number;
  total_products: number;
  categories_with_products: number;
  categories_without_products: number;
  most_popular_categories: Category[];
  recent_categories: Category[];
}

export interface CategoryFormData {
  name: string;
  description: string;
  image_url?: string;
  is_active: boolean;
}
