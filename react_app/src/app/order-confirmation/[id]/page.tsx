'use client';

/**
 * Order Confirmation / Receipt Page
 * Displays order details after successful payment
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getOrderById } from '../../../lib/storage';
import { getToppingById } from '../../../data/menu';
import { Order, CartPizza, PIZZA_SIZE_LABELS, CRUST_LABELS, BEVERAGE_SIZE_LABELS, CartBeverage } from '../../../types';

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const foundOrder = getOrderById(params.id as string);
      setOrder(foundOrder || null);
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <span className="text-5xl">😕</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find this order. It may have been removed or the link is invalid.
          </p>
          <Link href="/" className="btn btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
  const formattedTime = orderDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-red-500 via-red-500 to-yellow-500 text-white rounded-t-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)`
            }}></div>
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-white/90">
              Thank you for your order, {order.customerName.split(' ')[0]}!
            </p>
          </div>
        </div>

        {/* Receipt */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 border border-gray-100">
          {/* Receipt Header */}
          <div className="text-center border-b border-gray-200 pb-6 mb-6">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🍕</span>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
              TMSE Pizza
            </h2>
            <p className="text-gray-500 text-sm">123 Address Way, Atlanta, GA</p>
            <p className="text-gray-500 text-sm">(404) 555-1293</p>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm bg-gray-50 rounded-xl p-4">
            <div>
              <span className="text-gray-500">Order #:</span>
              <span className="font-bold text-gray-900 ml-2">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-gray-500">Date:</span>
              <span className="font-medium text-gray-900 ml-2">{formattedDate}</span>
            </div>
            <div>
              <span className="text-gray-500">Time:</span>
              <span className="font-medium text-gray-900 ml-2">{formattedTime}</span>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>
              <span className="font-medium text-gray-900 ml-2 capitalize">{order.orderType}</span>
            </div>
          </div>

          {/* Delivery Address */}
          {order.orderType === 'delivery' && order.deliveryAddress && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <div className="text-sm text-gray-500 mb-1">Delivering to:</div>
              <div className="font-medium text-gray-900">{order.deliveryAddress}</div>
            </div>
          )}

          {/* Order Items */}
          <div className="border-t border-b border-gray-200 py-4 mb-4">
            <h3 className="font-bold text-gray-900 mb-4">Items:</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.quantity}× {item.name}
                    </div>
                    {item.type === 'pizza' && (
                      <div className="text-sm text-gray-500">
                        {PIZZA_SIZE_LABELS[(item as CartPizza).size]} • {CRUST_LABELS[(item as CartPizza).crust]}
                        {(item as CartPizza).toppings.length > 0 && (
                          <div>
                            Toppings: {(item as CartPizza).toppings.map(t => getToppingById(t)?.name).join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                    {item.type === 'beverage' && (
                      <div className="text-sm text-gray-500">
                        {BEVERAGE_SIZE_LABELS[(item as CartBeverage).size]}
                      </div>
                    )}
                  </div>
                  <div className="font-medium text-gray-900">${item.totalPrice.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (8%):</span>
              <span className="text-gray-900">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-900">Total:</span>
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-medium text-gray-900 capitalize">
                {order.paymentMethod === 'credit' ? 'Credit Card' : order.paymentMethod}
              </span>
            </div>
            {order.paymentMethod === 'credit' && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Card:</span>
                <span className="font-medium text-gray-900">Visa ending in 4242</span>
              </div>
            )}
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-100">
              <div className="text-sm text-gray-500 mb-1">Special Instructions:</div>
              <div className="text-sm text-gray-900">{order.specialInstructions}</div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-6">
            <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full mb-4">
              🐢 Cowabunga! Thank you for supporting local business!
            </div>
            <p>
              Estimated {order.orderType === 'pickup' ? 'ready time' : 'delivery'}: ~
              {order.orderType === 'pickup' ? '20' : '30-45'} minutes
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <Link
              href="/orders"
              className="btn btn-primary w-full"
            >
              View All Orders
            </Link>
            <Link
              href="/menu"
              className="btn btn-outline w-full"
            >
              Order More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
