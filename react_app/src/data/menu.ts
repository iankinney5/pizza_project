/**
 * Menu data for TMSE Pizza
 * Based on "Mom and Pop's" menu items and the TMSE Pizza theme
 */

import { Pizza, Beverage, Topping } from '../types';

/** 
 * Available toppings - 8 distinct toppings as per requirements
 * Price is per topping added to pizza
 */
export const TOPPINGS: Topping[] = [
  { id: 'pepperoni', name: 'Pepperoni', price: 1.50 },
  { id: 'sausage', name: 'Italian Sausage', price: 1.50 },
  { id: 'mushrooms', name: 'Fresh Mushrooms', price: 1.25 },
  { id: 'onions', name: 'Onions', price: 1.00 },
  { id: 'bell-peppers', name: 'Bell Peppers', price: 1.00 },
  { id: 'olives', name: 'Black Olives', price: 1.25 },
  { id: 'bacon', name: 'Crispy Bacon', price: 1.75 },
  { id: 'extra-cheese', name: 'Extra Cheese', price: 1.50 },
];

/**
 * Specialty Pizzas - Pre-configured pizzas from the menu
 * Base prices shown are for Personal size
 */
export const PIZZAS: Pizza[] = [
  {
    id: 'cowabunga-classic',
    name: 'Cowabunga Classic',
    description: 'Our signature cheese pizza with premium mozzarella and our secret sauce blend',
    basePrice: 8.99,
    isSpecialty: true,
    defaultToppings: ['extra-cheese'],
  },
  {
    id: 'splinters-wisdom',
    name: "Splinter's Wisdom",
    description: 'A veggie lover\'s dream with mushrooms, onions, bell peppers, and olives',
    basePrice: 10.99,
    isSpecialty: true,
    defaultToppings: ['mushrooms', 'onions', 'bell-peppers', 'olives'],
  },
  {
    id: 'shredder-supreme',
    name: 'Shredder Supreme',
    description: 'Loaded with pepperoni, sausage, bacon, and extra cheese - a meat lover\'s feast',
    basePrice: 12.99,
    isSpecialty: true,
    defaultToppings: ['pepperoni', 'sausage', 'bacon', 'extra-cheese'],
  },
  {
    id: 'ninja-chicken',
    name: 'Ninja Chicken Combo',
    description: 'Grilled chicken with bell peppers, onions, and a drizzle of BBQ sauce',
    basePrice: 11.99,
    isSpecialty: true,
    defaultToppings: ['bell-peppers', 'onions'],
  },
  {
    id: 'pepperoni-party',
    name: 'Pepperoni Party',
    description: 'Double pepperoni for the pepperoni enthusiast',
    basePrice: 9.99,
    isSpecialty: true,
    defaultToppings: ['pepperoni'],
  },
  {
    id: 'build-your-own',
    name: 'Build Your Own',
    description: 'Start with our classic cheese and add up to 4 toppings of your choice',
    basePrice: 7.99,
    isSpecialty: false,
    defaultToppings: [],
  },
];

/**
 * Beverages - 5 distinct beverages with 3 sizes as per requirements
 */
export const BEVERAGES: Beverage[] = [
  {
    id: 'mutant-ooze',
    name: 'Mutant Ooze',
    description: 'Our signature green lemon-lime soda',
    prices: { small: 1.99, medium: 2.49, large: 2.99 },
  },
  {
    id: 'shell-shock-cola',
    name: 'Shell Shock Cola',
    description: 'Classic cola with a kick',
    prices: { small: 1.99, medium: 2.49, large: 2.99 },
  },
  {
    id: 'sewer-sweet-tea',
    name: 'Sewer Sweet Tea',
    description: 'Southern-style sweet iced tea',
    prices: { small: 1.79, medium: 2.29, large: 2.79 },
  },
  {
    id: 'ninja-water',
    name: 'Ninja Water',
    description: 'Pure refreshing bottled water',
    prices: { small: 1.49, medium: 1.99, large: 2.49 },
  },
  {
    id: 'master-lemonade',
    name: "Master's Lemonade",
    description: 'Fresh-squeezed lemonade made daily',
    prices: { small: 2.29, medium: 2.79, large: 3.29 },
  },
];

/**
 * Get a topping by ID
 */
export function getToppingById(id: string): Topping | undefined {
  return TOPPINGS.find(t => t.id === id);
}

/**
 * Get a pizza by ID
 */
export function getPizzaById(id: string): Pizza | undefined {
  return PIZZAS.find(p => p.id === id);
}

/**
 * Get a beverage by ID
 */
export function getBeverageById(id: string): Beverage | undefined {
  return BEVERAGES.find(b => b.id === id);
}

/**
 * Calculate toppings total price
 */
export function calculateToppingsPrice(toppingIds: string[]): number {
  return toppingIds.reduce((total, id) => {
    const topping = getToppingById(id);
    return total + (topping?.price || 0);
  }, 0);
}

