import React, { useRef } from 'react';
import { Camera } from 'lucide-react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onCapture: () => void;
}

export default function CameraView({ videoRef, onCapture }: CameraViewProps) {
  return (
    <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden shadow-inner">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <button 
          onClick={onCapture}
          className="w-16 h-16 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-red-500" />
        </button>
      </div>
    </div>
  );
}
