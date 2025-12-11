import axiosInstance from "@/lib/api/axiosConfig";

export interface StoreReview {
  id: number;
  orderId: number;
  storeId: number;
  storeName: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  pendingResponses: number;
  positiveReviews: number;
  neutralReviews: number;
  negativeReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewFilters {
  sortBy?: "newest" | "oldest" | "highest" | "lowest";
  rating?: number[];
  hasResponse?: boolean;
  searchTerm?: string;
}

const storeReviewService = {
  // Get reviews by store ID with filters
  async getReviewsByStore(
    storeId: number,
    filters?: ReviewFilters
  ): Promise<StoreReview[]> {
    try {
      const response = await axiosInstance.get<StoreReview[]>(
        `/api/store-reviews/store/${storeId}`
      );
      let reviews = response.data;

      // Apply filters
      if (filters) {
        // Filter by rating
        if (filters.rating && filters.rating.length > 0) {
          reviews = reviews.filter((review) =>
            filters.rating!.includes(review.rating)
          );
        }

        // Filter by response status
        if (filters.hasResponse !== undefined) {
          reviews = reviews.filter((review) =>
            filters.hasResponse ? !!review.reply : !review.reply
          );
        }

        // Search by customer name or comment
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          reviews = reviews.filter(
            (review) =>
              review.customerName.toLowerCase().includes(searchLower) ||
              review.comment.toLowerCase().includes(searchLower)
          );
        }

        // Sort reviews
        switch (filters.sortBy) {
          case "newest":
            reviews.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            break;
          case "oldest":
            reviews.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
            break;
          case "highest":
            reviews.sort((a, b) => b.rating - a.rating);
            break;
          case "lowest":
            reviews.sort((a, b) => a.rating - b.rating);
            break;
        }
      }

      return reviews;
    } catch (error) {
      console.error("Error fetching store reviews:", error);
      throw error;
    }
  },

  // Get review statistics for a store
  async getReviewStats(storeId: number): Promise<ReviewStats> {
    try {
      const reviews = await this.getReviewsByStore(storeId);

      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

      const reviewsWithResponse = reviews.filter((r) => !!r.reply).length;
      const responseRate =
        totalReviews > 0 ? (reviewsWithResponse / totalReviews) * 100 : 0;

      const pendingResponses = reviews.filter((r) => !r.reply).length;

      const positiveReviews = reviews.filter((r) => r.rating >= 4).length;
      const neutralReviews = reviews.filter((r) => r.rating === 3).length;
      const negativeReviews = reviews.filter((r) => r.rating <= 2).length;

      const ratingDistribution = {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
      };

      return {
        averageRating,
        totalReviews,
        responseRate,
        pendingResponses,
        positiveReviews,
        neutralReviews,
        negativeReviews,
        ratingDistribution,
      };
    } catch (error) {
      console.error("Error calculating review stats:", error);
      throw error;
    }
  },

  // Add reply to a review
  async addReply(reviewId: number, reply: string): Promise<StoreReview> {
    try {
      const response = await axiosInstance.post<StoreReview>(
        `/api/store-reviews/${reviewId}/reply`,
        { reply }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
    }
  },

  // Delete reply from a review
  async deleteReply(reviewId: number): Promise<StoreReview> {
    try {
      const response = await axiosInstance.delete<StoreReview>(
        `/api/store-reviews/${reviewId}/reply`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting reply:", error);
      throw error;
    }
  },

  // Get single review by ID
  async getReviewById(reviewId: number): Promise<StoreReview> {
    try {
      const response = await axiosInstance.get<StoreReview>(
        `/api/store-reviews/${reviewId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching review:", error);
      throw error;
    }
  },

  // Get average rating for a store
  async getAverageRating(storeId: number): Promise<number> {
    try {
      const response = await axiosInstance.get<number>(
        `/api/store-reviews/store/${storeId}/average-rating`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching average rating:", error);
      throw error;
    }
  },

  // Get total reviews count for a store
  async getTotalReviews(storeId: number): Promise<number> {
    try {
      const response = await axiosInstance.get<number>(
        `/api/store-reviews/store/${storeId}/total`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching total reviews:", error);
      throw error;
    }
  },
};

export default storeReviewService;
