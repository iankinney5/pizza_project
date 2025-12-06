'use client';

/**
 * Menu Page - Displays all pizzas and beverages
 * Shows pricing and allows adding items to cart
 */

import React, { useState } from 'react';
import { PIZZAS, BEVERAGES, TOPPINGS, getToppingById } from '../../data/menu';
import { useCart } from '../../context/CartContext';
import { 
  PizzaSize, 
  CrustType, 
  BeverageSize, 
  CartPizza, 
  CartBeverage,
  PIZZA_SIZE_PRICES,
  PIZZA_SIZE_LABELS,
  CRUST_LABELS,
  BEVERAGE_SIZE_LABELS
} from '../../types';

export default function MenuPage() {
  const { addItem } = useCart();
  const [toast, setToast] = useState<string | null>(null);
  
  // Pizza customization state
  const [pizzaSize, setPizzaSize] = useState<PizzaSize>('medium');
  const [pizzaCrust, setPizzaCrust] = useState<CrustType>('hand-tossed');
  
  // Beverage customization state
  const [beverageSize, setBeverageSize] = useState<BeverageSize>('medium');

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddPizza = (pizzaId: string) => {
    const pizza = PIZZAS.find(p => p.id === pizzaId);
    if (!pizza) return;

    const sizePrice = PIZZA_SIZE_PRICES[pizzaSize];
    const toppingsPrice = (pizza.defaultToppings || []).reduce((sum, tId) => {
      const topping = getToppingById(tId);
      return sum + (topping?.price || 0);
    }, 0);
    const unitPrice = pizza.basePrice + sizePrice + toppingsPrice;

    const cartItem: CartPizza = {
      id: `pizza-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'pizza',
      pizzaId: pizza.id,
      name: pizza.name,
      size: pizzaSize,
      crust: pizzaCrust,
      toppings: pizza.defaultToppings || [],
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
    };

    addItem(cartItem);
    showToast(`${pizza.name} added to cart!`);
  };

  const handleAddBeverage = (beverageId: string) => {
    const beverage = BEVERAGES.find(b => b.id === beverageId);
    if (!beverage) return;

    const unitPrice = beverage.prices[beverageSize];

    const cartItem: CartBeverage = {
      id: `bev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'beverage',
      beverageId: beverage.id,
      name: beverage.name,
      size: beverageSize,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
    };

    addItem(cartItem);
    showToast(`${beverage.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            Delicious Options
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-xl text-gray-600">
            Fresh ingredients, family recipes, unforgettable taste
          </p>
        </div>

        {/* Pizzas Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl">🍕</span> 
            Pizzas
          </h2>
          
          {/* Size & Crust Selection */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 mb-6 border border-orange-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(PIZZA_SIZE_LABELS) as PizzaSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setPizzaSize(size)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        pizzaSize === size
                          ? 'border-red-500 bg-white shadow-md ring-2 ring-red-100'
                          : 'border-gray-200 bg-white hover:border-red-200'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{PIZZA_SIZE_LABELS[size]}</div>
                      <div className="text-sm text-gray-500">
                        {size === 'personal' ? 'Base price' : <span className="text-red-600 font-medium">+${PIZZA_SIZE_PRICES[size].toFixed(2)}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Crust
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(CRUST_LABELS) as CrustType[]).map((crust) => (
                    <button
                      key={crust}
                      onClick={() => setPizzaCrust(crust)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        pizzaCrust === crust
                          ? 'border-red-500 bg-white shadow-md ring-2 ring-red-100'
                          : 'border-gray-200 bg-white hover:border-red-200'
                      }`}
                    >
                      <span className="font-medium text-gray-900">{CRUST_LABELS[crust]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pizza Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PIZZAS.map((pizza) => {
              const sizePrice = PIZZA_SIZE_PRICES[pizzaSize];
              const toppingsPrice = (pizza.defaultToppings || []).reduce((sum, tId) => {
                const topping = getToppingById(tId);
                return sum + (topping?.price || 0);
              }, 0);
              const totalPrice = pizza.basePrice + sizePrice + toppingsPrice;

              return (
                <div key={pizza.id} className="card group">
                  <div className="h-40 pizza-card-gradient flex items-center justify-center relative overflow-hidden">
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">🍕</span>
                    {pizza.isSpecialty && (
                      <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Specialty
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">{pizza.name}</h3>
                    <p className="text-gray-600 text-sm mt-1 mb-3">{pizza.description}</p>
                    
                    {pizza.defaultToppings && pizza.defaultToppings.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Includes: </span>
                        <span className="text-xs text-gray-700 font-medium">
                          {pizza.defaultToppings.map(t => getToppingById(t)?.name).join(', ')}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                          ${totalPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 block">
                          {PIZZA_SIZE_LABELS[pizzaSize]}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddPizza(pizza.id)}
                        className="btn btn-primary"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Beverages Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-red-400 to-red-500 p-2 rounded-xl">🥤</span>
            Beverages
          </h2>

          {/* Size Selection */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 mb-6 border border-red-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Size
            </label>
            <div className="flex gap-4">
              {(Object.keys(BEVERAGE_SIZE_LABELS) as BeverageSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setBeverageSize(size)}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                    beverageSize === size
                      ? 'border-red-500 bg-white shadow-md ring-2 ring-red-100'
                      : 'border-gray-200 bg-white hover:border-red-200'
                  }`}
                >
                  <span className="font-medium text-gray-900">{BEVERAGE_SIZE_LABELS[size]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Beverage Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BEVERAGES.map((beverage) => (
              <div key={beverage.id} className="card group">
                <div className="h-32 beverage-card-gradient flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🥤</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{beverage.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{beverage.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                        ${beverage.prices[beverageSize].toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 block">
                        {BEVERAGE_SIZE_LABELS[beverageSize]}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddBeverage(beverage.id)}
                      className="btn btn-primary"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
