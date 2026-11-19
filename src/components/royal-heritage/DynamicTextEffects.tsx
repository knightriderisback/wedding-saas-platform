'use client';

import React, { useEffect, useState, useRef } from 'react';

export type TextEffectType =
  | 'typewriter' // Smooth letter/word typing with golden cursor
  | 'pop-3d' // 3D letter/word pop with spring bounce
  | 'shimmer-wave' // Golden shimmer wave sweeping across letters/words
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

// Regex to detect complex scripts (Devanagari, Urdu/Arabic, Indic, etc.)
const isComplexScript = (str: string): boolean => {
  return /[\u0900-\u0D7F\u0600-\u06FF]/.test(str);
};

// Grapheme cluster segmenter for authentic script shaping
const getGraphemeSegments = (str: string): string[] => {
  if (!str) return [];
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' });
      return Array.from(segmenter.segment(str), (s: any) => s.segment);
    } catch {}
  }
  return Array.from(str);
};

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

  const isComplex = isComplexScript(text || '');

  // IntersectionObserver to trigger entry and exit animations
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (entry.target) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Graphemes cache for typewriter
  const graphemes = useRef<string[]>([]);
  useEffect(() => {
    graphemes.current = getGraphemeSegments(text || '');
  }, [text]);

  // Typewriter ticker
  useEffect(() => {
    if (!isInView || !text) {
      setDisplayedLength(0);
      return;
    }

    const totalUnits = graphemes.current.length || text.length;
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      let current = 0;
      intervalId = setInterval(() => {
        current++;
        setDisplayedLength(current);
        if (current >= totalUnits) {
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
    const totalUnits = graphemes.current.length || text.length;
    const isTyping = displayedLength < totalUnits && isInView;
    const visibleChars =
      graphemes.current.length > 0
        ? graphemes.current.slice(0, displayedLength).join('')
        : text.slice(0, displayedLength);

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

  // Complex Script (Devanagari, Urdu, etc.): NEVER split words into characters!
  // In Indic scripts, separating matras/viramas creates orphaned dotted circles (◌).
  // Animate whole words with pristine continuous shirorekha and ligature shaping intact.
  if (isComplex) {
    const words = text.split(/\s+/).filter(Boolean);

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
        {words.map((word, wIdx) => {
          const wordDelay = (delay + wIdx * 35) / 1000;

          let wordStyle: React.CSSProperties = {
            display: 'inline-block',
            transition: `transform 0.32s cubic-bezier(0.16, 1, 0.3, 1) ${wordDelay}s, opacity 0.32s ease-out ${wordDelay}s`,
            willChange: 'transform, opacity',
            marginRight: wIdx < words.length - 1 ? '0.32em' : '0',
            letterSpacing: '0',
            textTransform: 'none',
          };

          if (effect === 'pop-3d') {
            wordStyle = {
              ...wordStyle,
              opacity: isInView ? 1 : 0,
              transform: isInView
                ? 'translateY(0) scale(1) rotateX(0deg)'
                : 'translateY(-16px) scale(1.1) rotateX(30deg)',
            };
          } else if (effect === 'shimmer-wave') {
            wordStyle = {
              ...wordStyle,
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(10px)',
            };
          } else if (effect === 'scepter-slide') {
            wordStyle = {
              ...wordStyle,
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateX(0) skewX(0deg)' : 'translateX(-16px) skewX(-8deg)',
            };
          } else if (effect === 'dome-rise') {
            wordStyle = {
              ...wordStyle,
              opacity: isInView ? 1 : 0,
              transform: isInView
                ? 'rotateY(0deg) translateY(0) scale(1)'
                : 'rotateY(40deg) translateY(12px) scale(0.9)',
            };
          } else if (effect === 'velvet-mist') {
            wordStyle = {
              ...wordStyle,
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(12px)',
            };
          }

          return (
            <span key={`w-${wIdx}`} style={wordStyle} className="whitespace-nowrap">
              {word}
            </span>
          );
        })}
      </Component>
    );
  }

  // Render for Latin/English character-by-character CSS animated effects
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
            const charDelay = (delay + charTotalIdx * 12) / 1000;

            let charStyle: React.CSSProperties = {
              display: 'inline-block',
              transition: `transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${charDelay}s, opacity 0.3s ease-out ${charDelay}s`,
              willChange: 'transform, opacity',
            };

            if (effect === 'pop-3d') {
              charStyle = {
                ...charStyle,
                opacity: isInView ? 1 : 0,
                transform: isInView
                  ? 'translateY(0) scale(1) rotateX(0deg)'
                  : 'translateY(-18px) scale(1.15) rotateX(40deg)',
              };
            } else if (effect === 'shimmer-wave') {
              charStyle = {
                ...charStyle,
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(12px)',
              };
            } else if (effect === 'scepter-slide') {
              charStyle = {
                ...charStyle,
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateX(0) skewX(0deg)' : 'translateX(-18px) skewX(-12deg)',
              };
            } else if (effect === 'dome-rise') {
              charStyle = {
                ...charStyle,
                opacity: isInView ? 1 : 0,
                transform: isInView
                  ? 'rotateY(0deg) translateY(0) scale(1)'
                  : 'rotateY(60deg) translateY(14px) scale(0.85)',
              };
            } else if (effect === 'velvet-mist') {
              charStyle = {
                ...charStyle,
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(12px)',
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
