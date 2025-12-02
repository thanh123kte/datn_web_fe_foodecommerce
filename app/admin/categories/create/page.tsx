"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CategoryFormModal from "@/components/categories/CategoryFormModal";
import { Category } from "@/types/category";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);

  const handleCategorySave = async (formData: any) => {
    const newCategory: Category = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      image_url: formData.image || undefined,
      is_active: formData.status === "active",
      products_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // TODO: Call API to create new category
    console.log("Creating new category:", newCategory);

    // Redirect back to categories page after successful creation
    router.push("/admin/categories");
  };

  const handleClose = () => {
    router.push("/admin/categories");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link href="/admin/categories" className="hover:text-blue-600">
              Categories
            </Link>
            <span>›</span>
            <span>Create New</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Category
          </h1>
          <p className="text-gray-600 mt-1">
            Add a new product category to organize your inventory
          </p>
        </div>
        <Link href="/admin/categories">
          <Button variant="outline">Back to Categories</Button>
        </Link>
      </div>

      {/* Category Creation Guidelines */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">
          Category Creation Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">
              Naming Best Practices
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • Use clear, descriptive names (e.g., "Vietnamese Noodle Soups")
              </li>
              <li>• Avoid overly generic names like "Food" or "Items"</li>
              <li>• Consider customer search behavior</li>
              <li>• Keep names concise but informative</li>
              <li>• Use consistent naming conventions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">
              Organization Tips
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Group related products together</li>
              <li>
                • Create categories based on cuisine type or meal category
              </li>
              <li>• Consider customer browsing patterns</li>
              <li>• Plan for future product additions</li>
              <li>• Balance specificity with broad appeal</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Popular Category Examples */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">
          Popular Category Examples
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border hover:border-blue-500 transition-colors">
            <div className="w-full h-20 bg-gradient-to-r from-red-100 to-red-200 rounded mb-3 flex items-center justify-center">
              <span className="text-2xl">🍜</span>
            </div>
            <div className="font-medium">Noodle Soups</div>
            <div className="text-sm text-gray-600">
              Pho, Bun Bo Hue, Mi Quang
            </div>
            <div className="text-xs text-green-600 mt-1">
              High demand category
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border hover:border-blue-500 transition-colors">
            <div className="w-full h-20 bg-gradient-to-r from-green-100 to-green-200 rounded mb-3 flex items-center justify-center">
              <span className="text-2xl">🍚</span>
            </div>
            <div className="font-medium">Rice Dishes</div>
            <div className="text-sm text-gray-600">
              Com tam, Com suon, Clay pot rice
            </div>
            <div className="text-xs text-green-600 mt-1">Staple category</div>
          </div>

          <div className="bg-white p-4 rounded-lg border hover:border-blue-500 transition-colors">
            <div className="w-full h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded mb-3 flex items-center justify-center">
              <span className="text-2xl">🥖</span>
            </div>
            <div className="font-medium">Street Food</div>
            <div className="text-sm text-gray-600">
              Banh Mi, Spring rolls, Pancakes
            </div>
            <div className="text-xs text-orange-600 mt-1">Popular snacks</div>
          </div>
        </div>
      </div>

      {/* Image Guidelines */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="font-semibold text-green-900 mb-4">
          Category Image Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-800 mb-2">
              Technical Requirements
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Recommended size: 400x300 pixels or higher</li>
              <li>• Use high-quality, clear images</li>
              <li>• Supported formats: JPG, PNG, WebP</li>
              <li>• Optimize for web to ensure fast loading</li>
              <li>• Consider mobile viewing experience</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-green-800 mb-2">
              Content Guidelines
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Show representative dishes from the category</li>
              <li>• Use appetizing, well-lit food photography</li>
              <li>• Avoid cluttered or busy backgrounds</li>
              <li>• Maintain consistent visual style across categories</li>
              <li>• Consider cultural authenticity and accuracy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Free Image Resources */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-4">
          Free Image Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a
            href="https://unsplash.com/s/photos/vietnamese-food"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded border hover:border-yellow-500 transition-colors text-center"
          >
            <div className="font-medium text-yellow-800">Unsplash</div>
            <div className="text-sm text-yellow-600">
              Vietnamese food photos
            </div>
          </a>
          <a
            href="https://www.pexels.com/search/vietnamese%20cuisine/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded border hover:border-yellow-500 transition-colors text-center"
          >
            <div className="font-medium text-yellow-800">Pexels</div>
            <div className="text-sm text-yellow-600">Asian cuisine images</div>
          </a>
          <a
            href="https://pixabay.com/images/search/vietnamese%20food/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded border hover:border-yellow-500 transition-colors text-center"
          >
            <div className="font-medium text-yellow-800">Pixabay</div>
            <div className="text-sm text-yellow-600">Free food imagery</div>
          </a>
          <a
            href="https://www.freepik.com/search?format=search&query=vietnamese%20food"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded border hover:border-yellow-500 transition-colors text-center"
          >
            <div className="font-medium text-yellow-800">Freepik</div>
            <div className="text-sm text-yellow-600">Professional photos</div>
          </a>
        </div>
      </div>

      {/* SEO and Marketing Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
          <h4 className="font-semibold text-pink-900 mb-2">
            SEO Considerations
          </h4>
          <ul className="text-sm text-pink-800 space-y-1">
            <li>• Include relevant keywords in category names</li>
            <li>• Write detailed, keyword-rich descriptions</li>
            <li>• Consider local search terms and preferences</li>
            <li>• Use alt text for category images</li>
          </ul>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-indigo-900 mb-2">
            Marketing Benefits
          </h4>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• Well-organized categories improve user experience</li>
            <li>• Clear categorization increases conversion rates</li>
            <li>• Easier for customers to find what they want</li>
            <li>• Better analytics and inventory management</li>
          </ul>
        </div>
      </div>

      {/* Create Modal */}
      <CategoryFormModal
        isOpen={showModal}
        onClose={handleClose}
        onSubmit={handleCategorySave}
      />
    </div>
  );
}
