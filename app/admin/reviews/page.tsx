"use client";

import { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReviewFilters } from "@/components/admin/ReviewFilters";
import { resolveMediaUrl } from "@/lib/utils/imageUtils";

interface Store {
  id: number;
  name: string;
}

interface Review {
  id: number;
  orderId: number;
  storeId: number;
  storeName: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Filters
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [hasImage, setHasImage] = useState<string>("");

  useEffect(() => {
    fetchReviews();
    fetchStores();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/store-reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/stores");
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/store-reviews/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Không thể xóa đánh giá");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStore =
      !selectedStore || review.storeId.toString() === selectedStore;
    const matchesRating =
      !selectedRating || review.rating.toString() === selectedRating;
    const matchesImage =
      !hasImage ||
      (hasImage === "true" && review.imageUrl) ||
      (hasImage === "false" && !review.imageUrl);

    return matchesSearch && matchesStore && matchesRating && matchesImage;
  });

  const stats = {
    total: reviews.length,
    averageRating:
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : "0",
    positive: reviews.filter((r) => r.rating >= 4).length,
    withImages: reviews.filter((r) => r.imageUrl).length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Quản lý đánh giá
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Theo dõi và quản lý đánh giá của khách hàng
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng đánh giá
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500">Tất cả thời gian</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Đánh giá trung bình
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-gray-500">Trên 5 sao</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Đánh giá tích cực
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.positive}</div>
            <p className="text-xs text-gray-500">
              {stats.total > 0
                ? Math.round((stats.positive / stats.total) * 100)
                : 0}
              % tích cực
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Có hình ảnh
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withImages}</div>
            <p className="text-xs text-gray-500">
              {stats.total > 0
                ? Math.round((stats.withImages / stats.total) * 100)
                : 0}
              % có ảnh
            </p>
          </CardContent>
        </Card>
      </div>

      {/* All Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Tất cả đánh giá</CardTitle>
          <CardDescription>Danh sách đánh giá từ khách hàng</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6">
            <ReviewFilters
              stores={stores}
              selectedStore={selectedStore}
              selectedRating={selectedRating}
              hasImage={hasImage}
              searchTerm={searchTerm}
              onStoreChange={setSelectedStore}
              onRatingChange={setSelectedRating}
              onImageFilterChange={setHasImage}
              onSearchChange={setSearchTerm}
            />
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy đánh giá nào
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  {/* Review Image (if exists) - Left side */}
                  {review.imageUrl && (
                    <div className="flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveMediaUrl(review.imageUrl)}
                        alt="Review"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Review Content - Middle */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {review.customerName ||
                          `Khách hàng #${review.customerId}`}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Cửa hàng: {review.storeName}
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {review.rating}/5
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {review.comment}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>

                  {/* Delete Button - Right side */}
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
