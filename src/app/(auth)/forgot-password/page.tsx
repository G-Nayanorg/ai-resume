import React from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Forgot password?</h2>
          <p className="mt-2 text-sm text-slate-500">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Reset password
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/80">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
