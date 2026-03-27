import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Upload, Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, TryOnState } from '../types';
import { processTryOn } from '../services/services';
import CameraView from './CameraView';
import ResultView from './ResultView';

interface TryOnModalProps {
  product: Product;
  onClose: () => void;
}

export default function TryOnModal({ product, onClose }: TryOnModalProps) {
  const [state, setState] = useState<TryOnState>({ status: 'idle' });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      setState({ status: 'capturing' });
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setState({ status: 'error', error: 'Could not access camera. Please try uploading a photo instead.' });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setState({ status: 'idle', userImage: dataUrl });
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setState({ status: 'idle', userImage: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!state.userImage) return;
    setState(prev => ({ ...prev, status: 'processing' }));
    try {
      const { resultImage, recommendation } = await processTryOn(state.userImage, product);
      setState(prev => ({ ...prev, status: 'success', resultImage, recommendation }));
    } catch (err) {
      console.error("Try-on error:", err);
      setState(prev => ({ ...prev, status: 'error', error: 'Failed to process try-on. Please try again.' }));
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Left Side: Product Info */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Try On</h2>
            <button onClick={onClose} className="md:hidden p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{product.description}</p>
          <div className="mt-4 text-xl font-semibold text-gray-900">${product.price}</div>
          
          <div className="hidden md:block mt-auto pt-8">
             <button onClick={onClose} className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors">
               Cancel
             </button>
          </div>
        </div>

        {/* Right Side: Interactive Area */}
        <div className="flex-1 p-6 flex flex-col relative">
          <button onClick={onClose} className="hidden md:block absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10">
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center">
            {state.status === 'capturing' ? (
              <CameraView videoRef={videoRef} onCapture={capturePhoto} />
            ) : state.status === 'processing' ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
                  <Sparkles className="w-6 h-6 text-orange-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-medium text-gray-900">AI Magic in Progress</h4>
                  <p className="text-sm text-gray-500">Fitting the {product.name} to your photo...</p>
                </div>
              </div>
            ) : state.resultImage ? (
              <ResultView 
                userImage={state.userImage!} 
                resultImage={state.resultImage} 
                recommendation={state.recommendation}
                onReset={() => setState({ status: 'idle', userImage: state.userImage })}
              />
            ) : state.userImage ? (
              <div className="w-full space-y-6">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                  <img src={state.userImage} alt="User" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setState({ status: 'idle' })}
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur shadow-sm rounded-full hover:bg-white transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <button 
                  onClick={handleTryOn}
                  className="w-full py-4 px-6 rounded-2xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Generate Virtual Try-On
                </button>
              </div>
            ) : (
              <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                  <h4 className="text-xl font-semibold text-gray-900">How would you like to start?</h4>
                  <p className="text-sm text-gray-500">Take a quick selfie or upload an existing photo.</p>
                </div>

                {state.error && (
                  <div className="p-4 bg-red-50 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {state.error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={startCamera}
                    className="flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Use Camera</div>
                      <div className="text-xs text-gray-500">Take a photo now</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Upload Photo</div>
                      <div className="text-xs text-gray-500">Select from gallery</div>
                    </div>
                  </button>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  );
}
