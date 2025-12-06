'use client';

/**
 * Build Your Own Pizza Page
 * Custom pizza builder with size, crust, and toppings selection
 * Allows up to 4 toppings as per requirements
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TOPPINGS, getPizzaById, getToppingById, calculateToppingsPrice } from '../../data/menu';
import { useCart } from '../../context/CartContext';
import PizzaPreview from '../../components/PizzaPreview';
import {
  PizzaSize,
  CrustType,
  CartPizza,
  PIZZA_SIZE_PRICES,
  PIZZA_SIZE_LABELS,
  CRUST_LABELS,
} from '../../types';

const MAX_TOPPINGS = 4;
const BASE_PIZZA_PRICE = 7.99; // Build Your Own base price

export default function BuildPizzaPage() {
  const router = useRouter();
  const { addItem } = useCart();
  
  const [size, setSize] = useState<PizzaSize>('medium');
  const [crust, setCrust] = useState<CrustType>('hand-tossed');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleTopping = (toppingId: string) => {
    if (selectedToppings.includes(toppingId)) {
      setSelectedToppings(prev => prev.filter(t => t !== toppingId));
    } else if (selectedToppings.length < MAX_TOPPINGS) {
      setSelectedToppings(prev => [...prev, toppingId]);
    } else {
      showToast(`Maximum ${MAX_TOPPINGS} toppings allowed!`);
    }
  };

  // Calculate total price
  const sizePrice = PIZZA_SIZE_PRICES[size];
  const toppingsPrice = calculateToppingsPrice(selectedToppings);
  const unitPrice = BASE_PIZZA_PRICE + sizePrice + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const cartItem: CartPizza = {
      id: `pizza-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'pizza',
      pizzaId: 'build-your-own',
      name: 'Build Your Own',
      size,
      crust,
      toppings: selectedToppings,
      specialInstructions: specialInstructions || undefined,
      quantity,
      unitPrice,
      totalPrice,
    };

    addItem(cartItem);
    showToast('Custom pizza added to cart!');
    
    // Reset form
    setSelectedToppings([]);
    setSpecialInstructions('');
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            🐢 Turtle Power!
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Build Your Own Pizza
          </h1>
          <p className="text-xl text-gray-600">
            Create your perfect pizza with up to {MAX_TOPPINGS} toppings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Builder Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Size Selection */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Choose Your Size
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(PIZZA_SIZE_LABELS) as PizzaSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      size === s
                        ? 'border-red-500 bg-white shadow-lg ring-2 ring-red-100'
                        : 'border-gray-200 bg-white hover:border-red-200'
                    }`}
                  >
                    <div className="font-bold text-gray-900">{PIZZA_SIZE_LABELS[s]}</div>
                    <div className="text-sm text-gray-500">
                      {s === 'personal' ? 'Starting at $7.99' : <span className="text-red-600 font-medium">+${PIZZA_SIZE_PRICES[s].toFixed(2)}</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Crust Selection */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Choose Your Crust
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(Object.keys(CRUST_LABELS) as CrustType[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCrust(c)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      crust === c
                        ? 'border-red-500 bg-white shadow-lg ring-2 ring-red-100'
                        : 'border-gray-200 bg-white hover:border-red-200'
                    }`}
                  >
                    <div className="font-bold text-gray-900">{CRUST_LABELS[c]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Toppings Selection */}
            <div className="bg-gradient-to-br from-red-50 to-yellow-50 rounded-2xl p-6 border border-red-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Select Your Toppings
                </h2>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  selectedToppings.length >= MAX_TOPPINGS 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedToppings.length}/{MAX_TOPPINGS} selected
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TOPPINGS.map((topping) => {
                  const isSelected = selectedToppings.includes(topping.id);
                  const isDisabled = !isSelected && selectedToppings.length >= MAX_TOPPINGS;
                  
                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping.id)}
                      disabled={isDisabled}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-100'
                          : isDisabled
                          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 bg-white hover:border-red-200'
                      }`}
                    >
                      <div className={`font-medium ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>
                        {topping.name}
                      </div>
                      <div className={`text-sm ${isSelected ? 'text-green-600' : 'text-gray-500'}`}>
                        +${topping.price.toFixed(2)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                Special Instructions <span className="text-sm font-normal text-gray-500">(Optional)</span>
              </h2>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g., Extra crispy, light sauce, well done..."
                className="input h-24 resize-none"
                maxLength={200}
              />
              <p className="text-sm text-gray-500 mt-2">
                {specialInstructions.length}/200 characters
              </p>
            </div>
          </div>

          {/* Order Summary Sidebar with Pizza Preview */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Your Pizza</h2>
              
              {/* Live Pizza Preview */}
              <div className="mb-6 py-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex justify-center">
                <PizzaPreview 
                  size={size} 
                  crust={crust} 
                  toppings={selectedToppings} 
                />
              </div>

              {/* Selected Toppings */}
              {selectedToppings.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Toppings:</h3>
                  <ul className="space-y-1">
                    {selectedToppings.map((tId) => {
                      const topping = getToppingById(tId);
                      return (
                        <li key={tId} className="flex justify-between text-sm">
                          <span className="text-gray-700">• {topping?.name}</span>
                          <span className="text-gray-500">+${topping?.price.toFixed(2)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Base price:</span>
                  <span className="text-gray-900">${BASE_PIZZA_PRICE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Size upgrade:</span>
                  <span className="text-gray-900">+${sizePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Toppings ({selectedToppings.length}):</span>
                  <span className="text-gray-900">+${toppingsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Each:</span>
                  <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                    ${unitPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn"
                  >
                    −
                  </button>
                  <span className="text-xl font-bold w-8 text-center text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold text-xl mb-6 p-4 bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl border border-red-100">
                <span className="text-gray-900">Total:</span>
                <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="btn btn-primary w-full text-lg py-4"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          {toast.includes('Maximum') ? '⚠️' : '✓'} {toast}
        </div>
      )}
    </div>
  );
}
