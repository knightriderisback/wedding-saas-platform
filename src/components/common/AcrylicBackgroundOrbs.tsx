'use client';

import React from 'react';

interface AcrylicBackgroundOrbsProps {
  variant?: 'gold' | 'rose' | 'sage' | 'multi';
}

export const AcrylicBackgroundOrbs: React.FC<AcrylicBackgroundOrbsProps> = ({ variant = 'multi' }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 3D Glass Bubble 1: Top Right Honey Amber Orb */}
      <div
        className="bubble-3d w-72 h-72 sm:w-96 sm:h-96 -top-20 -right-20 opacity-60"
        style={{ animationDelay: '0s', animationDuration: '14s' }}
      />

      {/* 3D Glass Bubble 2: Middle Left Rose Quartz Orb */}
      <div
        className="bubble-3d bubble-3d-rose w-48 h-48 sm:w-64 sm:h-64 top-1/3 -left-16 opacity-50"
        style={{ animationDelay: '3s', animationDuration: '11s' }}
      />

      {/* 3D Glass Bubble 3: Bottom Right Sage Celadon Orb */}
      <div
        className="bubble-3d bubble-3d-sage w-60 h-60 sm:w-80 sm:h-80 bottom-10 -right-12 opacity-50"
        style={{ animationDelay: '6s', animationDuration: '16s' }}
      />

      {/* 3D Glass Bubble 4: Small Float Orb Center */}
      <div
        className="bubble-3d w-28 h-28 top-2/3 left-1/4 opacity-40 hidden md:block"
        style={{ animationDelay: '1.5s', animationDuration: '10s' }}
      />

      {/* 3D Glass Bubble 5: Floating Lilac Orb Top Left */}
      <div
        className="bubble-3d w-36 h-36 top-16 left-12 opacity-40 hidden lg:block"
        style={{ animationDelay: '4.5s', animationDuration: '13s' }}
      />
    </div>
  );
};
