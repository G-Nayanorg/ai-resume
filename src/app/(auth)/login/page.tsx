import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">ATS</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-slate-500">
          Welcome back! Please enter your details.
        </p>
      </div>
      
      <form className="mt-8 space-y-6">
        <div className="space-y-4">
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
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <Link href="/forgot-password" title="Forgot password?" className="text-sm font-medium text-primary hover:text-primary/80">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
            Remember me
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Sign in
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/contact" className="font-medium text-primary hover:text-primary/80">
          Contact sales
        </Link>
      </div>
    </div>
  );
}
