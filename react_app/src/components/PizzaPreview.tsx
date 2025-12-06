'use client';

/**
 * CSS Pizza Preview Component
 * Renders a visual pizza with toppings using CSS shapes
 */

import React from 'react';
import { PizzaSize, CrustType, PIZZA_SIZE_LABELS, CRUST_LABELS } from '../types';

interface PizzaPreviewProps {
  size: PizzaSize;
  crust: CrustType;
  toppings: string[];
}

// Topping visual configurations
const TOPPING_VISUALS: Record<string, { color: string; shape: 'circle' | 'oval' | 'irregular'; emoji?: string }> = {
  'pepperoni': { color: '#991B1B', shape: 'circle' },
  'sausage': { color: '#78350F', shape: 'irregular' },
  'mushrooms': { color: '#D4C4A8', shape: 'oval' },
  'onions': { color: '#E9D5FF', shape: 'circle' },
  'bell-peppers': { color: '#22C55E', shape: 'irregular' },
  'olives': { color: '#1F2937', shape: 'circle' },
  'bacon': { color: '#DC2626', shape: 'irregular' },
  'extra-cheese': { color: '#FDE68A', shape: 'irregular' },
};

// Generate random positions for toppings
function generateToppingPositions(count: number, seed: number = 0): { x: number; y: number; rotation: number }[] {
  const positions: { x: number; y: number; rotation: number }[] = [];
  const usedPositions: { x: number; y: number }[] = [];
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let x: number = 50;
    let y: number = 50;
    
    do {
      // Generate position within pizza circle (using polar coordinates)
      const angle = ((seed + i * 137.5) % 360) * (Math.PI / 180);
      const radius = 15 + (((seed + i * 47) % 60) / 100) * 25;
      x = 50 + Math.cos(angle) * radius;
      y = 50 + Math.sin(angle) * radius;
      attempts++;
    } while (
      attempts < 10 &&
      usedPositions.some(pos => Math.abs(pos.x - x) < 12 && Math.abs(pos.y - y) < 12)
    );
    
    usedPositions.push({ x, y });
    positions.push({
      x,
      y,
      rotation: ((seed + i * 73) % 360),
    });
  }
  
  return positions;
}

export default function PizzaPreview({ size, crust, toppings }: PizzaPreviewProps) {
  // Size multipliers
  const sizeMultiplier: Record<PizzaSize, number> = {
    personal: 0.6,
    small: 0.75,
    medium: 0.9,
    large: 1,
  };
  
  const scale = sizeMultiplier[size];
  const pizzaSize = 220 * scale;
  
  // Crust thickness
  const crustThickness: Record<CrustType, number> = {
    'hand-tossed': 12,
    'thin-ninja': 6,
    'deep-dish': 18,
  };
  
  return (
    <div className="relative flex flex-col items-center">
      {/* Pizza container */}
      <div 
        className="relative transition-all duration-500 ease-out"
        style={{ width: pizzaSize, height: pizzaSize }}
      >
        {/* Plate/Shadow */}
        <div 
          className="absolute rounded-full bg-gray-200 blur-md"
          style={{
            width: pizzaSize + 20,
            height: pizzaSize + 20,
            left: -10,
            top: 10,
            opacity: 0.5,
          }}
        />
        
        {/* Outer crust */}
        <div 
          className="absolute rounded-full transition-all duration-300"
          style={{
            width: pizzaSize,
            height: pizzaSize,
            background: crust === 'deep-dish' 
              ? 'linear-gradient(145deg, #D97706 0%, #B45309 50%, #92400E 100%)'
              : 'linear-gradient(145deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
            boxShadow: crust === 'deep-dish'
              ? 'inset 0 -8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)'
              : 'inset 0 -4px 8px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.15)',
          }}
        />
        
        {/* Sauce layer */}
        <div 
          className="absolute rounded-full transition-all duration-300"
          style={{
            width: pizzaSize - crustThickness[crust] * 2,
            height: pizzaSize - crustThickness[crust] * 2,
            left: crustThickness[crust],
            top: crustThickness[crust],
            background: 'linear-gradient(145deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
        
        {/* Cheese layer */}
        <div 
          className="absolute rounded-full transition-all duration-300 overflow-hidden"
          style={{
            width: pizzaSize - crustThickness[crust] * 2 - 8,
            height: pizzaSize - crustThickness[crust] * 2 - 8,
            left: crustThickness[crust] + 4,
            top: crustThickness[crust] + 4,
            background: toppings.includes('extra-cheese')
              ? 'linear-gradient(145deg, #FEF3C7 0%, #FDE68A 30%, #FCD34D 60%, #FBBF24 100%)'
              : 'linear-gradient(145deg, #FEF9C3 0%, #FEF08A 50%, #FDE047 100%)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {/* Cheese texture spots */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`cheese-${i}`}
              className="absolute rounded-full opacity-30"
              style={{
                width: 8 + (i % 3) * 4,
                height: 8 + (i % 3) * 4,
                left: `${15 + (i * 37) % 70}%`,
                top: `${20 + (i * 43) % 60}%`,
                background: '#FEF3C7',
              }}
            />
          ))}
        </div>
        
        {/* Toppings */}
        {toppings.filter(t => t !== 'extra-cheese').map((toppingId, toppingIndex) => {
          const visual = TOPPING_VISUALS[toppingId];
          if (!visual) return null;
          
          const positions = generateToppingPositions(
            toppingId === 'pepperoni' ? 8 : 
            toppingId === 'olives' ? 7 : 
            toppingId === 'bacon' ? 5 : 6,
            toppingIndex * 100
          );
          
          return positions.map((pos, i) => {
            const toppingSize = visual.shape === 'circle' 
              ? 16 + (i % 3) * 2
              : visual.shape === 'oval'
              ? 14 + (i % 2) * 3
              : 12 + (i % 4) * 3;
            
            return (
              <div
                key={`${toppingId}-${i}`}
                className="absolute transition-all duration-500 ease-out topping-animate"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${scale})`,
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {visual.shape === 'circle' && (
                  <div
                    className="rounded-full shadow-md"
                    style={{
                      width: toppingSize,
                      height: toppingSize,
                      background: toppingId === 'pepperoni'
                        ? `radial-gradient(circle at 30% 30%, #B91C1C, ${visual.color})`
                        : toppingId === 'olives'
                        ? `radial-gradient(circle at 40% 40%, #374151, ${visual.color})`
                        : `radial-gradient(circle at 30% 30%, #F3E8FF, ${visual.color})`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Pepperoni shine */}
                    {toppingId === 'pepperoni' && (
                      <div 
                        className="absolute rounded-full bg-white opacity-20"
                        style={{ width: 4, height: 4, left: 3, top: 2 }}
                      />
                    )}
                    {/* Olive hole */}
                    {toppingId === 'olives' && (
                      <div 
                        className="absolute rounded-full"
                        style={{ 
                          width: toppingSize * 0.4, 
                          height: toppingSize * 0.4, 
                          left: '50%', 
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          background: '#991B1B',
                        }}
                      />
                    )}
                  </div>
                )}
                
                {visual.shape === 'oval' && (
                  <div
                    className="rounded-full shadow-md"
                    style={{
                      width: toppingSize,
                      height: toppingSize * 0.6,
                      background: `linear-gradient(145deg, #E8DFD0, ${visual.color})`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                    }}
                  />
                )}
                
                {visual.shape === 'irregular' && (
                  <div
                    className="shadow-md"
                    style={{
                      width: toppingSize,
                      height: toppingSize * 0.5,
                      background: toppingId === 'bacon'
                        ? `linear-gradient(90deg, #DC2626 0%, #FCA5A5 30%, #DC2626 60%, #FCA5A5 100%)`
                        : toppingId === 'bell-peppers'
                        ? `linear-gradient(145deg, #4ADE80, ${visual.color})`
                        : toppingId === 'sausage'
                        ? `radial-gradient(circle at 30% 30%, #A16207, ${visual.color})`
                        : visual.color,
                      borderRadius: toppingId === 'bacon' ? '2px' : '30% 70% 50% 50%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                    }}
                  />
                )}
              </div>
            );
          });
        })}
        
        {/* Crust edge highlights */}
        <div 
          className="absolute rounded-full pointer-events-none"
          style={{
            width: pizzaSize - 4,
            height: pizzaSize - 4,
            left: 2,
            top: 2,
            border: '2px solid rgba(255,255,255,0.2)',
            borderBottom: 'none',
            borderRight: 'none',
          }}
        />
      </div>
      
      {/* Size and crust label */}
      <div className="mt-4 text-center">
        <div className="font-bold text-gray-900">{PIZZA_SIZE_LABELS[size]}</div>
        <div className="text-sm text-gray-500">{CRUST_LABELS[crust]}</div>
      </div>
      
    </div>
  );
}

