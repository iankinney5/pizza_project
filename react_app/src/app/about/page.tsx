'use client';

/**
 * About Us Page
 */

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block bg-green-500/30 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            🐢 Cowabunga!
          </span>
          <h1 className="text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl text-white/90">
            Family recipes, fresh ingredients, and a whole lot of love since 1984
          </p>
        </div>
        <div className="absolute top-10 right-10 text-8xl opacity-20">🍕</div>
        <div className="absolute bottom-10 left-10 text-6xl opacity-20">🐢</div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
              <span className="text-5xl">🍕</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">The TMSE Pizza Story</h2>
          
          <div className="prose prose-lg mx-auto text-gray-700">
            <p className="mb-6 text-lg leading-relaxed">
              It all started in 1984 when four friends with a passion for great pizza 
              decided to open a small pizzeria in the heart of Atlanta. What began as 
              a dream shared over late-night pizza-making sessions has grown into a 
              beloved local institution.
            </p>
            
            <p className="mb-6 text-lg leading-relaxed">
              Our founders - nicknamed after their favorite pizza toppings - believed 
              that great pizza comes from three things: quality ingredients, time-tested 
              recipes, and a genuine love for what you do. Forty years later, those 
              principles still guide everything we make.
            </p>
            
            <p className="text-lg leading-relaxed">
              Every pizza at TMSE is made fresh to order using our signature hand-tossed 
              dough, prepared daily using a recipe that&apos;s been passed down through our 
              kitchen family. Our sauce is simmered from scratch with imported San Marzano 
              tomatoes, and we use only 100% real mozzarella cheese.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 warm-gradient">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Our Values
            </span>
            <h2 className="text-3xl font-bold text-gray-900">What We Stand For</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🧀</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on ingredients. From our flour to our toppings, 
                everything is sourced from trusted suppliers.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Family Values</h3>
              <p className="text-gray-600">
                We treat every customer like family. When you walk through our doors, 
                you&apos;re not just a customer - you&apos;re part of the TMSE family.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Community Focused</h3>
              <p className="text-gray-600">
                We&apos;re proud to be a part of the Atlanta community. We source locally 
                whenever possible and give back through local initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TMNT Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
            <div className="flex justify-center gap-4 mb-6">
              <span className="text-5xl">🐢</span>
              <span className="text-5xl">🐢</span>
              <span className="text-5xl">🐢</span>
              <span className="text-5xl">🐢</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Turtle Power!</h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              Fun fact: Our founders were huge fans of a certain group of pizza-loving heroes. 
              That&apos;s why we always put a little extra love into every pizza we make. Cowabunga!
            </p>
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
          <h2 className="text-4xl font-bold mb-6">Ready to Taste the Difference?</h2>
          <p className="text-xl text-white/90 mb-8">
            Order now and see why Atlanta has loved us for 40 years
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="btn bg-white hover:bg-gray-100 text-red-600 font-bold text-lg px-8 py-4 shadow-xl"
            >
              View Our Menu
            </Link>
            <Link
              href="/build"
              className="btn bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-4"
            >
              🐢 Build Your Own
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
