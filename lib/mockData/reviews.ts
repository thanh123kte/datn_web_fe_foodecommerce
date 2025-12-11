// Reviews data types and mock data based on database schema

export interface StoreReview {
  id: number;
  order_id: number;
  store_id: number;
  customer_id: number;
  rating: number; // 1-5 stars
  comment: string;
  image_url?: string;
  created_at: string;
  // Additional fields for display
  customer_name: string;
  customer_avatar?: string;
  order_total: number;
  response?: StoreReviewResponse;
  is_responded: boolean;
}

export interface StoreReviewResponse {
  id: number;
  review_id: number;
  response_text: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  responseRate: number;
  positiveReviews: number;
  negativeReviews: number;
  recentReviews: number;
  pendingResponses: number;
}

export interface ReviewFilters {
  rating?: number[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  hasResponse?: boolean;
  searchTerm?: string;
  sortBy: "newest" | "oldest" | "highest_rating" | "lowest_rating";
}

// Mock reviews data
export const mockStoreReviews: StoreReview[] = [
  {
    id: 1,
    order_id: 1001,
    store_id: 1,
    customer_id: 101,
    rating: 5,
    comment:
      "Exceptional food quality! The Pad Thai was perfectly balanced with just the right amount of spice. Delivery was super fast and the packaging kept everything fresh. Definitely ordering again!",
    image_url: "/api/placeholder/300/200",
    created_at: "2024-11-27T14:30:00Z",
    customer_name: "John Smith",
    customer_avatar: "/api/placeholder/40/40",
    order_total: 285000,
    is_responded: true,
    response: {
      id: 1,
      review_id: 1,
      response_text:
        "Thank you so much for your wonderful review! We're thrilled you enjoyed our Pad Thai. We take great pride in our authenticity and quality. Looking forward to serving you again soon!",
      created_at: "2024-11-27T15:45:00Z",
      updated_at: "2024-11-27T15:45:00Z",
    },
  },
  {
    id: 2,
    order_id: 1002,
    store_id: 1,
    customer_id: 102,
    rating: 4,
    comment:
      "Great food overall! The Green Curry was delicious and authentic. Only minor issue was the delivery took a bit longer than expected, but the food was still hot when it arrived.",
    created_at: "2024-11-26T19:15:00Z",
    customer_name: "Sarah Johnson",
    customer_avatar: "/api/placeholder/40/40",
    order_total: 340000,
    is_responded: true,
    response: {
      id: 2,
      review_id: 2,
      response_text:
        "Hi Sarah! Thank you for the feedback. We're glad you enjoyed our Green Curry! We apologize for the slight delay - we're working on optimizing our delivery times. Your satisfaction means everything to us!",
      created_at: "2024-11-26T20:30:00Z",
      updated_at: "2024-11-26T20:30:00Z",
    },
  },
  {
    id: 3,
    order_id: 1003,
    store_id: 1,
    customer_id: 103,
    rating: 2,
    comment:
      "Disappointed with this order. The Tom Yum soup was too salty and the spring rolls were soggy. The portion sizes were also smaller than expected for the price.",
    created_at: "2024-11-26T12:45:00Z",
    customer_name: "Michael Chen",
    customer_avatar: "/api/placeholder/40/40",
    order_total: 195000,
    is_responded: false,
  },
  {
    id: 4,
    order_id: 1004,
    store_id: 1,
    customer_id: 104,
    rating: 5,
    comment:
      "Absolutely amazing! Best Thai food in the city. The Massaman Curry was incredible - rich, flavorful, and perfectly spiced. Fast delivery and excellent customer service. Highly recommended!",
    image_url: "/api/placeholder/300/200",
    created_at: "2024-11-25T18:20:00Z",
    customer_name: "Emma Wilson",
    customer_avatar: "/api/placeholder/40/40",
    order_total: 450000,
    is_responded: true,
    response: {
      id: 3,
      review_id: 4,
      response_text:
        "Emma, you've made our day! Thank you for such a wonderful review. Our Massaman Curry is indeed a chef's special. We're honored to be considered the best Thai food in the city!",
      created_at: "2024-11-25T19:00:00Z",
      updated_at: "2024-11-25T19:00:00Z",
    },
  },
  {
    id: 5,
    order_id: 1005,
    store_id: 1,
    customer_id: 105,
    rating: 3,
    comment:
      "Food was okay but nothing special. The Fried Rice was a bit bland and could use more seasoning. Service was good though, and packaging was nice.",
    created_at: "2024-11-25T15:10:00Z",
    customer_name: "David Brown",
    customer_avatar: "/api/placeholder/40/40",
    order_total: 165000,
    is_responded: false,
  },
  {
    id: 6,
    order_id: 1006,
    store_id: 1,
    customer_id: 106,
    rating: 4,
    comment:
      "Good quality ingredients and authentic flavors. The Mango Sticky Rice dessert was a perfect ending to the meal. Will definitely order again!",
    created_at: "2024-11-24T20:30:00Z",
    customer_name: "Lisa Garcia",
    customer_avatar: "/api/placeholder/40/40",
    order_total: 380000,
    is_responded: true,
    response: {
      id: 4,
      review_id: 6,
      response_text:
        "Thank you Lisa! We're so happy you enjoyed our authentic flavors and especially our Mango Sticky Rice - it's a customer favorite! We look forward to your next order.",
      created_at: "2024-11-24T21:15:00Z",
      updated_at: "2024-11-24T21:15:00Z",
    },
  },
  {
    id: 7,
    order_id: 1007,
    store_id: 1,
    customer_id: 107,
    rating: 1,
    comment:
      "Very disappointed. Food arrived cold and over an hour late. The Pad See Ew was tasteless and the vegetables were overcooked. Poor experience overall.",
    created_at: "2024-11-24T13:45:00Z",
    customer_name: "Robert Lee",
    customer_avatar: "/api/placeholder/40/40",
    order_total: 220000,
    is_responded: false,
  },
  {
    id: 8,
    order_id: 1008,
    store_id: 1,
    customer_id: 108,
    rating: 5,
    comment:
      "Outstanding service and food quality! Every dish was perfectly prepared and seasoned. The Thai Basil Chicken was exceptional. Thank you for such a wonderful dining experience!",
    image_url: "/api/placeholder/300/200",
    created_at: "2024-11-23T17:25:00Z",
    customer_name: "Jennifer Taylor",
    customer_avatar: "/api/placeholder/40/40",
    order_total: 320000,
    is_responded: true,
    response: {
      id: 5,
      review_id: 8,
      response_text:
        "Jennifer, thank you so much for this beautiful review! Our Thai Basil Chicken is prepared with traditional recipes and fresh ingredients. We're delighted we could provide you with such a wonderful experience!",
      created_at: "2024-11-23T18:10:00Z",
      updated_at: "2024-11-23T18:10:00Z",
    },
  },
];

// Calculate review statistics
export const calculateReviewStats = (reviews: StoreReview[]): ReviewStats => {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  const ratingDistribution = reviews.reduce(
    (acc, review) => {
      acc[review.rating as keyof typeof acc]++;
      return acc;
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  );

  const respondedReviews = reviews.filter(
    (review) => review.is_responded
  ).length;
  const responseRate =
    totalReviews > 0 ? (respondedReviews / totalReviews) * 100 : 0;

  const positiveReviews = reviews.filter((review) => review.rating >= 4).length;
  const negativeReviews = reviews.filter((review) => review.rating <= 2).length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentReviews = reviews.filter(
    (review) => new Date(review.created_at) >= oneWeekAgo
  ).length;

  const pendingResponses = reviews.filter(
    (review) => !review.is_responded
  ).length;

  return {
    totalReviews,
    averageRating,
    ratingDistribution,
    responseRate,
    positiveReviews,
    negativeReviews,
    recentReviews,
    pendingResponses,
  };
};

// Review API functions
export const reviewsAPI = {
  // Get all reviews with filtering
  getReviews: async (
    page: number = 1,
    limit: number = 10,
    filters?: ReviewFilters
  ): Promise<{ reviews: StoreReview[]; total: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let filteredReviews = [...mockStoreReviews];

    // Apply filters
    if (filters) {
      if (filters.rating && filters.rating.length > 0) {
        filteredReviews = filteredReviews.filter((review) =>
          filters.rating!.includes(review.rating)
        );
      }

      if (filters.hasResponse !== undefined) {
        filteredReviews = filteredReviews.filter(
          (review) => review.is_responded === filters.hasResponse
        );
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredReviews = filteredReviews.filter(
          (review) =>
            review.comment.toLowerCase().includes(searchLower) ||
            review.customer_name.toLowerCase().includes(searchLower)
        );
      }

      if (filters.dateRange) {
        filteredReviews = filteredReviews.filter((review) => {
          const reviewDate = new Date(review.created_at)
            .toISOString()
            .split("T")[0];
          return (
            reviewDate >= filters.dateRange!.startDate &&
            reviewDate <= filters.dateRange!.endDate
          );
        });
      }

      // Sort reviews
      filteredReviews.sort((a, b) => {
        switch (filters.sortBy) {
          case "oldest":
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          case "highest_rating":
            return b.rating - a.rating;
          case "lowest_rating":
            return a.rating - b.rating;
          case "newest":
          default:
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
        }
      });
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const reviews = filteredReviews.slice(start, end);

    return {
      reviews,
      total: filteredReviews.length,
    };
  },

  // Get review statistics
  getReviewStats: async (): Promise<ReviewStats> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return calculateReviewStats(mockStoreReviews);
  },

  // Respond to a review
  respondToReview: async (
    reviewId: number,
    responseText: string
  ): Promise<StoreReviewResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const response: StoreReviewResponse = {
      id: Date.now(),
      review_id: reviewId,
      response_text: responseText,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Update the mock data
    const reviewIndex = mockStoreReviews.findIndex((r) => r.id === reviewId);
    if (reviewIndex !== -1) {
      mockStoreReviews[reviewIndex].response = response;
      mockStoreReviews[reviewIndex].is_responded = true;
    }

    return response;
  },

  // Update response to a review
  updateResponse: async (
    reviewId: number,
    responseText: string
  ): Promise<StoreReviewResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const reviewIndex = mockStoreReviews.findIndex((r) => r.id === reviewId);
    if (reviewIndex !== -1 && mockStoreReviews[reviewIndex].response) {
      mockStoreReviews[reviewIndex].response!.response_text = responseText;
      mockStoreReviews[reviewIndex].response!.updated_at =
        new Date().toISOString();
      return mockStoreReviews[reviewIndex].response!;
    }

    throw new Error("Review or response not found");
  },

  // Delete response
  deleteResponse: async (reviewId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const reviewIndex = mockStoreReviews.findIndex((r) => r.id === reviewId);
    if (reviewIndex !== -1) {
      mockStoreReviews[reviewIndex].response = undefined;
      mockStoreReviews[reviewIndex].is_responded = false;
    }
  },
};



export const getRatingColor = (rating: number): string => {
  if (rating >= 4) return "text-green-600";
  if (rating >= 3) return "text-yellow-600";
  return "text-red-600";
};

export const getRatingText = (rating: number): string => {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.0) return "Good";
  if (rating >= 2.0) return "Fair";
  return "Poor";
};

export const getReviewSentiment = (
  rating: number
): "positive" | "neutral" | "negative" => {
  if (rating >= 4) return "positive";
  if (rating >= 3) return "neutral";
  return "negative";
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};
