'use client';

/**
 * Authentication Context for managing user login state
 * Provides auth operations throughout the application
 * Supports customers, admins, and drivers
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Customer, Admin, Driver } from '../types';
import { 
  getCurrentUser, 
  setCurrentUser, 
  authenticateUser, 
  createCustomer,
  getUserByEmail,
  initializeStorage 
} from '../lib/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isDriver: boolean;
  isCustomer: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (customerData: Omit<Customer, 'id' | 'createdAt' | 'role'>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize storage and load current user on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeStorage();
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const authenticatedUser = authenticateUser(email, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      setCurrentUser(authenticatedUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  const register = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'role'>): Promise<{ success: boolean; error?: string }> => {
    // Check if email already exists
    const existingUser = getUserByEmail(customerData.email);
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' };
    }

    try {
      const newCustomer = createCustomer(customerData);
      setUser(newCustomer);
      setCurrentUser(newCustomer);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to create account' };
    }
  };

  const isAdmin = user?.role === 'admin';
  const isDriver = user?.role === 'driver';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAdmin,
      isDriver,
      isCustomer,
      login, 
      logout, 
      register 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
