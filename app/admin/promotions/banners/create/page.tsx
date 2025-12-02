"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BannerDetailModal } from "@/components/admin/promotion";
import { Banner } from "@/types/promotion";

export default function CreateBannerPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);

  const handleBannerSave = async (newBanner: Banner) => {
    // TODO: Call API to create new banner
    console.log("Creating new banner:", newBanner);

    // Redirect back to banners page after successful creation
    router.push("/admin/promotions/banners");
  };

  const handleClose = () => {
    router.push("/admin/promotions/banners");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link
              href="/admin/promotions/banners"
              className="hover:text-blue-600"
            >
              Banners
            </Link>
            <span>›</span>
            <span>Create New</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Banner
          </h1>
          <p className="text-gray-600 mt-1">
            Design and publish a new promotional banner
          </p>
        </div>
        <Link href="/admin/promotions/banners">
          <Button variant="outline">Back to Banners</Button>
        </Link>
      </div>

      {/* Banner Creation Guidelines */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">
          Banner Creation Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">
              Design Requirements
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Recommended size: 1200x400 pixels</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Supported formats: JPG, PNG, WebP</li>
              <li>• Use high-resolution images for clarity</li>
              <li>• Ensure mobile compatibility</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">
              Content Best Practices
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Keep text concise and impactful</li>
              <li>• Use contrasting colors for readability</li>
              <li>• Include clear call-to-action</li>
              <li>• Align with current promotions</li>
              <li>• Consider seasonal relevance</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Banner Templates */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">
          Popular Banner Themes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border hover:border-blue-500 transition-colors cursor-pointer">
            <div className="w-full h-24 bg-gradient-to-r from-red-400 to-red-600 rounded mb-3 flex items-center justify-center text-white font-bold">
              FLASH SALE
            </div>
            <div className="font-medium">Flash Sale Banner</div>
            <div className="text-sm text-gray-600">
              Limited time offers and urgent promotions
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border hover:border-blue-500 transition-colors cursor-pointer">
            <div className="w-full h-24 bg-gradient-to-r from-green-400 to-green-600 rounded mb-3 flex items-center justify-center text-white font-bold">
              FREE DELIVERY
            </div>
            <div className="font-medium">Delivery Promotion</div>
            <div className="text-sm text-gray-600">
              Free delivery and shipping offers
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border hover:border-blue-500 transition-colors cursor-pointer">
            <div className="w-full h-24 bg-gradient-to-r from-purple-400 to-purple-600 rounded mb-3 flex items-center justify-center text-white font-bold">
              NEW MENU
            </div>
            <div className="font-medium">Menu Launch</div>
            <div className="text-sm text-gray-600">
              New products and menu items
            </div>
          </div>
        </div>
      </div>

      {/* Image Resources */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="font-semibold text-green-900 mb-4">
          Free Image Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a
            href="https://unsplash.com/s/photos/food"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded border hover:border-green-500 transition-colors text-center"
          >
            <div className="font-medium text-green-800">Unsplash</div>
            <div className="text-sm text-green-600">Free food photography</div>
          </a>
          <a
            href="https://www.pexels.com/search/food/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded border hover:border-green-500 transition-colors text-center"
          >
            <div className="font-medium text-green-800">Pexels</div>
            <div className="text-sm text-green-600">High-quality images</div>
          </a>
          <a
            href="https://www.canva.com/templates/banners/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded border hover:border-green-500 transition-colors text-center"
          >
            <div className="font-medium text-green-800">Canva</div>
            <div className="text-sm text-green-600">Design templates</div>
          </a>
          <a
            href="https://www.figma.com/templates/banners/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded border hover:border-green-500 transition-colors text-center"
          >
            <div className="font-medium text-green-800">Figma</div>
            <div className="text-sm text-green-600">Professional designs</div>
          </a>
        </div>
      </div>

      {/* Design Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-2">
            Color Psychology
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Red: Creates urgency and appetite</li>
            <li>• Green: Suggests health and freshness</li>
            <li>• Blue: Builds trust and reliability</li>
            <li>• Orange: Stimulates enthusiasm</li>
          </ul>
        </div>

        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
          <h4 className="font-semibold text-pink-900 mb-2">Typography Tips</h4>
          <ul className="text-sm text-pink-800 space-y-1">
            <li>• Use bold fonts for main messages</li>
            <li>• Ensure contrast with background</li>
            <li>• Keep font sizes readable on mobile</li>
            <li>• Limit to 2-3 font variations</li>
          </ul>
        </div>
      </div>

      {/* Create Modal */}
      <BannerDetailModal
        banner={null}
        isOpen={showModal}
        onClose={handleClose}
        onSave={handleBannerSave}
        isCreateMode={true}
      />
    </div>
  );
}
