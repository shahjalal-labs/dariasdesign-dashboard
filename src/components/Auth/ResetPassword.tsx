"use client";

import type React from "react";


import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import AuthLayout from "./AuthLayout";
import { useResetPasswordMutation } from "@/redux/api/authApi";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [resetPasswordFn] = useResetPasswordMutation();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPasswordFn(newPassword).unwrap();
      if (response.success) {
        toast.success("Password reset successfully");
        router.push("/login");
      }
    } catch {
      setError("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="">
      <div className="min-h-screen flex items-center justify-center  px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-bold mb-2 text-title">
            Input the new password
          </h2>

          <form onSubmit={handleResetPassword}>
            {/* New Password */}
            <div className="mb-4 relative">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary pr-10"
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary pr-10"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-2 rounded-full mt-4 hover:bg-primary/80 transition"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
