"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VoucherDetailModal } from "@/components/admin/promotion";
import { Voucher, DiscountType, DiscountStatus } from "@/types/promotion";

export default function CreateVoucherPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);

  const handleVoucherSave = async (newVoucher: Voucher) => {
    // TODO: Call API to create new voucher
    console.log("Creating new voucher:", newVoucher);

    // Redirect back to vouchers page after successful creation
    router.push("/admin/promotions/vouchers");
  };

  const handleClose = () => {
    router.push("/admin/promotions/vouchers");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link
              href="/admin/promotions/vouchers"
              className="hover:text-blue-600"
            >
              Vouchers
            </Link>
            <span>›</span>
            <span>Create New</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Voucher
          </h1>
          <p className="text-gray-600 mt-1">
            Fill in the details to create a new discount voucher
          </p>
        </div>
        <Link href="/admin/promotions/vouchers">
          <Button variant="outline">Back to Vouchers</Button>
        </Link>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">
          Voucher Creation Guidelines
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Use clear, memorable voucher codes (e.g., SAVE20, WELCOME10)
          </li>
          <li>
            • Set appropriate minimum order values to ensure profitability
          </li>
          <li>• Consider usage limits based on your marketing budget</li>
          <li>• Review start and end dates carefully to avoid conflicts</li>
          <li>• Test vouchers before making them active</li>
        </ul>
      </div>

      {/* Tips for Different Discount Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">
            Percentage Discounts
          </h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Best for first-time customers (e.g., 20% off first order)</li>
            <li>• Set maximum discount limits to control costs</li>
            <li>• Effective for seasonal promotions</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">
            Fixed Amount Discounts
          </h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Great for encouraging larger orders</li>
            <li>• Easier to calculate impact on profits</li>
            <li>• Works well with minimum order requirements</li>
          </ul>
        </div>
      </div>

      {/* Quick Creation Templates */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="p-3 bg-white rounded border text-left hover:border-blue-500 transition-colors">
            <div className="font-medium">First Order</div>
            <div className="text-sm text-gray-600">20% off, $25 minimum</div>
          </button>
          <button className="p-3 bg-white rounded border text-left hover:border-blue-500 transition-colors">
            <div className="font-medium">Free Delivery</div>
            <div className="text-sm text-gray-600">$5 off, $30 minimum</div>
          </button>
          <button className="p-3 bg-white rounded border text-left hover:border-blue-500 transition-colors">
            <div className="font-medium">Weekend Special</div>
            <div className="text-sm text-gray-600">15% off, $20 minimum</div>
          </button>
        </div>
      </div>

      {/* Create Modal */}
      <VoucherDetailModal
        voucher={null}
        isOpen={showModal}
        onClose={handleClose}
        onSave={handleVoucherSave}
        isCreateMode={true}
      />
    </div>
  );
}
