import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

// Splits text into characters and animates each one
const SplitText = ({
  children,
  className = '',
  as: Tag = 'div',
  delay = 0,
  stagger = 0.03,
  duration = 0.6,
  once = true,
  animation = 'fadeUp', // fadeUp | slideIn | reveal | scale
  threshold = 0.1,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const text = typeof children === 'string' ? children : '';
  const chars = text.split('');

  const animations = {
    fadeUp: {
      hidden: { opacity: 0, y: 60, rotateX: -40 },
      visible: (i) => ({
        opacity: 1, y: 0, rotateX: 0,
        transition: { duration, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }
      }),
    },
    slideIn: {
      hidden: { opacity: 0, x: -30 },
      visible: (i) => ({
        opacity: 1, x: 0,
        transition: { duration, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }
      }),
    },
    reveal: {
      hidden: { opacity: 0, y: 100, skewY: 3 },
      visible: (i) => ({
        opacity: 1, y: 0, skewY: 0,
        transition: { duration: duration * 1.2, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }
      }),
    },
    scale: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: (i) => ({
        opacity: 1, scale: 1,
        transition: { duration, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }
      }),
    },
  };

  const variant = animations[animation] || animations.fadeUp;

  if (!text) return <Tag ref={ref} className={className}>{children}</Tag>;

  return (
    <Tag ref={ref} className={`${className} ${Tag === 'div' ? 'flex flex-wrap' : 'inline-flex flex-wrap'}`}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal', perspective: '800px' }}
          variants={variant}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={i}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </Tag>
  );
};

export default SplitText;
