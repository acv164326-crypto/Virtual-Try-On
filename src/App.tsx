import React, { useState } from 'react';
import { Sparkles, Search, ShoppingBag, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from './constants';
import { Product, Category } from './types';
import TryOnModal from './components/TryOnModal';
import Navigation from './components/Navigation';
import ProductCard from './components/ProductCard';
import { cn } from './lib/utils';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'clothes', label: 'Clothing' },
    { id: 'glasses', label: 'Eyewear' },
    { id: 'necklaces', label: 'Jewelry' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Shopping Experience
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 max-w-4xl mx-auto leading-[1.1]"
          >
            Try before you buy, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">virtually anywhere.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            Experience the future of fashion. Use our advanced AI to see how any item looks on you instantly. No fitting room required.
          </motion.p>
        </section>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="flex items-center gap-2 p-1 bg-white rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                  selectedCategory === cat.id 
                    ? "bg-black text-white shadow-md" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onTryOn={(p) => setSelectedProduct(p)} 
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or category filters.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight uppercase">Virtual<span className="text-orange-500">Try</span></span>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 VirtualTry Studio. Powered by Gemini AI.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>

      {/* Try-On Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <TryOnModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}


