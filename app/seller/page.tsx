import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Q</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  QtiFood Seller
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost">Về trang chủ</Button>
              </Link>
              <Link href="/seller/login">
                <Button>Đăng nhập</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chào mừng đến với QtiFood Seller
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Quản lý cửa hàng và bán hàng trực tuyến dễ dàng
          </p>
          <Link href="/seller/login">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              Đăng nhập ngay
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Quản lý sản phẩm</h3>
            <p className="text-gray-600">Thêm, sửa, xóa sản phẩm dễ dàng</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Theo dõi đơn hàng</h3>
            <p className="text-gray-600">
              Quản lý đơn hàng theo thời gian thực
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Báo cáo doanh thu</h3>
            <p className="text-gray-600">Xem thống kê và báo cáo chi tiết</p>
          </div>
        </div>
      </main>
    </div>
  );
}
