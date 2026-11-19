'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

export type DramaticAnimationType =
  | 'hero' // 3D Flip & Golden Shimmer Dissolve
  | 'welcome' // Water Ripple & Cursive Bloom
  | 'countdown' // 3D Drop Impact & Spring Bounce
  | 'timeline' // Royal Scepter Skew & Glow Slide
  | 'venue' // Architectural Dome 3D Spin
  | 'rsvp'; // Luxury Velvet Mist Float

interface LetterStaggerTextProps {
  text: string;
  type?: DramaticAnimationType;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const LetterStaggerText: React.FC<LetterStaggerTextProps> = ({
  text,
  type = 'hero',
  className = '',
  style = {},
  delay = 0,
  as = 'div',
}) => {
  // If text is empty, return null
  if (!text) return null;

  // Split text into words to prevent unnatural line breaks mid-word
  const words = text.split(' ');

  // Container variants with snappy luxury stagger
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: type === 'hero' ? 0.016 : 0.012,
        delayChildren: delay,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.008,
        staggerDirection: -1,
      },
    },
  };

  // Character variants for each dramatic type (100% GPU-composited, zero CPU blur bottlenecks)
  const getCharVariants = (): Variants => {
    switch (type) {
      case 'hero':
        // 3D Flip & Golden Shimmer Dissolve
        return {
          hidden: {
            opacity: 0,
            y: 14,
            rotateX: 45,
            color: '#B59A57',
          },
          visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            color: 'inherit',
            transition: {
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            },
          },
          exit: {
            opacity: 0,
            y: -12,
            rotateX: -45,
            transition: { duration: 0.2 },
          },
        };

      case 'welcome':
        // Water Ripple & Cursive Wave
        return {
          hidden: {
            opacity: 0,
            scale: 0.6,
            rotate: -8,
            y: 12,
          },
          visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            y: 0,
            transition: {
              type: 'spring',
              damping: 15,
              stiffness: 220,
            },
          },
          exit: {
            opacity: 0,
            x: 12,
            scale: 0.85,
            transition: { duration: 0.2 },
          },
        };

      case 'countdown':
        // 3D Drop Impact & Spring Bounce
        return {
          hidden: {
            opacity: 0,
            y: -18,
            scale: 1.15,
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: 'spring',
              damping: 14,
              stiffness: 240,
            },
          },
          exit: {
            opacity: 0,
            y: 14,
            scale: 0.8,
            transition: { duration: 0.2 },
          },
        };

      case 'timeline':
        // Royal Scepter Skew & Glow Slide
        return {
          hidden: {
            opacity: 0,
            x: -16,
            skewX: -12,
          },
          visible: {
            opacity: 1,
            x: 0,
            skewX: 0,
            transition: {
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            },
          },
          exit: {
            opacity: 0,
            x: 16,
            skewX: 8,
            transition: { duration: 0.2 },
          },
        };

      case 'venue':
        // Architectural Dome 3D Spin
        return {
          hidden: {
            opacity: 0,
            rotateY: 60,
            scale: 0.85,
            y: 10,
          },
          visible: {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            y: 0,
            transition: {
              duration: 0.32,
              ease: [0.16, 1, 0.3, 1],
            },
          },
          exit: {
            opacity: 0,
            rotateY: -60,
            scale: 0.85,
            transition: { duration: 0.2 },
          },
        };

      case 'rsvp':
        // Luxury Velvet Mist Float
        return {
          hidden: {
            opacity: 0,
            y: 14,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.32,
              ease: [0.16, 1, 0.3, 1],
            },
          },
          exit: {
            opacity: 0,
            y: -12,
            transition: { duration: 0.2 },
          },
        };
    }
  };

  const charVariants = getCharVariants();
  const MotionComponent = motion[as] as React.ComponentType<any>;
  const isComplexScript = /[\u0900-\u097F\u0600-\u06FF]/.test(text);

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.15 }}
      className={`select-none ${as === 'span' ? 'inline-block' : 'block'} ${className}`}
      style={{
        perspective: '1000px',
        ...style,
      }}
    >
      {words.map((word, wordIndex) => {
        if (isComplexScript) {
          // In Devanagari & Nastaliq scripts, keep full words intact in single text run
          // to preserve ligature shaping, shirorekha, conjuncts, and matra attachments
          return (
            <motion.span
              key={`word-${wordIndex}`}
              variants={charVariants}
              className="inline-block whitespace-nowrap"
              style={{
                marginRight: wordIndex < words.length - 1 ? '0.35em' : '0',
                willChange: 'transform, opacity, filter',
                transformStyle: 'preserve-3d',
              }}
            >
              {word}
            </motion.span>
          );
        }

        return (
          <span
            key={`word-${wordIndex}`}
            className="inline-block whitespace-nowrap"
            style={{ marginRight: wordIndex < words.length - 1 ? '0.28em' : '0' }}
          >
            {Array.from(word).map((char, charIndex) => (
              <motion.span
                key={`char-${wordIndex}-${charIndex}`}
                variants={charVariants}
                className="inline-block"
                style={{
                  willChange: 'transform, opacity, filter',
                  transformStyle: 'preserve-3d',
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </MotionComponent>
  );
};
