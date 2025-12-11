"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ReviewStatsCards } from "./components/ReviewStatsCards";
import { ReviewFiltersComponent } from "./components/ReviewFilters";
import { ReviewList } from "./components/ReviewList";
import { ReviewModal } from "./components/ReviewModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import storeReviewService, {
  StoreReview,
  ReviewStats,
  ReviewFilters,
} from "@/lib/services/storeReviewService";
import { authApiService } from "@/lib/services/authApiService";
import {
  Star,
  MessageCircle,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ReviewsPage() {
  // State management
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<StoreReview | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "reply" | "edit">("view");

  // Filter state
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: "newest",
  });

  const itemsPerPage = 10;

  // Get store ID from localStorage
  useEffect(() => {
    const storeIdFromStorage = authApiService.getStoreId();
    if (storeIdFromStorage) {
      setStoreId(parseInt(storeIdFromStorage, 10));
    } else {
      console.error("Store ID not found in localStorage");
    }
  }, []);

  // Load data
  const loadData = useCallback(async () => {
    if (!storeId) return;

    setLoading(true);
    try {
      const [reviewsData, statsData] = await Promise.all([
        storeReviewService.getReviewsByStore(storeId, filters),
        storeReviewService.getReviewStats(storeId),
      ]);

      // Pagination logic
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedReviews = reviewsData.slice(startIndex, endIndex);

      setReviews(paginatedReviews);
      setTotalReviews(reviewsData.length);
      setReviewStats(statsData);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, storeId]);

  // Load data on component mount and dependencies change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: Partial<ReviewFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setCurrentPage(1); // Reset to first page when filters change
    },
    []
  );

  // Handle refresh
  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // Modal handlers
  const handleReplyToReview = useCallback((review: StoreReview) => {
    setSelectedReview(review);
    setModalMode("reply");
    setModalOpen(true);
  }, []);

  const handleEditResponse = useCallback((review: StoreReview) => {
    setSelectedReview(review);
    setModalMode("edit");
    setModalOpen(true);
  }, []);

  const handleViewDetails = useCallback((review: StoreReview) => {
    setSelectedReview(review);
    setModalMode("view");
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedReview(null);
    setModalMode("view");
  }, []);

  // Response handlers
  const handleSubmitResponse = useCallback(
    async (reviewId: number, responseText: string) => {
      try {
        await storeReviewService.addReply(reviewId, responseText);
        await loadData(); // Reload data to reflect changes
        handleCloseModal();
      } catch (error) {
        console.error("Failed to submit response:", error);
        throw error;
      }
    },
    [loadData, handleCloseModal]
  );

  const handleUpdateResponse = useCallback(
    async (reviewId: number, responseText: string) => {
      try {
        await storeReviewService.addReply(reviewId, responseText);
        await loadData(); // Reload data to reflect changes
        handleCloseModal();
      } catch (error) {
        console.error("Failed to update response:", error);
        throw error;
      }
    },
    [loadData, handleCloseModal]
  );

  const handleDeleteResponse = useCallback(
    async (review: StoreReview) => {
      try {
        await storeReviewService.deleteReply(review.id);
        await loadData(); // Reload data to reflect changes
        handleCloseModal();
      } catch (error) {
        console.error("Failed to delete response:", error);
        throw error;
      }
    },
    [loadData, handleCloseModal]
  );

  // Pagination
  const totalPages = Math.ceil(totalReviews / itemsPerPage);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePreviousPage = useCallback(() => {
    if (canGoPrevious) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [canGoPrevious]);

  const handleNextPage = useCallback(() => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [canGoNext]);

  // Quick insights
  const insights = useMemo(() => {
    if (!reviewStats) return null;

    const insights = [];

    if (reviewStats.pendingResponses > 0) {
      insights.push({
        type: "warning",
        message: `${reviewStats.pendingResponses} reviews need your response`,
        action: () => handleFiltersChange({ hasResponse: false }),
      });
    }

    if (reviewStats.negativeReviews > reviewStats.totalReviews * 0.2) {
      insights.push({
        type: "alert",
        message:
          "High number of negative reviews - consider improving service quality",
        action: () => handleFiltersChange({ rating: [1, 2] }),
      });
    }

    if (reviewStats.responseRate < 80) {
      insights.push({
        type: "info",
        message: `Your response rate is ${reviewStats.responseRate.toFixed(
          0
        )}% - aim for 80%+`,
        action: () => handleFiltersChange({ hasResponse: false }),
      });
    }

    return insights;
  }, [reviewStats, handleFiltersChange]);

  return (
    <MainLayout userRole="seller">
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Review Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and respond to customer feedback
            </p>
          </div>
        </div>

        {/* Quick Insights */}
        {insights && insights.length > 0 && (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <Card
                key={index}
                className={`p-4 border-l-4 ${
                  insight.type === "warning"
                    ? "border-l-orange-500 bg-orange-50"
                    : insight.type === "alert"
                    ? "border-l-red-500 bg-red-50"
                    : "border-l-blue-500 bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {insight.type === "warning" ? (
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    ) : insight.type === "alert" ? (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        insight.type === "warning"
                          ? "text-orange-800"
                          : insight.type === "alert"
                          ? "text-red-800"
                          : "text-blue-800"
                      }`}
                    >
                      {insight.message}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={insight.action}
                    className="text-xs"
                  >
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        {reviewStats && (
          <ReviewStatsCards stats={reviewStats} loading={loading} />
        )}

        {/* Filters */}
        <ReviewFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
          loading={loading}
          totalReviews={totalReviews}
        />

        {/* Reviews List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Customer Reviews
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                Showing{" "}
                {Math.min((currentPage - 1) * itemsPerPage + 1, totalReviews)} -{" "}
                {Math.min(currentPage * itemsPerPage, totalReviews)} of{" "}
                {totalReviews}
              </span>
            </div>
          </div>

          <ReviewList
            reviews={reviews}
            loading={loading}
            onReplyToReview={handleReplyToReview}
            onEditResponse={handleEditResponse}
            onDeleteResponse={handleDeleteResponse}
            onViewDetails={handleViewDetails}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={!canGoPrevious}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={!canGoNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>

        {/* Review Modal */}
        <ReviewModal
          review={selectedReview}
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSubmitResponse={handleSubmitResponse}
          onUpdateResponse={handleUpdateResponse}
          onDeleteResponse={() => {
            if (selectedReview) {
              return handleDeleteResponse(selectedReview);
            }
            return Promise.resolve();
          }}
          mode={modalMode}
        />
      </div>
    </MainLayout>
  );
}
