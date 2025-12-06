'use client';

/**
 * Orders Page - View order history
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByCustomerId } from '../../lib/storage';
import { Order } from '../../types';

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/orders');
    } else if (user) {
      const userOrders = getOrdersByCustomerId(user.id);
      // Sort by date, newest first
      userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(userOrders);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'preparing':
        return '👨‍🍳';
      case 'ready':
        return '✅';
      case 'delivered':
        return '🎉';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            Order History
          </span>
          <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-12 text-center border border-yellow-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-5xl">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">
              You haven&apos;t placed any orders yet. Start by browsing our delicious menu!
            </p>
            <Link href="/menu" className="btn btn-primary text-lg px-8 py-4">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderDate = new Date(order.createdAt);
              const formattedDate = orderDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const formattedTime = orderDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });

              return (
                <Link
                  key={order.id}
                  href={`/order-confirmation/${order.id}`}
                  className="block bg-white rounded-2xl p-6 border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        order.orderType === 'delivery' 
                          ? 'bg-gradient-to-br from-blue-100 to-blue-200' 
                          : 'bg-gradient-to-br from-yellow-100 to-orange-100'
                      }`}>
                        <span className="text-2xl">
                          {order.orderType === 'delivery' ? '🚗' : '🏪'}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">Order #{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">
                          {formattedDate} at {formattedTime}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div className="text-sm text-gray-600 mb-4">
                    {order.items.map((item, index) => (
                      <span key={item.id}>
                        {item.quantity}× {item.name}
                        {index < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 capitalize">
                      {order.orderType} • {order.paymentMethod === 'credit' ? 'Credit Card' : order.paymentMethod}
                    </div>
                    <div className="text-xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
