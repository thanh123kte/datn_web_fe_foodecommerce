"use client";

import { Star, MessageSquare, ThumbsUp, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reviews Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Monitor and manage customer reviews
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reviews
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-gray-500">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <p className="text-xs text-gray-500">Out of 5 stars</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Positive Reviews
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,089</div>
            <p className="text-xs text-gray-500">85% positive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Review
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-gray-500">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
          <CardDescription>
            Latest customer feedback and ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                user: "John Doe",
                product: "Phở Bò Đặc Biệt",
                rating: 5,
                comment: "Excellent food quality and fast delivery!",
                time: "2 hours ago",
                status: "approved",
              },
              {
                user: "Jane Smith",
                product: "Bánh Mì Thịt",
                rating: 4,
                comment: "Good taste but a bit late delivery.",
                time: "5 hours ago",
                status: "approved",
              },
              {
                user: "Mike Johnson",
                product: "Cơm Tấm Sườn",
                rating: 3,
                comment: "Average quality, expected better.",
                time: "1 day ago",
                status: "pending",
              },
            ].map((review, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {review.user}
                    </p>
                    <Badge
                      variant={
                        review.status === "approved" ? "default" : "secondary"
                      }
                    >
                      {review.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {review.product}
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
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{review.time}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline">
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
