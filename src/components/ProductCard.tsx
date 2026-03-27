import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onTryOn: (product: Product) => void;
  key?: string | number;
}

export default function ProductCard({ product, onTryOn }: ProductCardProps): React.JSX.Element {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-gray-600 hover:text-red-500 transition-all">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={() => onTryOn(product)}
            className="w-full py-3 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Virtual Try-On
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-1 block">
              {product.category}
            </span>
            <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
          </div>
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
      </div>
    </motion.div>
  );
}
