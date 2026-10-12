"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLoginMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/ReduxFunction";
import Cookies from "js-cookie";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [loginFn] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginFn({ email, password }).unwrap();
      if (response.success) {
        toast.success("Login successful");
        Cookies.set("token", response?.result?.accessToken);
        router.push("/admin/dashboard");
        dispatch(
          setUser({
            role: response.result.role,
            token: response.result.accessToken,
            email: email,
            me: response.result,
          }),
        );
      }
    } catch (err: any) {
      console.error("Login error", err);
      if (err?.data?.message) {
        toast.error(err.data.message);
        toast.error("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="" subtitle="">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 space-y-5">
          <h2 className="text-3xl font-bold  mb-6 text-title">Log in</h2>
          <p className="text-base text-description">
            Let’s login into your account first
          </p>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary text-black"
              />
            </div>

            {/* Password with Eye Button */}
            <div className="mb-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary text-black pr-10"
              />

              {/* Eye Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-4">
              <Link
                href="/forgot-password"
                className="text-base hover:underline text-primary"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-full hover:bg-primary/80 transition"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
