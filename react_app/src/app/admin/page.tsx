'use client';

/**
 * Admin Dashboard
 * View and manage all orders, update statuses, assign drivers
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  getOrders, 
  getDrivers, 
  updateOrderStatus, 
  assignDriverToOrder,
  getAvailableDrivers 
} from '../../lib/storage';
import { Order, Driver, OrderStatus } from '../../types';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/login');
    } else if (isAdmin) {
      refreshData();
    }
  }, [isAdmin, isLoading, router]);

  const refreshData = () => {
    const allOrders = getOrders();
    allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(allOrders);
    setDrivers(getDrivers());
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    refreshData();
    showToast(`Order status updated to ${newStatus}`);
  };

  const handleAssignDriver = (orderId: string, driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      assignDriverToOrder(orderId, driverId, `${driver.firstName} ${driver.lastName}`);
      refreshData();
      showToast(`Driver ${driver.firstName} assigned to order`);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ready': return 'bg-green-100 text-green-800 border-green-300';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  // Stats
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;
  const todayRevenue = orders
    .filter(o => {
      const today = new Date().toDateString();
      return new Date(o.createdAt).toDateString() === today && o.status !== 'cancelled';
    })
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🥷</span>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Welcome, Master {user?.lastName}! Manage orders and operations.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👨‍🍳</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Preparing</p>
                <p className="text-2xl font-bold text-gray-900">{preparingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ready</p>
                <p className="text-2xl font-bold text-gray-900">{readyCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Today&apos;s Revenue</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                  ${todayRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Drivers Status */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🚗 Driver Status</h2>
          <div className="flex flex-wrap gap-3">
            {drivers.map(driver => (
              <div 
                key={driver.id}
                className={`px-4 py-2 rounded-lg border ${
                  driver.isAvailable 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-orange-50 border-orange-200 text-orange-800'
                }`}
              >
                <span className="font-medium">{driver.firstName} {driver.lastName}</span>
                <span className="ml-2 text-sm">
                  {driver.isAvailable ? '✓ Available' : '🚗 On Delivery'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as typeof filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                {status !== 'all' && (
                  <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {orders.filter(o => o.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">#{order.orderNumber}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      {order.orderType === 'delivery' && (
                        <div className="text-xs text-gray-500 max-w-[200px] truncate">
                          {order.deliveryAddress}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.orderType === 'delivery' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.orderType === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">${order.total.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.replace('-', ' ')}
                      </span>
                      {order.assignedDriverName && (
                        <div className="text-xs text-gray-500 mt-1">
                          Driver: {order.assignedDriverName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {/* Status Actions */}
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'preparing')}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'ready')}
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && order.orderType === 'delivery' && !order.assignedDriverId && (
                          <select
                            onChange={(e) => handleAssignDriver(order.id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-lg text-xs"
                            defaultValue=""
                          >
                            <option value="" disabled>Assign Driver</option>
                            {getAvailableDrivers().map(d => (
                              <option key={d.id} value={d.id}>
                                {d.firstName} {d.lastName}
                              </option>
                            ))}
                          </select>
                        )}
                        {order.status === 'ready' && order.orderType === 'pickup' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                            className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600"
                          >
                            Picked Up
                          </button>
                        )}
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

