import React from 'react';
import { Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultViewProps {
  userImage: string;
  resultImage: string;
  recommendation?: string;
  onReset: () => void;
}

export default function ResultView({ userImage, resultImage, recommendation, onReset }: ResultViewProps) {
  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Original</span>
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <img src={userImage} alt="Original" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Result
          </span>
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border-2 border-orange-200 shadow-lg shadow-orange-100">
            <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {recommendation && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-orange-50 rounded-2xl border border-orange-100"
        >
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">Stylist Recommendation</h5>
              <p className="text-sm text-orange-900 leading-relaxed italic">"{recommendation}"</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-3">
        <button 
          onClick={onReset}
          className="flex-1 py-4 px-6 rounded-2xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
        <button 
          className="flex-1 py-4 px-6 rounded-2xl bg-black text-white font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}
