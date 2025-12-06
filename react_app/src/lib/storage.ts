/**
 * File-based storage system for TMSE Pizza
 * Simulates database storage using localStorage (client-side)
 * As per requirements: "customer records are to be stored in a file structure that will simulate the database"
 */

import { Customer, Admin, Driver, User, Order } from '../types';

const USERS_KEY = 'tmse_pizza_users';
const ORDERS_KEY = 'tmse_pizza_orders';
const ORDER_COUNTER_KEY = 'tmse_pizza_order_counter';
const CURRENT_USER_KEY = 'tmse_pizza_current_user';

// Legacy key for migration
const CUSTOMERS_KEY = 'tmse_pizza_customers';

/**
 * Initialize storage with default data if empty
 */
export function initializeStorage(): void {
  if (typeof window === 'undefined') return;
  
  // Initialize users if not exists
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers: User[] = [
      // Demo Customers
      {
        id: 'demo-customer-1',
        firstName: 'Leonardo',
        lastName: 'Turtle',
        phone: '404-555-1234',
        email: 'leo@tmse.com',
        address: '123 Sewer Lane',
        city: 'Atlanta',
        state: 'GA',
        zipCode: '30301',
        password: 'password123',
        role: 'customer',
        createdAt: new Date().toISOString(),
      } as Customer,
      {
        id: 'demo-customer-2',
        firstName: 'Michaelangelo',
        lastName: 'Turtle',
        phone: '404-555-5678',
        email: 'mikey@tmse.com',
        address: '456 Pizza Ave',
        city: 'Atlanta',
        state: 'GA',
        zipCode: '30302',
        password: 'cowabunga',
        role: 'customer',
        createdAt: new Date().toISOString(),
      } as Customer,
      // Demo Admin
      {
        id: 'demo-admin-1',
        firstName: 'Master',
        lastName: 'Splinter',
        phone: '404-555-0001',
        email: 'admin@tmse.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString(),
      } as Admin,
      // Demo Drivers
      {
        id: 'demo-driver-1',
        firstName: 'Raphael',
        lastName: 'Turtle',
        phone: '404-555-0002',
        email: 'driver@tmse.com',
        password: 'driver123',
        role: 'driver',
        isAvailable: true,
        createdAt: new Date().toISOString(),
      } as Driver,
      {
        id: 'demo-driver-2',
        firstName: 'Donatello',
        lastName: 'Turtle',
        phone: '404-555-0003',
        email: 'donnie@tmse.com',
        password: 'driver123',
        role: 'driver',
        isAvailable: true,
        createdAt: new Date().toISOString(),
      } as Driver,
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
  
  // Initialize orders if not exists
  if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
  }
  
  // Initialize order counter
  if (!localStorage.getItem(ORDER_COUNTER_KEY)) {
    localStorage.setItem(ORDER_COUNTER_KEY, '45827'); // Starting from sample order number
  }
}

// ============ User Functions ============

/**
 * Get all users from storage
 */
export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Get all customers from storage
 */
export function getCustomers(): Customer[] {
  return getUsers().filter((u): u is Customer => u.role === 'customer');
}

/**
 * Get all admins from storage
 */
export function getAdmins(): Admin[] {
  return getUsers().filter((u): u is Admin => u.role === 'admin');
}

/**
 * Get all drivers from storage
 */
export function getDrivers(): Driver[] {
  return getUsers().filter((u): u is Driver => u.role === 'driver');
}

/**
 * Get available drivers
 */
export function getAvailableDrivers(): Driver[] {
  return getDrivers().filter(d => d.isAvailable);
}

/**
 * Get a user by ID
 */
export function getUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.id === id);
}

/**
 * Get a customer by ID
 */
export function getCustomerById(id: string): Customer | undefined {
  const user = getUserById(id);
  return user?.role === 'customer' ? user as Customer : undefined;
}

/**
 * Get a user by email
 */
export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Get a customer by email (legacy support)
 */
export function getCustomerByEmail(email: string): Customer | undefined {
  const user = getUserByEmail(email);
  return user?.role === 'customer' ? user as Customer : undefined;
}

/**
 * Get a customer by phone number
 */
export function getCustomerByPhone(phone: string): Customer | undefined {
  const customers = getCustomers();
  return customers.find(c => c.phone === phone);
}

/**
 * Create a new customer
 */
export function createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'role'>): Customer {
  const users = getUsers();
  const newCustomer: Customer = {
    ...customerData,
    id: `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };
  users.push(newCustomer);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newCustomer;
}

/**
 * Update a user
 */
export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates } as User;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return users[index];
}

/**
 * Update a customer (legacy support)
 */
export function updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
  return updateUser(id, updates) as Customer | null;
}

/**
 * Update driver availability
 */
export function updateDriverAvailability(id: string, isAvailable: boolean): Driver | null {
  return updateUser(id, { isAvailable }) as Driver | null;
}

/**
 * Authenticate a user by email and password
 */
export function authenticateUser(email: string, password: string): User | null {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
}

/**
 * Authenticate a customer by email and password (legacy support)
 */
export function authenticateCustomer(email: string, password: string): Customer | null {
  const user = authenticateUser(email, password);
  return user?.role === 'customer' ? user as Customer : null;
}

// ============ Session Functions ============

/**
 * Set the current logged-in user
 */
export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

/**
 * Get the current logged-in user
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

// ============ Order Functions ============

/**
 * Get all orders from storage
 */
export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Get orders for a specific customer
 */
export function getOrdersByCustomerId(customerId: string): Order[] {
  const orders = getOrders();
  return orders.filter(o => o.customerId === customerId);
}

/**
 * Get orders assigned to a driver
 */
export function getOrdersByDriverId(driverId: string): Order[] {
  const orders = getOrders();
  return orders.filter(o => o.assignedDriverId === driverId);
}

/**
 * Get orders by status
 */
export function getOrdersByStatus(status: Order['status']): Order[] {
  const orders = getOrders();
  return orders.filter(o => o.status === status);
}

/**
 * Get delivery orders that need assignment
 */
export function getPendingDeliveryOrders(): Order[] {
  const orders = getOrders();
  return orders.filter(o => 
    o.orderType === 'delivery' && 
    o.status === 'ready' && 
    !o.assignedDriverId
  );
}

/**
 * Get an order by ID
 */
export function getOrderById(id: string): Order | undefined {
  const orders = getOrders();
  return orders.find(o => o.id === id);
}

/**
 * Get the next order number
 */
export function getNextOrderNumber(): number {
  if (typeof window === 'undefined') return 45828;
  const counter = parseInt(localStorage.getItem(ORDER_COUNTER_KEY) || '45827', 10);
  const nextNumber = counter + 1;
  localStorage.setItem(ORDER_COUNTER_KEY, nextNumber.toString());
  return nextNumber;
}

/**
 * Create a new order
 */
export function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...orderData,
    id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    orderNumber: getNextOrderNumber(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
}

/**
 * Update an order
 */
export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;
  
  orders[index] = { ...orders[index], ...updates };
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return orders[index];
}

/**
 * Update an order status
 */
export function updateOrderStatus(id: string, status: Order['status']): Order | null {
  return updateOrder(id, { status });
}

/**
 * Assign a driver to an order
 */
export function assignDriverToOrder(orderId: string, driverId: string, driverName: string): Order | null {
  const order = updateOrder(orderId, { 
    assignedDriverId: driverId, 
    assignedDriverName: driverName,
    status: 'out-for-delivery'
  });
  
  if (order) {
    // Mark driver as unavailable
    updateDriverAvailability(driverId, false);
  }
  
  return order;
}

/**
 * Complete a delivery
 */
export function completeDelivery(orderId: string, driverId: string): Order | null {
  const order = updateOrder(orderId, { status: 'delivered' });
  
  if (order) {
    // Mark driver as available again
    updateDriverAvailability(driverId, true);
  }
  
  return order;
}
