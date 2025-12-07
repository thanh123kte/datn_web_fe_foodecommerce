"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { FirebaseError } from "firebase/app";
import { Shield, Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const { signIn, loading } = useAuth();

  // Kiểm tra phiên đăng nhập - tự động redirect nếu đã đăng nhập
  const { isChecking } = useAuthRedirect({
    requiredRole: "ADMIN",
    redirectTo: "/admin/dashboard",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hiển thị loading trong khi kiểm tra phiên đăng nhập
  if (isChecking) {
    return (
      <div
        className="relative min-h-screen w-full flex flex-col items-center justify-center p-4"
        style={{
          background:
            "linear-gradient(to bottom right, #1a1a2e, #16213e, #0f3460)",
        }}
      >
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang kiểm tra phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  const getFirebaseErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
      case "auth/user-not-found":
        return "Không tìm thấy tài khoản với email này.";
      case "auth/wrong-password":
        return "Mật khẩu không đúng.";
      case "auth/invalid-email":
        return "Email không hợp lệ.";
      case "auth/user-disabled":
        return "Tài khoản này đã bị khóa.";
      case "auth/too-many-requests":
        return "Quá nhiều lần thử. Vui lòng thử lại sau.";
      case "auth/invalid-credential":
        return "Thông tin đăng nhập không hợp lệ.";
      default:
        return "Đã có lỗi xảy ra. Vui lòng thử lại.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      await signIn({ email, password }, "ADMIN");
      toast.success("Đăng nhập thành công!");
      router.push("/admin/dashboard");
    } catch (err) {
      const errorMessage =
        err instanceof FirebaseError
          ? getFirebaseErrorMessage(err)
          : "Đã có lỗi xảy ra. Vui lòng thử lại.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom right, #1a1a2e, #16213e, #0f3460)",
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        // style={{
        //   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        // }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Login card */}
      <div className="relative z-10 flex w-full max-w-md flex-col gap-8 rounded-2xl p-8 md:p-10 bg-gray-900/80 backdrop-blur-xl border border-orange-500/20 shadow-2xl shadow-orange-500/10">
        {/* Logo & Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-orange-500">
            <Shield className="w-10 h-10" strokeWidth={1.5} />
            <span className="text-2xl font-bold tracking-wider text-white">
              QTI FOOD
            </span>
          </div>
          <h1
            className="text-white tracking-wider text-3xl font-bold text-center"
            style={{ textShadow: "0 0 20px rgba(249, 115, 22, 0.3)" }}
          >
            ADMIN CONTROL PANEL
          </h1>
          <p className="text-gray-400 text-sm text-center">
            Quản lý và giám sát hệ thống
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500/60" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 rounded-lg bg-gray-800/50 border border-orange-500/30 text-white pl-12 pr-4 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500/60" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 rounded-lg bg-gray-800/50 border border-orange-500/30 text-white pl-12 pr-12 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/admin/forgot-password"
              className="text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold uppercase tracking-widest hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Authenticating...
              </div>
            ) : (
              "Access System"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-500 text-xs text-center px-4">
          Unauthorized access will be traced and reported. All activities are
          monitored.
        </p>
      </div>
    </div>
  );
}
