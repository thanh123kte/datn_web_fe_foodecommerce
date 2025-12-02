"use client";

import { useState } from "react";
import { testAccount } from "@/lib/mockData/sellers";

export default function TestAccountsInfo() {
  const [isVisible, setIsVisible] = useState(false);

  if (process.env.NODE_ENV === "production") {
    return null; // Hide in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
      >
        🧪 Test Accounts
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border shadow-xl rounded-lg p-4 w-64">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Tài khoản Test</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <div className="font-mono text-blue-600 bg-blue-50 p-1 rounded mt-1">
                {testAccount.email}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Mật khẩu:</span>
              <div className="font-mono text-green-600 bg-green-50 p-1 rounded mt-1">
                {testAccount.password}
              </div>
            </div>
            <div className="text-xs text-gray-500 pt-2">
              💡 Form đã được điền sẵn
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
