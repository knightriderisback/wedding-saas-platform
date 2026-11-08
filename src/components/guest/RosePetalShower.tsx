'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Flower2 } from 'lucide-react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  color: string;
}

export const RosePetalShower: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const triggerShower = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 8000);
  };

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const petals: Petal[] = [];
    const colors = [
      'rgba(184, 40, 61, 0.85)',   // Auspicious Sindoor Red
      'rgba(243, 156, 18, 0.85)',  // Haldi Marigold Petal
      'rgba(244, 114, 182, 0.75)', // Soft Rose Pink
      'rgba(212, 175, 55, 0.8)',   // 24K Gold Flake
      'rgba(253, 242, 208, 0.7)',  // Jasmine Cream White
    ];

    for (let i = 0; i < 50; i++) {
      petals.push({
        x: Math.random() * width,
        y: -20 - Math.random() * 200,
        size: Math.random() * 6 + 5,
        speedY: Math.random() * 1.5 + 1.2,
        speedX: (Math.random() - 0.5) * 1.2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.02) * 0.5;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 1.2, -p.size * 0.4, p.size * 1.1, p.size * 1.1, 0, p.size * 1.3);
        ctx.bezierCurveTo(-p.size * 1.1, p.size * 1.1, -p.size * 1.2, -p.size * 0.4, 0, -p.size);
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isActive]);

  return (
    <>
      {isActive && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-40"
        />
      )}

      {/* Floating Action Pill */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={triggerShower}
          className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF8F5]/95 border-2 border-[#D4AF37]/50 text-[#7D5F04] shadow-[0_8px_30px_rgba(212,175,55,0.28)] hover:scale-105 active:scale-95 transition-all text-xs font-cinzel uppercase tracking-wider font-bold cursor-pointer"
          title="Shower blessing rose & marigold petals over couple"
        >
          <Flower2 className="w-4 h-4 text-[#9B1C2E] group-hover:rotate-45 transition-transform" />
          <span>Phoolon Ki Barkat</span>
        </button>
      </div>
    </>
  );
};
