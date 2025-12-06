'use client';

/**
 * Driver Dashboard
 * View assigned deliveries and update delivery status
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  getOrdersByDriverId, 
  completeDelivery,
  updateDriverAvailability,
  getUserById
} from '../../lib/storage';
import { Order, Driver } from '../../types';

export default function DriverDashboard() {
  const router = useRouter();
  const { user, isDriver, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [driverData, setDriverData] = useState<Driver | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isDriver) {
      router.push('/login');
    } else if (isDriver && user) {
      refreshData();
    }
  }, [isDriver, isLoading, user, router]);

  const refreshData = () => {
    if (user) {
      const driverOrders = getOrdersByDriverId(user.id);
      driverOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(driverOrders);
      
      const driver = getUserById(user.id) as Driver;
      setDriverData(driver);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCompleteDelivery = (orderId: string) => {
    if (user) {
      completeDelivery(orderId, user.id);
      refreshData();
      showToast('Delivery completed! Great job! 🎉');
    }
  };

  const toggleAvailability = () => {
    if (user && driverData) {
      updateDriverAvailability(user.id, !driverData.isAvailable);
      refreshData();
      showToast(driverData.isAvailable ? 'You are now offline' : 'You are now available for deliveries');
    }
  };

  if (isLoading || !isDriver) {
    return (
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  const activeDelivery = orders.find(o => o.status === 'out-for-delivery');
  const completedToday = orders.filter(o => {
    const today = new Date().toDateString();
    return o.status === 'delivered' && new Date(o.createdAt).toDateString() === today;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🚗</span>
                <h1 className="text-4xl font-bold text-gray-900">Driver Dashboard</h1>
              </div>
              <p className="text-gray-600">Hey {user?.firstName}! Ready to deliver some pizza?</p>
            </div>
            <button
              onClick={toggleAvailability}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                driverData?.isAvailable
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {driverData?.isAvailable ? '🟢 Available' : '🔴 Offline'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Delivery</p>
                <p className="text-2xl font-bold text-gray-900">{activeDelivery ? '1' : '0'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Delivery */}
        {activeDelivery && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white mb-8 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl animate-bounce">🚗</span>
              <h2 className="text-xl font-bold">Active Delivery</h2>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-2xl font-bold">Order #{activeDelivery.orderNumber}</div>
                  <div className="text-white/80">{activeDelivery.customerName}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${activeDelivery.total.toFixed(2)}</div>
                  <div className="text-white/80 capitalize">{activeDelivery.paymentMethod}</div>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-3 mt-3">
                <div className="text-sm text-white/80 mb-1">📍 Deliver to:</div>
                <div className="text-lg font-medium">{activeDelivery.deliveryAddress}</div>
              </div>
              
              <div className="border-t border-white/20 pt-3 mt-3">
                <div className="text-sm text-white/80 mb-1">📦 Items:</div>
                <div>
                  {activeDelivery.items.map(item => (
                    <div key={item.id} className="text-sm">
                      {item.quantity}× {item.name}
                    </div>
                  ))}
                </div>
              </div>
              
              {activeDelivery.specialInstructions && (
                <div className="border-t border-white/20 pt-3 mt-3">
                  <div className="text-sm text-white/80 mb-1">📝 Notes:</div>
                  <div className="text-sm italic">{activeDelivery.specialInstructions}</div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleCompleteDelivery(activeDelivery.id)}
              className="w-full py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all text-lg"
            >
              ✓ Complete Delivery
            </button>
          </div>
        )}

        {/* No Active Delivery */}
        {!activeDelivery && driverData?.isAvailable && (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center mb-8">
            <div className="text-6xl mb-4">🍕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Waiting for Orders</h2>
            <p className="text-gray-600">
              You&apos;re available and ready! New deliveries will appear here.
            </p>
          </div>
        )}

        {!activeDelivery && !driverData?.isAvailable && (
          <div className="bg-gray-100 rounded-2xl p-12 border border-gray-200 text-center mb-8">
            <div className="text-6xl mb-4 grayscale">🚗</div>
            <h2 className="text-2xl font-bold text-gray-500 mb-2">You&apos;re Offline</h2>
            <p className="text-gray-500">
              Toggle your status to &quot;Available&quot; to receive new deliveries.
            </p>
          </div>
        )}

        {/* Completed Deliveries */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Recent Deliveries</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {orders.filter(o => o.status === 'delivered').slice(0, 10).map(order => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">Order #{order.orderNumber}</div>
                  <div className="text-sm text-gray-500">{order.customerName}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">${order.total.toFixed(2)}</div>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    ✓ Delivered
                  </span>
                </div>
              </div>
            ))}
            {orders.filter(o => o.status === 'delivered').length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                No completed deliveries yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  );
}

