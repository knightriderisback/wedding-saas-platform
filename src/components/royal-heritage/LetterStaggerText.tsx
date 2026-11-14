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

  // Container variants with stagger
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: type === 'hero' ? 0.035 : 0.022,
        delayChildren: delay,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.015,
        staggerDirection: -1,
      },
    },
  };

  // Character variants for each dramatic type
  const getCharVariants = (): Variants => {
    switch (type) {
      case 'hero':
        // 3D Flip & Golden Shimmer Dissolve
        return {
          hidden: {
            opacity: 0,
            y: 22,
            rotateX: 85,
            filter: 'blur(5px)',
            color: '#B59A57',
          },
          visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            color: 'inherit',
            transition: {
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            },
          },
          exit: {
            opacity: 0,
            y: -18,
            rotateX: -75,
            filter: 'blur(4px)',
            transition: { duration: 0.4 },
          },
        };

      case 'welcome':
        // Water Ripple & Cursive Wave
        return {
          hidden: {
            opacity: 0,
            scale: 0.45,
            rotate: -12,
            y: 16,
          },
          visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            y: 0,
            transition: {
              type: 'spring',
              damping: 12,
              stiffness: 140,
            },
          },
          exit: {
            opacity: 0,
            x: 18,
            scale: 0.8,
            transition: { duration: 0.35 },
          },
        };

      case 'countdown':
        // 3D Drop Impact & Spring Bounce
        return {
          hidden: {
            opacity: 0,
            y: -32,
            scale: 1.25,
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: 'spring',
              damping: 10,
              stiffness: 180,
            },
          },
          exit: {
            opacity: 0,
            y: 24,
            scale: 0.7,
            transition: { duration: 0.3 },
          },
        };

      case 'timeline':
        // Royal Scepter Skew & Glow Slide
        return {
          hidden: {
            opacity: 0,
            x: -28,
            skewX: -20,
            filter: 'blur(3px)',
          },
          visible: {
            opacity: 1,
            x: 0,
            skewX: 0,
            filter: 'blur(0px)',
            transition: {
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
            },
          },
          exit: {
            opacity: 0,
            x: 28,
            skewX: 15,
            transition: { duration: 0.3 },
          },
        };

      case 'venue':
        // Architectural Dome 3D Spin
        return {
          hidden: {
            opacity: 0,
            rotateY: 90,
            scale: 0.75,
            y: 12,
          },
          visible: {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            y: 0,
            transition: {
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1],
            },
          },
          exit: {
            opacity: 0,
            rotateY: -90,
            scale: 0.75,
            transition: { duration: 0.35 },
          },
        };

      case 'rsvp':
        // Luxury Velvet Mist Float
        return {
          hidden: {
            opacity: 0,
            y: 22,
            filter: 'blur(8px)',
          },
          visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
              duration: 0.7,
              ease: 'easeOut',
            },
          },
          exit: {
            opacity: 0,
            y: -20,
            filter: 'blur(6px)',
            transition: { duration: 0.35 },
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
      viewport={{ once: false, amount: 0.15 }}
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
