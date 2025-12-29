"use client";

import { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Image as ImageIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReviewFilters } from "@/components/admin/ReviewFilters";
import { AdminReviewList } from "./components/AdminReviewList";

interface Store {
  id: number;
  name: string;
}

interface ReviewImage {
  id: number;
  imageUrl: string;
  createdAt: string;
}

interface Review {
  id: number;
  orderId: number;
  storeId: number;
  storeName: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  images: ReviewImage[];
  reply?: string;
  repliedAt?: string;
  createdAt: string;
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
      (hasImage === "true" && review.images && review.images.length > 0) ||
      (hasImage === "false" && (!review.images || review.images.length === 0));

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
    withImages: reviews.filter((r) => r.images && r.images.length > 0).length,
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
          <AdminReviewList
            reviews={filteredReviews}
            loading={loading}
            onDeleteReview={handleDeleteReview}
          />
        </CardContent>
      </Card>
    </div>
  );
}
