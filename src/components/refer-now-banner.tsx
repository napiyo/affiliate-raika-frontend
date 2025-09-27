'use client'
import React, { useState } from 'react';
import { X, Gift, Plane } from 'lucide-react';
import Link from 'next/link';

const ReferralBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => setIsVisible(false), 500);
  };

  if (!isVisible) return null;

  return (
    <div className={`relative bg-gradient-to-r shrink-0 from-primary to-accent text-white shadow-lg overflow-hidden transition-all duration-500 ease-in-out transform 
        ${isAnimating ? 'animate-slide-up opacity-0' : 'animate-slide-down opacity-100'}
        `}
      >
      {/* Animated plane background illustration */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-2 right-8 animate-fly-across">
          <Plane className="w-16 h-16 text-white transform rotate-12" />
        </div>
        <div className="absolute bottom-1 left-12 animate-float">
          <Plane className="w-12 h-12 text-white transform -rotate-45 opacity-60" />
        </div>
        <div className="absolute top-1/2 left-1/3 animate-fly-diagonal">
          <Plane className="w-8 h-8 text-white transform rotate-45 opacity-40" />
        </div>
        <div className="absolute top-3 left-1/4 animate-fly-loop">
          <Plane className="w-6 h-6 text-white opacity-30" />
        </div>
      </div>

      {/* Animated dotted flight path */}
      <div className="absolute inset-0 opacity-25">
        <svg className="w-full h-full" viewBox="0 0 400 80">
          <path 
            d="M 0,40 Q 100,20 200,40 T 400,35" 
            stroke="white" 
            strokeWidth="2" 
            strokeDasharray="8,4" 
            fill="none"
            className="animate-dash"
          />
          <path 
            d="M 0,50 Q 150,30 300,45 T 400,50" 
            stroke="white" 
            strokeWidth="1" 
            strokeDasharray="6,6" 
            fill="none"
            className="animate-dash-reverse opacity-60"
          />
        </svg>
      </div>

      <div className="relative px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                <Gift className="w-5 h-5 text-accent-foreground" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-semibold text-accent-foreground">
                Refer Now, and Earn Commission! ✈️
              </p>
              <p className="text-xs sm:text-sm text-accent-foreground mt-0.5">
                Refer someone and our sales team will get in touch with them and get commsion for every successful referral
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
          <Link href="/leads?refernow=true">
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1 animate-button-glow">
              <Plane className="w-4 h-4 animate-propeller" />
              <span>Refer Now</span>
            </button>
            </Link>
            
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 flex-shrink-0"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"></div>
    </div>
  );
};

export default ReferralBanner;