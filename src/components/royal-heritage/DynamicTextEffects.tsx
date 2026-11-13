'use client';

import React, { useEffect, useState, useRef } from 'react';

export type TextEffectType =
  | 'typewriter' // Smooth letter-by-letter typing with golden cursor
  | 'pop-3d' // 3D letter pop with spring bounce
  | 'shimmer-wave' // Golden shimmer wave sweeping across letters
  | 'scepter-slide' // Diagonal skew & slide reveal
  | 'dome-rise' // 3D perspective dome rise
  | 'velvet-mist'; // Soft luxury velvet mist float

interface DynamicTextEffectsProps {
  text: string;
  effect?: TextEffectType;
  className?: string;
  style?: React.CSSProperties;
  speed?: number; // ms per char (for typewriter)
  delay?: number; // ms before start
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  showCursor?: boolean;
}

export const DynamicTextEffects: React.FC<DynamicTextEffectsProps> = ({
  text,
  effect = 'typewriter',
  className = '',
  style = {},
  speed = 35,
  delay = 100,
  as = 'div',
  showCursor = false,
}) => {
  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const [isInView, setIsInView] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver to trigger entry and exit animations
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            // Exit animation reset
            setIsInView(false);
            setDisplayedLength(0);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Typewriter ticker
  useEffect(() => {
    if (!isInView || !text) {
      setDisplayedLength(0);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      let current = 0;
      intervalId = setInterval(() => {
        current++;
        setDisplayedLength(current);
        if (current >= text.length) {
          clearInterval(intervalId);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isInView, text, speed, delay]);

  const Component: React.ElementType = as;

  // Render for Typewriter Effect
  if (effect === 'typewriter') {
    const visibleChars = text.slice(0, displayedLength);
    const isTyping = displayedLength < text.length && isInView;

    return (
      <Component
        ref={elementRef}
        className={`select-none ${className}`}
        style={{
          textShadow: '0 2px 4px rgba(255,255,255,0.95), 0 3px 12px rgba(0,0,0,0.65)',
          ...style,
        }}
      >
        <span>{visibleChars}</span>
        {showCursor && isTyping && (
          <span className="inline-block w-[2px] h-[1em] ml-0.5 bg-[#B59A57] align-middle animate-pulse" />
        )}
      </Component>
    );
  }

  // Render for character-by-character CSS animated effects
  const words = text.split(' ');

  return (
    <Component
      ref={elementRef}
      className={`select-none ${className}`}
      style={{
        perspective: '800px',
        textShadow: '0 2px 4px rgba(255,255,255,0.95), 0 3px 12px rgba(0,0,0,0.65)',
        ...style,
      }}
    >
      {words.map((word, wIdx) => (
        <span
          key={`w-${wIdx}`}
          className="inline-block whitespace-nowrap"
          style={{ marginRight: wIdx < words.length - 1 ? '0.28em' : '0' }}
        >
          {Array.from(word).map((char, cIdx) => {
            const charTotalIdx = wIdx * 5 + cIdx;
            const charDelay = (delay + charTotalIdx * 25) / 1000;

            let charStyle: React.CSSProperties = {
              display: 'inline-block',
              transition: `all 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${charDelay}s`,
              willChange: 'transform, opacity',
            };

            if (effect === 'pop-3d') {
              charStyle = {
                ...charStyle,
                opacity: isInView ? 1 : 0,
                transform: isInView
                  ? 'translateY(0) scale(1) rotateX(0deg)'
                  : 'translateY(-26px) scale(1.3) rotateX(60deg)',
              };
            } else if (effect === 'shimmer-wave') {
              charStyle = {
                ...charStyle,
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(16px)',
              };
            } else if (effect === 'scepter-slide') {
              charStyle = {
                ...charStyle,
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateX(0) skewX(0deg)' : 'translateX(-24px) skewX(-18deg)',
              };
            } else if (effect === 'dome-rise') {
              charStyle = {
                ...charStyle,
                opacity: isInView ? 1 : 0,
                transform: isInView
                  ? 'rotateY(0deg) translateY(0) scale(1)'
                  : 'rotateY(90deg) translateY(18px) scale(0.75)',
              };
            } else if (effect === 'velvet-mist') {
              charStyle = {
                ...charStyle,
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(18px)',
                filter: isInView ? 'blur(0px)' : 'blur(6px)',
              };
            }

            return (
              <span key={`c-${wIdx}-${cIdx}`} style={charStyle}>
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </Component>
  );
};
