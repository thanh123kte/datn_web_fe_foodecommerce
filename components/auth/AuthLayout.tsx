import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  leftPanelContent?: {
    title: string;
    description: string;
    stats?: Array<{
      value: string;
      label: string;
    }>;
  };
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  leftPanelContent,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* LEFT PANEL */}
        {leftPanelContent && (
          <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-400 to-red-500 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
              {/* Logo */}
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-orange-500 font-bold text-xl">Q</span>
                </div>
              </div>

              {/* Content */}
              <h2 className="text-3xl font-bold mb-4 text-center">
                {leftPanelContent.title}
              </h2>
              <p className="text-xl text-center opacity-90 mb-8">
                {leftPanelContent.description}
              </p>

              {/* Stats */}
              {leftPanelContent.stats && (
                <div className="grid grid-cols-1 gap-4 text-center w-full max-w-xs">
                  {leftPanelContent.stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
                    >
                      <h3 className="font-semibold mb-1">{stat.value}</h3>
                      <p className="text-sm opacity-90">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RIGHT FORM */}
        <div
          className={`w-full ${
            leftPanelContent ? "lg:w-1/2" : ""
          } flex items-center justify-center p-8 sm:p-12 lg:p-16`}
        >
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Q</span>
                </div>
                <span className="text-xl font-bold text-gray-800">QtiFood</span>
              </Link>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-600">{subtitle}</p>
            </div>

            {/* Form Content */}
            {children}

            {/* Footer */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Về trang chủ
              </Link>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400 space-x-4">
              <Link href="#" className="hover:text-gray-600">
                Điều khoản dịch vụ
              </Link>
              <span>·</span>
              <Link href="#" className="hover:text-gray-600">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
