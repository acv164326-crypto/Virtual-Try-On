import React from 'react';
import { ShoppingBag, ShoppingCart } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase">Virtual<span className="text-orange-500">Try</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {/* Links removed as per user request */}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
          </button>
        </div>
      </div>
    </nav>
  );
}
