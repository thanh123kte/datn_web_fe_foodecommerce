"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  StoreReview,
  formatRating,
  getRatingColor,
  getReviewSentiment,
  formatRelativeTime,
} from "@/lib/mockData/reviews";
import {
  Star,
  MessageCircle,
  Reply,
  Edit,
  Trash2,
  Image as ImageIcon,
  User,
  Calendar,
  ShoppingBag,
} from "lucide-react";

interface ReviewListProps {
  reviews: StoreReview[];
  loading?: boolean;
  onReplyToReview: (review: StoreReview) => void;
  onEditResponse?: (review: StoreReview) => void;
  onDeleteResponse?: (review: StoreReview) => void;
  onViewDetails?: (review: StoreReview) => void;
}

interface ReviewItemProps {
  review: StoreReview;
  onReplyToReview: (review: StoreReview) => void;
  onEditResponse?: (review: StoreReview) => void;
  onDeleteResponse?: (review: StoreReview) => void;
  onViewDetails?: (review: StoreReview) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  onReplyToReview,
  onEditResponse,
  onDeleteResponse,
  onViewDetails,
}) => {
  const sentiment = getReviewSentiment(review.rating);
  const [showFullComment, setShowFullComment] = useState(false);
  const [imageError, setImageError] = useState(false);

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
            {review.customer_avatar ? (
              <img
                src={review.customer_avatar}
                alt={review.customer_name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <User className="h-6 w-6 text-gray-500" />
            )}
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">
              {review.customer_name}
            </h4>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatRelativeTime(review.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ShoppingBag className="h-4 w-4" />
                <span>Order #{review.order_id}</span>
              </div>
              <span>•</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(review.order_total)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`border ${getSentimentColor(sentiment)}`}>
            {sentiment}
          </Badge>
          {!review.is_responded && (
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-200"
            >
              Needs Response
            </Badge>
          )}
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
                  ? `${getRatingColor(review.rating)} fill-current`
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-semibold text-gray-900">
          {review.rating}.0
        </span>
        <span className="text-sm text-gray-600">
          {formatRating(review.rating)}
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
              {showFullComment ? "Show less" : "Show more"}
            </button>
          )}
        </p>

        {/* Review Image */}
        {review.image_url && !imageError && (
          <div className="mt-3">
            <img
              src={review.image_url}
              alt="Review image"
              className="w-32 h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onViewDetails?.(review)}
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>

      {/* Store Response */}
      {review.is_responded && review.response && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Store Response
              </span>
            </div>
            <span className="text-xs text-blue-600">
              {formatRelativeTime(review.response.created_at)}
            </span>
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">
            {review.response.response_text}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          {!review.is_responded ? (
            <Button
              size="sm"
              onClick={() => onReplyToReview(review)}
              className="flex items-center gap-2"
            >
              <Reply className="h-4 w-4" />
              Reply
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditResponse?.(review)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Response
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteResponse?.(review)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete Response
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {review.image_url && (
            <Badge variant="outline" className="text-xs">
              <ImageIcon className="h-3 w-3 mr-1" />
              Has Image
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails?.(review)}
            className="text-blue-600 hover:text-blue-700"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  loading = false,
  onReplyToReview,
  onEditResponse,
  onDeleteResponse,
  onViewDetails,
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
          No Reviews Found
        </h3>
        <p className="text-gray-600 mb-4">
          No reviews match your current filters.
        </p>
        <Button variant="outline">Clear Filters</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          onReplyToReview={onReplyToReview}
          onEditResponse={onEditResponse}
          onDeleteResponse={onDeleteResponse}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
