'use client';

/**
 * Cart Page - Shows all items in cart with ability to modify quantities
 * Displays subtotal, tax, and total
 */

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getToppingById } from '../../data/menu';
import {
  PIZZA_SIZE_LABELS,
  CRUST_LABELS,
  BEVERAGE_SIZE_LABELS,
  CartPizza,
  CartBeverage,
} from '../../types';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, tax, total, clearCart } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">🛒</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-xl text-gray-600 mb-8">
            Looks like you haven&apos;t added any delicious pizza yet!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu" className="btn btn-primary text-lg px-8 py-4">
              Browse Menu
            </Link>
            <Link href="/build" className="btn btn-green text-lg px-8 py-4">
              🐢 Build Your Own
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-red-200 transition-colors">
                <div className="flex gap-4">
                  {/* Item Icon */}
                  <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
                    item.type === 'pizza' 
                      ? 'bg-gradient-to-br from-yellow-100 to-orange-100' 
                      : 'bg-gradient-to-br from-red-100 to-pink-100'
                  }`}>
                    <span className="text-4xl">
                      {item.type === 'pizza' ? '🍕' : '🥤'}
                    </span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                        {item.type === 'pizza' && (
                          <div className="text-sm text-gray-600">
                            <p>
                              {PIZZA_SIZE_LABELS[(item as CartPizza).size]} • {CRUST_LABELS[(item as CartPizza).crust]}
                            </p>
                            {(item as CartPizza).toppings.length > 0 && (
                              <p className="text-gray-500">
                                Toppings: {(item as CartPizza).toppings.map(t => getToppingById(t)?.name).join(', ')}
                              </p>
                            )}
                            {(item as CartPizza).specialInstructions && (
                              <p className="text-gray-500 italic">
                                Notes: {(item as CartPizza).specialInstructions}
                              </p>
                            )}
                          </div>
                        )}
                        {item.type === 'beverage' && (
                          <p className="text-sm text-gray-600">
                            {BEVERAGE_SIZE_LABELS[(item as CartBeverage).size]}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1"
                        title="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          −
                        </button>
                        <span className="text-lg font-bold w-8 text-center text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                          ${item.totalPrice.toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-gray-500">
                            ${item.unitPrice.toFixed(2)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition"
            >
              Clear entire cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Items Count */}
              <div className="text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                {items.reduce((sum, item) => sum + item.quantity, 0)} items in cart
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-6 space-y-3">
                {user ? (
                  <Link
                    href="/checkout"
                    className="btn btn-primary w-full text-lg py-4"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login?redirect=/checkout"
                      className="btn btn-primary w-full text-lg py-4"
                    >
                      Login to Checkout
                    </Link>
                    <p className="text-sm text-gray-500 text-center">
                      or{' '}
                      <Link href="/register?redirect=/checkout" className="text-red-600 hover:underline font-medium">
                        create an account
                      </Link>
                    </p>
                  </>
                )}
              </div>

              {/* Continue Shopping */}
              <Link
                href="/menu"
                className="block text-center text-red-600 hover:text-red-700 font-medium mt-4"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
