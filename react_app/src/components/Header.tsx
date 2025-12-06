'use client';

/**
 * Header component with navigation
 * Includes logo, menu links, and cart button
 * Shows different navigation based on user role
 */

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { itemCount } = useCart();
  const { user, logout, isAdmin, isDriver, isCustomer } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-b-transparent" style={{ borderImage: 'linear-gradient(90deg, #dc2626, #f59e0b, #16a34a) 1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition group">
            <span className="text-4xl group-hover:scale-110 transition-transform">🍕</span>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                TMSE Pizza
              </h1>
              <p className="text-xs text-gray-500">Mom &amp; Pop&apos;s Since 2025</p>
            </div>
          </Link>

          {/* Navigation - Different for each role */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Admin Navigation */}
            {isAdmin && (
              <Link 
                href="/admin" 
                className="font-medium text-purple-600 hover:text-purple-700 transition flex items-center gap-1"
              >
                <span>🥷</span> Dashboard
              </Link>
            )}

            {/* Driver Navigation */}
            {isDriver && (
              <Link 
                href="/driver" 
                className="font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
              >
                <span>🚗</span> My Deliveries
              </Link>
            )}

            {/* Customer Navigation (or when not logged in) */}
            {(!user || isCustomer) && (
              <>
                <Link 
                  href="/menu" 
                  className="font-medium text-gray-700 hover:text-red-600 transition relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-red-500 after:to-yellow-500 hover:after:w-full after:transition-all"
                >
                  Menu
                </Link>
                <Link 
                  href="/build" 
                  className="font-medium text-gray-700 hover:text-red-600 transition relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-red-500 after:to-yellow-500 hover:after:w-full after:transition-all"
                >
                  Build Your Own
                </Link>
                {isCustomer && (
                  <Link 
                    href="/orders" 
                    className="font-medium text-gray-700 hover:text-red-600 transition relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-red-500 after:to-yellow-500 hover:after:w-full after:transition-all"
                  >
                    My Orders
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right side - Auth & Cart */}
          <div className="flex items-center gap-4">
            {/* User section */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm text-gray-600">
                  {isAdmin && <span className="text-purple-600">🥷 </span>}
                  {isDriver && <span className="text-blue-600">🚗 </span>}
                  {isCustomer && <span className="text-green-600">🐢 </span>}
                  Hi, <span className="font-semibold text-red-600">{user.firstName}</span>!
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="font-medium text-gray-700 hover:text-red-600 transition"
              >
                Login
              </Link>
            )}

            {/* Cart button - Only show for customers or not logged in */}
            {(!user || isCustomer) && (
              <Link
                href="/cart"
                className="relative bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 transition-all p-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="badge">{itemCount}</span>
                )}
              </Link>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
