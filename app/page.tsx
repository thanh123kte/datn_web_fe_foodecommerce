import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Q</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">QtiFood</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-600">
              Bạn là người bán hàng?{" "}
              <span
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Đăng nhập tại đây
              </span>
            </div>
            <Link href="/seller/login">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Chào mừng đến với <span className="text-orange-500">QtiFood</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Nền tảng đặt món ăn trực tuyến hàng đầu - Kết nối bạn với hàng ngàn
            nhà hàng và món ăn ngon nhất trong thành phố
          </p>
          <Link href="/seller/login">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-4 h-auto"
            >
              Bắt đầu bán hàng ngay
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg
                className="w-8 h-8 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Đa dạng món ăn
            </h3>
            <p className="text-gray-600 text-center">
              Hàng ngàn món ăn từ các nhà hàng uy tín, từ món Việt truyền thống
              đến ẩm thực quốc tế
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Giao hàng nhanh
            </h3>
            <p className="text-gray-600 text-center">
              Đội ngũ shipper chuyên nghiệp, giao hàng nhanh chóng trong vòng 30
              phút
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Đảm bảo chất lượng
            </h3>
            <p className="text-gray-600 text-center">
              Kiểm soát chất lượng nghiêm ngặt, đảm bảo thực phẩm an toàn và
              tươi ngon
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">
                500+
              </div>
              <div className="text-gray-600">Nhà hàng đối tác</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">10K+</div>
              <div className="text-gray-600">Khách hàng hài lòng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500 mb-2">50K+</div>
              <div className="text-gray-600">Đơn hàng thành công</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng bắt đầu kinh doanh cùng QtiFood?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Tham gia cùng hàng trăm đối tác đã thành công với QtiFood
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/seller/login">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-orange-500 border-white hover:bg-gray-100 text-lg px-8 py-4 h-auto"
              >
                Đăng nhập bán hàng
              </Button>
            </Link>
            <Link href="/seller/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 h-auto"
              >
                Tìm hiểu thêm
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Q</span>
                </div>
                <h3 className="text-xl font-bold">QtiFood</h3>
              </div>
              <p className="text-gray-400">
                Nền tảng đặt món ăn trực tuyến hàng đầu Việt Nam
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Dịch vụ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Đặt món trực tuyến</li>
                <li>Giao hàng tận nơi</li>
                <li>Thanh toán linh hoạt</li>
                <li>Hỗ trợ 24/7</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Đối tác</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Đăng ký bán hàng</li>
                <li>Quản lý cửa hàng</li>
                <li>Báo cáo doanh thu</li>
                <li>Hỗ trợ marketing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Hotline: 1900-1234</li>
                <li>Email: support@qtifood.vn</li>
                <li>Địa chỉ: Hà Nội, Việt Nam</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QtiFood. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
