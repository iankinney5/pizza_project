'use client';

/**
 * Footer component with contact info and links
 */

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto">
      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">🍕</span>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                  TMSE Pizza
                </h2>
                <p className="text-gray-400">Mom &amp; Pop&apos;s Since 1984</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md">
              Serving the best pizza in Atlanta for over 40 years. 
              Fresh ingredients, family recipes, and a whole lot of love in every slice.
            </p>
            {/* TMNT mascots */}
            <div className="flex gap-2 mt-4">
              <span className="text-2xl" title="Leonardo">🐢</span>
              <span className="text-2xl" title="Raphael">🐢</span>
              <span className="text-2xl" title="Donatello">🐢</span>
              <span className="text-2xl" title="Michaelangelo">🐢</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="text-gray-400 hover:text-red-400 transition">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/build" className="text-gray-400 hover:text-red-400 transition">
                  Build Your Own
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-400 hover:text-red-400 transition">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-red-400 transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-red-400">📍</span>
                <span>123 Address Way, Atlanta, GA</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">📞</span>
                <span>(404) 555-1293</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✉️</span>
                <span>support@tmsepizza.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">🕐</span>
                <span>Open Daily: 11am - 10pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} TMSE Pizza. All rights reserved.
          </p>
          <p className="text-sm">
            <span className="text-green-400">🐢 Cowabunga!</span>
            <span className="text-gray-500 ml-2">Thank you for supporting local business!</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
