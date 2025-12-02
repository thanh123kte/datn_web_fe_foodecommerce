"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { FirebaseError } from "firebase/app";

interface LoginFormProps {
  submitButtonText?: string;
  signupLink?: {
    text: string;
    href: string;
  };
  redirectPath?: string;
}

export default function LoginForm({
  submitButtonText = "Đăng nhập",
  signupLink,
  redirectPath = "/",
}: LoginFormProps) {
  const router = useRouter();
  const { signIn, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@qtifood.com");
  const [password, setPassword] = useState("123456");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

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
      await signIn({ email, password });
      toast.success("Đăng nhập thành công!");
      router.push(redirectPath);
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
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Địa chỉ Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@qtifood.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12"
          required
        />
      </div>

      {/* PASSWORD */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Mật khẩu
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="123456"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {showPassword ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.414 1.414"
                />
              ) : (
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* REMEMBER + FORGOT */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
        </label>
        <Link
          href="#"
          className="text-sm text-orange-500 hover:text-orange-600 font-medium"
        >
          Quên mật khẩu?
        </Link>
      </div>

      {/* LOGIN BUTTON */}
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
            Đang đăng nhập...
          </div>
        ) : (
          submitButtonText
        )}
      </Button>

      {/* SIGNUP LINK */}
      {signupLink && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              href={signupLink.href}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              {signupLink.text}
            </Link>
          </p>
        </div>
      )}
    </form>
  );
}
