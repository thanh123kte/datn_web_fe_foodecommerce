"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VoucherDetailModal } from "@/components/admin/promotion";
import { Voucher } from "@/types/promotion";
import { voucherService } from "@/lib/services/voucherService";
import { toast } from "sonner";

export default function CreateSellerVoucherPage() {
  const router = useRouter();
  const [showModal] = useState(true);

  const handleVoucherSave = async (newVoucher: Voucher) => {
    try {
      // Get store_id from localStorage
      const storeId = localStorage.getItem("store_id");
      if (!storeId) {
        toast.error("Không tìm thấy thông tin cửa hàng");
        return;
      }

      const storeIdNum = parseInt(storeId);

      // Add store_id and set is_created_by_admin to false
      const voucherData = {
        ...newVoucher,
        store_id: storeIdNum,
        is_created_by_admin: false,
      };

      await voucherService.createVoucher(voucherData);
      toast.success("Tạo voucher thành công!");
      router.push("/seller/vouchers");
    } catch (error) {
      console.error("Error creating voucher:", error);
      toast.error("Không thể tạo voucher. Vui lòng thử lại!");
    }
  };

  const handleClose = () => {
    router.push("/seller/vouchers");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link href="/seller/vouchers" className="hover:text-blue-600">
              Voucher
            </Link>
            <span>›</span>
            <span>Tạo Mới</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Tạo Voucher Mới</h1>
          <p className="text-gray-600 mt-1">
            Điền thông tin để tạo voucher giảm giá cho cửa hàng của bạn
          </p>
        </div>
        <Link href="/seller/vouchers">
          <Button variant="outline">Quay Lại</Button>
        </Link>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">
          Hướng Dẫn Tạo Voucher
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Sử dụng mã voucher rõ ràng, dễ nhớ (ví dụ: SAVE20, WELCOME10)
          </li>
          <li>• Đặt giá trị đơn hàng tối thiểu phù hợp để đảm bảo lợi nhuận</li>
          <li>• Xem xét giới hạn sử dụng dựa trên ngân sách marketing</li>
          <li>• Kiểm tra kỹ ngày bắt đầu và kết thúc để tránh xung đột</li>
          <li>• Test voucher trước khi kích hoạt</li>
        </ul>
      </div>

      {/* Tips for Different Discount Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">
            Giảm Giá Theo Phần Trăm
          </h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Tốt nhất cho khách hàng mới (ví dụ: giảm 20% đơn đầu)</li>
            <li>• Đặt giới hạn giảm tối đa để kiểm soát chi phí</li>
            <li>• Hiệu quả cho các chương trình khuyến mãi theo mùa</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">
            Giảm Giá Cố Định
          </h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Tuyệt vời để khuyến khích đơn hàng lớn hơn</li>
            <li>• Dễ dàng tính toán tác động đến lợi nhuận</li>
            <li>• Hoạt động tốt với yêu cầu giá trị đơn hàng tối thiểu</li>
          </ul>
        </div>
      </div>

      {/* Quick Creation Templates */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Mẫu Nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="p-3 bg-white rounded border text-left hover:border-blue-500 transition-colors">
            <div className="font-medium">Đơn Đầu Tiên</div>
            <div className="text-sm text-gray-600">Giảm 20%, tối thiểu 25k</div>
          </button>
          <button className="p-3 bg-white rounded border text-left hover:border-blue-500 transition-colors">
            <div className="font-medium">Miễn Phí Giao Hàng</div>
            <div className="text-sm text-gray-600">Giảm 5k, tối thiểu 30k</div>
          </button>
          <button className="p-3 bg-white rounded border text-left hover:border-blue-500 transition-colors">
            <div className="font-medium">Cuối Tuần Đặc Biệt</div>
            <div className="text-sm text-gray-600">Giảm 15%, tối thiểu 20k</div>
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
        isSeller={true}
      />
    </div>
  );
}
