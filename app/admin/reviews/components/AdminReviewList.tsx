"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildAbsoluteUrl } from "@/lib/utils";
import {
  Star,
  MessageCircle,
  Image as ImageIcon,
  Calendar,
  ShoppingBag,
  Trash2,
} from "lucide-react";

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

interface AdminReviewListProps {
  reviews: Review[];
  loading?: boolean;
  onDeleteReview: (id: number) => void;
}

interface ReviewItemProps {
  review: Review;
  onDeleteReview: (id: number) => void;
}

const getReviewSentiment = (rating: number): string => {
  if (rating >= 4) return "positive";
  if (rating === 3) return "neutral";
  return "negative";
};

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Hôm nay";
  if (diffInDays === 1) return "Hôm qua";
  if (diffInDays < 7) return `${diffInDays} ngày trước`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;
  return `${Math.floor(diffInDays / 365)} năm trước`;
};

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onDeleteReview }) => {
  const sentiment = getReviewSentiment(review.rating);
  const [showFullComment, setShowFullComment] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const commentPreview =
    review.comment.length > 150
      ? review.comment.substring(0, 150) + "..."
      : review.comment;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200";
      case "neutral":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "negative":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {review.customerAvatar && !avatarError ? (
              <img
                src={buildAbsoluteUrl(review.customerAvatar)}
                alt={review.customerName}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <img
                src="/images/default-avatar.png"
                alt={review.customerName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML =
                      '<svg class="h-6 w-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                  }
                }}
              />
            )}
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">
              {review.customerName}
            </h4>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatRelativeTime(review.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ShoppingBag className="h-4 w-4" />
                <span>Đơn hàng #{review.orderId}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Cửa hàng: {review.storeName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`border ${getSentimentColor(sentiment)}`}>
            {sentiment === "positive"
              ? "Tích cực"
              : sentiment === "neutral"
              ? "Trung lập"
              : "Tiêu cực"}
          </Badge>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= review.rating
                  ? "text-yellow-500 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-semibold text-gray-900">
          {review.rating}.0
        </span>
      </div>

      {/* Review Comment */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {showFullComment ? review.comment : commentPreview}
          {review.comment.length > 150 && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showFullComment ? "Thu gọn" : "Xem thêm"}
            </button>
          )}
        </p>

        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <div className="mt-3 flex gap-2">
            {review.images.slice(0, 3).map((image, index) => (
              <img
                key={image.id}
                src={buildAbsoluteUrl(image.imageUrl)}
                alt={`Ảnh ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg hover:opacity-90 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ))}
            {review.images.length > 3 && (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-600 font-medium">
                +{review.images.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Store Response */}
      {review.reply && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Phản hồi của cửa hàng
              </span>
            </div>
            {review.repliedAt && (
              <span className="text-xs text-blue-600">
                {formatRelativeTime(review.repliedAt)}
              </span>
            )}
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">
            {review.reply}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          {review.images && review.images.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <ImageIcon className="h-3 w-3 mr-1" />
              {review.images.length} ảnh
            </Badge>
          )}
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDeleteReview(review.id)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Xóa
        </Button>
      </div>
    </Card>
  );
};

export const AdminReviewList: React.FC<AdminReviewListProps> = ({
  reviews,
  loading = false,
  onDeleteReview,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-32 h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="w-48 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="w-32 h-5 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
                <div className="w-24 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="p-12 text-center">
        <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không tìm thấy đánh giá
        </h3>
        <p className="text-gray-600">
          Không có đánh giá nào phù hợp với bộ lọc hiện tại.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          onDeleteReview={onDeleteReview}
        />
      ))}
    </div>
  );
};
