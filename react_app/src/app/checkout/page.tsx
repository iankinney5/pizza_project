'use client';

/**
 * Checkout Page
 * Process payment and complete order
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../lib/storage';
import { PaymentMethod, OrderType } from '../../types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    } else if (items.length === 0) {
      router.push('/cart');
    } else {
      // Pre-fill delivery address from user profile
      setDeliveryAddress(`${user.address}, ${user.city}, ${user.state} ${user.zipCode}`);
    }
  }, [user, items, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create order
    const order = createOrder({
      customerId: user.id,
      customerName: `${user.firstName} ${user.lastName}`,
      items: items,
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      subtotal,
      tax,
      total,
      paymentMethod,
      specialInstructions: specialInstructions || undefined,
    });

    // Clear cart and redirect to confirmation
    clearCart();
    router.push(`/order-confirmation/${order.id}`);
  };

  if (!user || items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Type */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Type</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      orderType === 'pickup'
                        ? 'border-red-500 bg-white shadow-lg ring-2 ring-red-100'
                        : 'border-gray-200 bg-white hover:border-red-200'
                    }`}
                  >
                    <div className="text-3xl mb-2">🏪</div>
                    <div className="font-bold text-gray-900">Pickup</div>
                    <div className="text-sm text-gray-500">Ready in ~20 min</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      orderType === 'delivery'
                        ? 'border-red-500 bg-white shadow-lg ring-2 ring-red-100'
                        : 'border-gray-200 bg-white hover:border-red-200'
                    }`}
                  >
                    <div className="text-3xl mb-2">🚗</div>
                    <div className="font-bold text-gray-900">Delivery</div>
                    <div className="text-sm text-gray-500">~30-45 min</div>
                  </button>
                </div>

                {/* Delivery Address */}
                {orderType === 'delivery' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'credit'
                        ? 'border-red-500 bg-white shadow-lg ring-2 ring-red-100'
                        : 'border-gray-200 bg-white hover:border-red-200'
                    }`}
                  >
                    <div className="text-2xl mb-2">💳</div>
                    <div className="font-bold text-sm text-gray-900">Credit Card</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-red-500 bg-white shadow-lg ring-2 ring-red-100'
                        : 'border-gray-200 bg-white hover:border-red-200'
                    }`}
                  >
                    <div className="text-2xl mb-2">💵</div>
                    <div className="font-bold text-sm text-gray-900">Cash</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('check')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'check'
                        ? 'border-red-500 bg-white shadow-lg ring-2 ring-red-100'
                        : 'border-gray-200 bg-white hover:border-red-200'
                    }`}
                  >
                    <div className="text-2xl mb-2">📝</div>
                    <div className="font-bold text-sm text-gray-900">Check</div>
                  </button>
                </div>

                {/* Credit Card Form (simulated) */}
                {paymentMethod === 'credit' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="1234 5678 9012 3456"
                        defaultValue="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="MM/YY"
                          defaultValue="12/25"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="123"
                          defaultValue="123"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                      💡 This is a demo - no real payment will be processed
                    </p>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Special Instructions <span className="text-sm font-normal text-gray-500">(Optional)</span>
                </h2>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="input h-24 resize-none"
                  placeholder="Any special requests for your order..."
                />
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}× {item.name}
                      </span>
                      <span className="font-medium text-gray-900">${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-primary w-full text-lg py-4 mt-6 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Processing...
                    </>
                  ) : (
                    `Place Order - $${total.toFixed(2)}`
                  )}
                </button>

                <Link
                  href="/cart"
                  className="block text-center text-red-600 hover:text-red-700 font-medium mt-4"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
