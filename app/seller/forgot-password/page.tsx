"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth";
import { useAuth } from "@/contexts/AuthContext";
import { FirebaseError } from "firebase/app";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getFirebaseErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
      case "auth/user-not-found":
        return "Không tìm thấy tài khoản với email này.";
      case "auth/invalid-email":
        return "Email không hợp lệ.";
      case "auth/too-many-requests":
        return "Quá nhiều lần thử. Vui lòng thử lại sau.";
      default:
        return "Đã có lỗi xảy ra. Vui lòng thử lại.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
      toast.success("Email khôi phục mật khẩu đã được gửi!");
    } catch (err) {
      const errorMessage =
        err instanceof FirebaseError
          ? getFirebaseErrorMessage(err)
          : "Đã có lỗi xảy ra. Vui lòng thử lại.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle="Nhập email của bạn để nhận liên kết đặt lại mật khẩu"
      leftPanelContent={{
        title: "Khôi phục tài khoản",
        description:
          "Chúng tôi sẽ gửi email hướng dẫn đặt lại mật khẩu cho bạn",
        stats: [
          {
            value: "2 phút",
            label: "Thời gian xử lý",
          },
          {
            value: "Bảo mật",
            label: "An toàn tuyệt đối",
          },
          {
            value: "24/7",
            label: "Hỗ trợ khách hàng",
          },
        ],
      }}
    >
      {success ? (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Email đã được gửi!
            </h3>
            <p className="text-sm text-green-600 mb-4">
              Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến{" "}
              <strong>{email}</strong>
            </p>
            <p className="text-xs text-gray-600">
              Vui lòng kiểm tra hộp thư đến hoặc thư rác của bạn.
            </p>
          </div>

          {/* Back to Login */}
          <Button
            onClick={() => router.push("/seller/login")}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium"
          >
            Quay lại đăng nhập
          </Button>

          {/* Resend Email */}
          <div className="text-center">
            <button
              onClick={() => setSuccess(false)}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Chưa nhận được email? Gửi lại
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-red-400 mr-2 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Địa chỉ Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seller@qtifood.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              required
              autoFocus
            />
            <p className="text-xs text-gray-500">
              Nhập email bạn đã đăng ký tài khoản
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang gửi email...
              </div>
            ) : (
              "Gửi email khôi phục"
            )}
          </Button>

          {/* BACK TO LOGIN */}
          <Link
            href="/seller/login"
            className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
