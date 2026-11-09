import React, { useState, useEffect } from 'react';
import { Navigation, Loader2 } from 'lucide-react';

interface FloatingLocationButtonProps {
  currentArea: string;
  isAutoDetected: boolean;
  isLocating: boolean;
  onDetectLocation: () => void;
}

export const FloatingLocationButton: React.FC<FloatingLocationButtonProps> = ({
  currentArea,
  isAutoDetected,
  isLocating,
  onDetectLocation,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-20 right-4 z-40 flex flex-col items-end gap-1.5 transition-all duration-300 pointer-events-auto ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      {/* Tooltip / Status hint pill */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-white backdrop-blur-md text-[11px] font-medium border border-slate-700/60 shadow-lg transition-all">
        <span className={`w-2 h-2 rounded-full ${isAutoDetected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        <span className="max-w-[130px] truncate">{isAutoDetected ? 'রিয়েল জিপিএস সক্রিয়' : currentArea}</span>
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={onDetectLocation}
        disabled={isLocating}
        className="group relative flex items-center justify-center p-3 sm:p-3.5 rounded-full bg-gradient-to-tr from-[#0B4A8A] via-[#12589d] to-[#FF7900] text-white shadow-[0_8px_25px_rgba(11,74,138,0.4)] hover:shadow-[0_12px_30px_rgba(255,121,0,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/90 cursor-pointer disabled:opacity-80"
        title="লাইভ জিপিএস লোকেশন রিফ্রেশ করুন"
        aria-label="রিয়েল লোকেশন জিপিএস"
      >
        {/* Animated Radar Pulse Rings */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0B4A8A] to-[#FF7900] opacity-30 group-hover:opacity-75 blur-md transition duration-300 animate-pulse" />
        
        {isAutoDetected && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-bounce shadow-sm" />
        )}

        <div className="relative flex items-center gap-2">
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <Navigation className="w-5 h-5 text-white transition-transform group-hover:rotate-45 duration-300" />
          )}
          <span className="hidden md:inline-block text-xs font-bold tracking-wide pr-1">
            রিয়েল লোকেশন
          </span>
        </div>
      </button>
    </div>
  );
};
