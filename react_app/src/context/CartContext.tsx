'use client';

/**
 * Cart Context for managing shopping cart state
 * Provides cart operations throughout the application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartPizza, CartBeverage, TAX_RATE } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tmse_pizza_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart:', e);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      // Check if similar item exists (same pizza/beverage with same options)
      const existingIndex = prev.findIndex(i => {
        if (i.type !== item.type) return false;
        if (i.type === 'pizza' && item.type === 'pizza') {
          return (
            i.pizzaId === item.pizzaId &&
            i.size === item.size &&
            i.crust === item.crust &&
            JSON.stringify(i.toppings.sort()) === JSON.stringify(item.toppings.sort())
          );
        }
        if (i.type === 'beverage' && item.type === 'beverage') {
          return i.beverageId === item.beverageId && i.size === item.size;
        }
        return false;
      });

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
          totalPrice: (updated[existingIndex].quantity + item.quantity) * updated[existingIndex].unitPrice,
        };
        return updated;
      }

      // Add new item
      return [...prev, item];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

