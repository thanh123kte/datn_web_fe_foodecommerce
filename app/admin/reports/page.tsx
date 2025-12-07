"use client";

import { BarChart3, TrendingUp, FileText, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and generate system reports
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-gray-500">Generated this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenue Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-gray-500">Total this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-gray-500">Online today</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Sales Report
            </CardTitle>
            <CardDescription>
              View detailed sales analytics and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Revenue Report
            </CardTitle>
            <CardDescription>
              Track revenue and financial performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              User Activity Report
            </CardTitle>
            <CardDescription>
              Monitor user engagement and behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              Product Performance
            </CardTitle>
            <CardDescription>
              Analyze product sales and popularity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
