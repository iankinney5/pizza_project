'use client';

/**
 * Login Page
 * Allows users to sign in to their account
 * Supports customer, admin, and driver logins
 */

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, isAdmin, isDriver } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.push('/admin');
      } else if (isDriver) {
        router.push('/driver');
      } else {
        router.push(redirect);
      }
    }
  }, [user, isAdmin, isDriver, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    // Redirect is handled by useEffect
    
    setIsLoading(false);
  };

  const fillCredentials = (emailVal: string, passwordVal: string) => {
    setEmail(emailVal);
    setPassword(passwordVal);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">🍕</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-gray-600 mt-2">Sign in to your TMSE Pizza account</p>
      </div>

      {/* Demo Credentials */}
      <div className="space-y-3 mb-6">
        {/* Customer Credentials */}
        <div 
          onClick={() => fillCredentials('leo@tmse.com', 'password123')}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
                <span>🐢</span> Customer Login
              </p>
              <p className="text-xs text-green-700">leo@tmse.com / password123</p>
            </div>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Click to fill</span>
          </div>
        </div>

        {/* Admin Credentials */}
        <div 
          onClick={() => fillCredentials('admin@tmse.com', 'admin123')}
          className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                <span>🥷</span> Admin Login
              </p>
              <p className="text-xs text-purple-700">admin@tmse.com / admin123</p>
            </div>
            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">Click to fill</span>
          </div>
        </div>

        {/* Driver Credentials */}
        <div 
          onClick={() => fillCredentials('driver@tmse.com', 'driver123')}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                <span>🚗</span> Driver Login
              </p>
              <p className="text-xs text-blue-700">driver@tmse.com / driver123</p>
            </div>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Click to fill</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="checkbox-custom mr-2" />
            <span className="text-sm text-gray-600">Keep me signed in</span>
          </label>
          <a href="#" className="text-sm text-red-600 hover:text-red-700 font-medium">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full text-lg py-4 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Register Link */}
      <p className="text-center mt-6 text-gray-600">
        Don&apos;t have an account?{' '}
        <Link
          href={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
          className="text-red-600 hover:text-red-700 font-semibold"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

function LoginLoading() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
        <span className="text-4xl">🍕</span>
      </div>
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 py-16">
      <div className="max-w-md mx-auto px-4">
        <Suspense fallback={<LoginLoading />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
