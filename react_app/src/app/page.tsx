'use client';

/**
 * Homepage - TMSE Pizza Landing Page
 */

import Link from 'next/link';
import { PIZZAS, BEVERAGES } from '../data/menu';

export default function Home() {
  const featuredPizzas = PIZZAS.filter(p => p.isSpecialty).slice(0, 3);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block bg-green-500/20 text-green-100 px-4 py-1 rounded-full text-sm font-medium mb-4">
                🐢 Cowabunga! Welcome to TMSE Pizza
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                Fresh Pizza,<br />
                <span className="text-yellow-300">Made with Love</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-xl">
                Family recipes passed down through generations. 
                Every pizza crafted with the freshest ingredients 
                and served with a smile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/menu"
                  className="btn bg-white hover:bg-gray-100 text-red-600 font-bold text-lg px-8 py-4 shadow-xl hover:shadow-2xl"
                >
                  View Menu
                </Link>
                <Link
                  href="/build"
                  className="btn bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-4 shadow-lg"
                >
                  🐢 Build Your Own
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="pizza-float text-[200px] drop-shadow-2xl">
                🍕
              </div>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-48 h-48 bg-red-600/20 rounded-full blur-3xl"></div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🧀</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Fresh Ingredients</h3>
              <p className="text-gray-600">
                We source only the finest ingredients from local suppliers
              </p>
            </div>
            <div className="feature-card">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">👨‍🍳</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Family Recipes</h3>
              <p className="text-gray-600">
                Secret recipes perfected over 40 years of pizza making
              </p>
            </div>
            <div className="feature-card">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🚗</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600">
                Hot pizza delivered to your door in 30 minutes or less
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="py-20 warm-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Fan Favorites
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Specialty Pizzas
            </h2>
            <p className="text-xl text-gray-600">
              Crafted by our master pizza makers with love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPizzas.map((pizza) => (
              <div key={pizza.id} className="card group">
                <div className="h-48 pizza-card-gradient flex items-center justify-center relative overflow-hidden">
                  <span className="text-8xl group-hover:scale-110 transition-transform duration-300">🍕</span>
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Popular
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{pizza.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{pizza.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                      ${pizza.basePrice.toFixed(2)}
                    </span>
                    <Link
                      href={`/menu?highlight=${pizza.id}`}
                      className="btn btn-primary text-sm"
                    >
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="btn btn-outline text-lg px-8 py-4"
            >
              See Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* Beverages Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Thirst Quenchers
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Refreshing Beverages
            </h2>
            <p className="text-xl text-gray-600">
              The perfect complement to your pizza
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {BEVERAGES.map((beverage) => (
              <div
                key={beverage.id}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 text-center w-44 border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🥤</div>
                <h4 className="font-semibold text-gray-900 text-sm">{beverage.name}</h4>
                <p className="text-red-600 font-bold mt-2">
                  From ${beverage.prices.small.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)`
          }}></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block bg-green-500/30 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            🐢 Turtle Power!
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Create your perfect pizza or choose from our delicious menu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/build"
              className="btn bg-white hover:bg-gray-100 text-red-600 font-bold text-lg px-8 py-4 shadow-xl"
            >
              Build Your Own Pizza
            </Link>
            <Link
              href="/menu"
              className="btn bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-4"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
