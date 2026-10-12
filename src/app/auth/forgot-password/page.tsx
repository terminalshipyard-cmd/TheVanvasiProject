"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || "Unable to send reset instructions.");
      }
    } catch {
      setError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FBF9F5] text-[#1C241E] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-3">
            <img
              src="/images/6.png"
              alt="The Vanvasi Project"
              className="h-10 mx-auto rounded-md"
            />
          </Link>
          <h1 className="text-2xl font-bold text-[#1F3A2B]">Forgot Password</h1>
          <p className="text-xs text-gray-500 mt-1">
            Enter your email address and we will send you a reset link
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {message ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md text-xs text-green-800">
              <p className="font-semibold text-sm mb-1">Check Your Inbox</p>
              <p>{message}</p>
            </div>
            <Link
              href="/auth/signin"
              className="inline-block w-full text-center bg-[#1F3A2B] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#162a1f]"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F3A2B]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1F3A2B] hover:bg-[#162a1f] text-white font-medium py-2.5 rounded-md text-sm transition shadow-sm disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          Remembered your password?{" "}
          <Link
            href="/auth/signin"
            className="text-[#1F3A2B] font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
