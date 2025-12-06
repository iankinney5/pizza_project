'use client';

/**
 * Register Page
 * Allows new users to create an account
 */

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, user } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'GA',
    zipCode: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, router, redirect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      password: formData.password,
    });

    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || 'Registration failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">🍕</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-600 mt-2">Join TMSE Pizza and start ordering!</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        {/* Contact Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              placeholder="404-555-1234"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input"
            placeholder="123 Main St"
            required
          />
        </div>

        {/* City, State, Zip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="col-span-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="input"
              placeholder="Atlanta"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="select"
              required
            >
              <option value="GA">GA</option>
              <option value="AL">AL</option>
              <option value="FL">FL</option>
              <option value="SC">SC</option>
              <option value="TN">TN</option>
            </select>
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="input"
              placeholder="30301"
              required
            />
          </div>
        </div>

        {/* Password Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="checkbox-custom mt-1"
          />
          <span className="text-sm text-gray-600">
            I agree to the{' '}
            <a href="#" className="text-red-600 hover:underline font-medium">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-red-600 hover:underline font-medium">Privacy Policy</a>
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full text-lg py-4 disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center mt-6 text-gray-600">
        Already have an account?{' '}
        <Link
          href={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
          className="text-red-600 hover:text-red-700 font-semibold"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

function RegisterLoading() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
        <span className="text-4xl">🍕</span>
      </div>
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Suspense fallback={<RegisterLoading />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
