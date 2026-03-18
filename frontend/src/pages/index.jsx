// ============================================
// HOME PAGE
// Landing page
// ============================================

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Task Management System
        </h1>
        <p className="text-xl text-blue-100 mb-8">
          Organize your projects and tasks efficiently
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-800"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
