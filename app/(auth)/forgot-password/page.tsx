
"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement Supabase password reset
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h2>
        <p className="text-slate-500 text-sm mt-2">Enter your email to receive reset instructions</p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">mark_email_read</span>
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-semibold">Check your email</p>
            <p className="text-slate-500 text-sm mt-1">We've sent a password reset link to your email.</p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="text-primary font-bold text-sm hover:underline"
          >
            Try another email
          </button>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Remember your password?{" "}
        <Link href="/login" className="font-bold text-primary hover:text-red-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
