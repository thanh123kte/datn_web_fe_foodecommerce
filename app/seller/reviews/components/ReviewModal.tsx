"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  StoreReview,
  formatRating,
  getRatingColor,
  getReviewSentiment,
  formatRelativeTime,
} from "@/lib/mockData/reviews";
import {
  X,
  Star,
  User,
  Calendar,
  ShoppingBag,
  MessageCircle,
  Send,
  Edit,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

interface ReviewModalProps {
  review: StoreReview | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitResponse: (reviewId: number, responseText: string) => Promise<void>;
  onUpdateResponse: (reviewId: number, responseText: string) => Promise<void>;
  onDeleteResponse: (reviewId: number) => Promise<void>;
  loading?: boolean;
  mode?: "view" | "reply" | "edit";
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  review,
  isOpen,
  onClose,
  onSubmitResponse,
  onUpdateResponse,
  onDeleteResponse,
  loading = false,
  mode = "view",
}) => {
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMode, setCurrentMode] = useState<"view" | "reply" | "edit">(
    mode
  );
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    if (review && currentMode === "edit" && review.response) {
      setResponseText(review.response.response_text);
    } else {
      setResponseText("");
    }
  }, [review, currentMode]);

  React.useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review || !responseText.trim()) return;

    setIsSubmitting(true);
    try {
      if (currentMode === "edit") {
        await onUpdateResponse(review.id, responseText.trim());
      } else {
        await onSubmitResponse(review.id, responseText.trim());
      }
      setResponseText("");
      setCurrentMode("view");
    } catch (error) {
      console.error("Failed to submit response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResponse = async () => {
    if (!review || !review.response) return;

    if (
      confirm(
        "Are you sure you want to delete this response? This action cannot be undone."
      )
    ) {
      setIsSubmitting(true);
      try {
        await onDeleteResponse(review.id);
        setCurrentMode("view");
      } catch (error) {
        console.error("Failed to delete response:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen || !review) return null;

  const sentiment = getReviewSentiment(review.rating);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentMode === "reply"
              ? "Reply to Review"
              : currentMode === "edit"
              ? "Edit Response"
              : "Review Details"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
          {/* Customer Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {review.customer_avatar && !imageError ? (
                <img
                  src={review.customer_avatar}
                  alt={review.customer_name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <User className="h-8 w-8 text-gray-500" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {review.customer_name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(review.created_at).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
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

            <div className="flex items-center gap-2">
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
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-gray-700">
                Rating
              </Label>
              <span className="text-lg font-bold text-gray-900">
                {review.rating}.0 / 5.0
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= review.rating
                      ? `${getRatingColor(review.rating)} fill-current`
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {formatRating(review.rating)}
              </span>
            </div>
          </div>

          {/* Review Comment */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Customer Review
            </Label>
            <Card className="p-4">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {review.comment}
              </p>
            </Card>
          </div>

          {/* Review Image */}
          {review.image_url && !imageError && (
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Review Image
              </Label>
              <div className="relative">
                <img
                  src={review.image_url}
                  alt="Review image"
                  className="w-full max-w-md h-auto rounded-lg border border-gray-200"
                  onError={() => setImageError(true)}
                />
              </div>
            </div>
          )}

          {/* Existing Response */}
          {review.is_responded && review.response && currentMode === "view" && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-gray-700">
                  Your Response
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMode("edit")}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteResponse}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Store Response
                  </span>
                  <span className="text-xs text-blue-600 ml-auto">
                    {formatRelativeTime(review.response.created_at)}
                  </span>
                </div>
                <p className="text-blue-800 leading-relaxed whitespace-pre-wrap">
                  {review.response.response_text}
                </p>
              </Card>
            </div>
          )}

          {/* Response Form */}
          {(currentMode === "reply" || currentMode === "edit") && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  {currentMode === "edit"
                    ? "Update Your Response"
                    : "Your Response"}
                </Label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder={`Write a thoughtful response to ${review.customer_name}'s review...`}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                  required
                />
                <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                  <span>
                    Be professional and address the customer's concerns
                  </span>
                  <span>{responseText.length}/1000</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !responseText.trim()}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting
                    ? "Sending..."
                    : currentMode === "edit"
                    ? "Update Response"
                    : "Send Response"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCurrentMode("view");
                    setResponseText("");
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Action Buttons for View Mode */}
          {currentMode === "view" && !review.is_responded && (
            <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
              <Button
                onClick={() => setCurrentMode("reply")}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Reply to Review
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
