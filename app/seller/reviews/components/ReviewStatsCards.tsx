"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewStats } from "@/lib/services/storeReviewService";
import {
  Star,
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ReviewStatsCardsProps {
  stats: ReviewStats;
  loading?: boolean;
}

interface StatCard {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

const getRatingColor = (rating: number): string => {
  return "text-yellow-500";
};

const getRatingText = (rating: number): string => {
  if (rating >= 4.5) return "Xuất sắc";
  if (rating >= 4) return "Rất tốt";
  if (rating >= 3) return "Tốt";
  if (rating >= 2) return "Trung bình";
  return "Cần cải thiện";
};

export const ReviewStatsCards: React.FC<ReviewStatsCardsProps> = ({
  stats,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-32 h-8 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const statCards: StatCard[] = [
    {
      title: "Đánh giá trung bình",
      value: stats.averageRating.toFixed(1),
      subtitle: getRatingText(stats.averageRating),
      icon: <Star className="h-5 w-5" />,
      color: "bg-yellow-500",
    },
    {
      title: "Tổng đánh giá",
      value: stats.totalReviews.toString(),
      subtitle: "phản hồi từ khách hàng",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      title: "Tỷ lệ phản hồi",
      value: `${stats.responseRate.toFixed(0)}%`,
      subtitle: `${stats.totalReviews - stats.pendingResponses} đã phản hồi`,
      icon: <CheckCircle className="h-5 w-5" />,
      color:
        stats.responseRate >= 80
          ? "bg-green-500"
          : stats.responseRate >= 60
          ? "bg-yellow-500"
          : "bg-red-500",
    },
    {
      title: "Chờ phản hồi",
      value: stats.pendingResponses.toString(),
      subtitle: "cần chú ý",
      icon: <Clock className="h-5 w-5" />,
      color:
        stats.pendingResponses > 5
          ? "bg-red-500"
          : stats.pendingResponses > 2
          ? "bg-yellow-500"
          : "bg-green-500",
    },

  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="p-6 flex-row hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color} text-white`}>
                {card.icon}
              </div>
              {card.badge && (
                <Badge variant={card.badge.variant} className="text-xs">
                  {card.badge.text}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              {card.subtitle && (
                <p className="text-sm text-gray-500">{card.subtitle}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Rating Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Rating Distribution
        </h3>
        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              stats.ratingDistribution[
                rating as keyof typeof stats.ratingDistribution
              ];
            const percentage =
              stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-20">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star
                    className={`h-4 w-4 ${getRatingColor(rating)} fill-current`}
                  />
                </div>

                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      rating >= 4
                        ? "bg-green-500"
                        : rating >= 3
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 w-16">
                  <span className="text-sm font-medium">{count}</span>
                  <span className="text-xs text-gray-500">
                    ({percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
