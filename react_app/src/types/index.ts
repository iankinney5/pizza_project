/**
 * Type definitions for the TMSE Pizza Ordering System
 * These types define the data structures used throughout the application
 */

/** Pizza size options - 4 distinct sizes as per requirements */
export type PizzaSize = 'personal' | 'small' | 'medium' | 'large';

/** Crust type options - 3 crust options as per requirements */
export type CrustType = 'hand-tossed' | 'thin-ninja' | 'deep-dish';

/** Beverage size options - 3 distinct sizes as per requirements */
export type BeverageSize = 'small' | 'medium' | 'large';

/** Payment method options */
export type PaymentMethod = 'cash' | 'credit' | 'check';

/** Order type - pickup or delivery */
export type OrderType = 'pickup' | 'delivery';

/** Order status tracking */
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';

/** User role types */
export type UserRole = 'customer' | 'admin' | 'driver';

/** Topping definition - 8 distinct toppings as per requirements */
export interface Topping {
  id: string;
  name: string;
  price: number;
}

/** Pizza item structure */
export interface Pizza {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  isSpecialty: boolean;
  defaultToppings?: string[];
}

/** Beverage item structure */
export interface Beverage {
  id: string;
  name: string;
  description: string;
  prices: {
    small: number;
    medium: number;
    large: number;
  };
  imageUrl?: string;
}

/** Cart item for pizza */
export interface CartPizza {
  id: string;
  type: 'pizza';
  pizzaId: string;
  name: string;
  size: PizzaSize;
  crust: CrustType;
  toppings: string[];
  specialInstructions?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/** Cart item for beverage */
export interface CartBeverage {
  id: string;
  type: 'beverage';
  beverageId: string;
  name: string;
  size: BeverageSize;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/** Union type for any cart item */
export type CartItem = CartPizza | CartBeverage;

/** Base user information */
export interface BaseUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

/** Customer information */
export interface Customer extends BaseUser {
  role: 'customer';
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

/** Admin information */
export interface Admin extends BaseUser {
  role: 'admin';
}

/** Driver information */
export interface Driver extends BaseUser {
  role: 'driver';
  isAvailable: boolean;
  currentDeliveryId?: string;
}

/** Union type for any user */
export type User = Customer | Admin | Driver;

/** Order structure */
export interface Order {
  id: string;
  orderNumber: number;
  customerId: string;
  customerName: string;
  items: CartItem[];
  orderType: OrderType;
  deliveryAddress?: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  specialInstructions?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
}

/** Price configuration for sizes */
export const PIZZA_SIZE_PRICES: Record<PizzaSize, number> = {
  personal: 0,
  small: 2,
  medium: 4,
  large: 6,
};

export const PIZZA_SIZE_LABELS: Record<PizzaSize, string> = {
  personal: 'Personal (8")',
  small: 'Small (10")',
  medium: 'Medium (12")',
  large: 'Large (16")',
};

export const CRUST_LABELS: Record<CrustType, string> = {
  'hand-tossed': 'Hand-Tossed',
  'thin-ninja': 'Thin Ninja Style',
  'deep-dish': 'Deep Dish',
};

export const BEVERAGE_SIZE_LABELS: Record<BeverageSize, string> = {
  small: 'Small (12 oz)',
  medium: 'Medium (20 oz)',
  large: 'Large (32 oz)',
};

/** Tax rate (8% as per system design document) */
export const TAX_RATE = 0.08;
