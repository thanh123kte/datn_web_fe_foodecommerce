"use client";

import { useState } from "react";
import NextImage from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Banner,
  BannerStatus,
  getBannerStatusColor,
} from "@/lib/mockData/promotions";
import {
  Image as ImageIcon,
  Calendar,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface BannerListProps {
  banners: Banner[];
  loading?: boolean;
  onEdit?: (banner: Banner) => void;
  onDelete?: (banner: Banner) => void;
  onViewDetails?: (banner: Banner) => void;
  onToggleStatus?: (banner: Banner) => void;
}

interface BannerItemProps {
  banner: Banner;
  onEdit?: (banner: Banner) => void;
  onDelete?: (banner: Banner) => void;
  onViewDetails?: (banner: Banner) => void;
  onToggleStatus?: (banner: Banner) => void;
}

const BannerItem: React.FC<BannerItemProps> = ({
  banner,
  onEdit,
  onDelete,
  onViewDetails,
  onToggleStatus,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getStatusIcon = (status: BannerStatus) => {
    switch (status) {
      case BannerStatus.ACTIVE:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case BannerStatus.INACTIVE:
        return <XCircle className="h-4 w-4 text-yellow-600" />;
      case BannerStatus.EXPIRED:
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const canToggleStatus = (status: BannerStatus) => {
    return status === BannerStatus.ACTIVE || status === BannerStatus.INACTIVE;
  };

  const getNextStatus = (currentStatus: BannerStatus) => {
    return currentStatus === BannerStatus.ACTIVE
      ? BannerStatus.INACTIVE
      : BannerStatus.ACTIVE;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="md:flex">
        {/* Banner Image */}
        <div className="md:w-1/3 relative">
          <div className="aspect-video md:aspect-auto md:h-full bg-gray-200 relative overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-pulse flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            )}
            {!imageError ? (
              <NextImage
                src={banner.image_url}
                alt={banner.title}
                fill
                className="object-cover"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Image not available</p>
                </div>
              </div>
            )}

            {/* Status overlay */}
            <div className="absolute top-3 right-3">
              <Badge className={getBannerStatusColor(banner.status)}>
                {getStatusIcon(banner.status)}
                <span className="ml-1">{banner.status}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Banner Content */}
        <div className="md:w-2/3 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {banner.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {truncateDescription(banner.description)}
              </p>
            </div>
          </div>

          {/* Banner Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Created</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(banner.created_at)}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Last Updated</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(banner.updated_at)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(banner)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}

              {onToggleStatus && canToggleStatus(banner.status) && (
                <Button
                  variant={
                    banner.status === BannerStatus.ACTIVE
                      ? "outline"
                      : "default"
                  }
                  size="sm"
                  onClick={() =>
                    onToggleStatus({
                      ...banner,
                      status: getNextStatus(banner.status),
                    })
                  }
                  className="flex items-center gap-2"
                >
                  {banner.status === BannerStatus.ACTIVE ? (
                    <>
                      <XCircle className="h-4 w-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Activate
                    </>
                  )}
                </Button>
              )}

              {onViewDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(banner)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Eye className="h-4 w-4" />
                  Details
                </Button>
              )}
            </div>

            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(banner)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export const BannerList: React.FC<BannerListProps> = ({
  banners,
  loading = false,
  onEdit,
  onDelete,
  onViewDetails,
  onToggleStatus,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <div className="aspect-video md:aspect-auto md:h-48 bg-gray-200 animate-pulse"></div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="animate-pulse">
                  <div className="w-3/4 h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="w-full h-4 bg-gray-200 rounded"></div>
                    <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
                    <div className="w-4/6 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                      <div className="w-32 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      <div className="w-32 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex gap-2">
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                      <div className="w-20 h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <Card className="p-12 text-center">
        <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Banners Found
        </h3>
        <p className="text-gray-600 mb-4">
          You haven&apos;t created any promotional banners yet. Create
          eye-catching banners to promote your restaurant.
        </p>
        <Button>
          <ImageIcon className="h-4 w-4 mr-2" />
          Create Your First Banner
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {banners.map((banner) => (
        <BannerItem
          key={banner.id}
          banner={banner}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};
