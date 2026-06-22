import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const SectionReveal = ({ children, variant = 'default', direction = 'up' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const sm = useSpring(scrollYProgress, { stiffness: 40, damping: 20, mass: 1.5, restDelta: 0.0001 });

  if (variant === 'hero') {
    return <motion.div ref={ref}>{children}</motion.div>;
  }

  // Clip-path wipe reveal from bottom
  if (variant === 'wipe') {
    const clipPath = useTransform(sm, [0.05, 0.25], [
      'inset(100% 0 0 0)',
      'inset(0% 0 0 0)',
    ]);
    return (
      <motion.div ref={ref} style={{ clipPath }} className="will-change-transform">
        {children}
      </motion.div>
    );
  }

  // Horizontal slide with depth
  if (variant === 'slideIn') {
    const dir = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
    const x = useTransform(sm, [0, 0.15, 0.3], [300 * dir, 80 * dir, 0]);
    const o = useTransform(sm, [0, 0.1, 0.25], [0, 0.5, 1]);
    const sc = useTransform(sm, [0, 0.2, 0.8, 1], [0.85, 1, 1, 0.95]);
    return (
      <motion.div
        ref={ref}
        style={{ opacity: o, x, scale: sc, transformPerspective: 1500 }}
        className="will-change-transform transform-gpu"
      >
        {children}
      </motion.div>
    );
  }

  // Scale + blur reveal
  if (variant === 'scaleReveal') {
    const o = useTransform(sm, [0, 0.15, 0.3], [0, 0.4, 1]);
    const sc = useTransform(sm, [0, 0.25, 0.8, 1], [0.6, 1.02, 1, 0.97]);
    const blur = useTransform(sm, [0, 0.25], [16, 0]);
    return (
      <motion.div
        ref={ref}
        style={{
          opacity: o,
          scale: sc,
          filter: blur.get() > 0.5 ? `blur(${blur}px)` : 'none',
        }}
        className="will-change-transform transform-gpu"
      >
        {children}
      </motion.div>
    );
  }

  // Parallax float
  if (variant === 'parallax') {
    const y = useTransform(sm, [0, 1], [120, -120]);
    const o = useTransform(sm, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
    return (
      <motion.div ref={ref} style={{ opacity: o, y }} className="will-change-transform">
        {children}
      </motion.div>
    );
  }

  // Flip in from top
  if (variant === 'flipIn') {
    const o = useTransform(sm, [0, 0.15, 0.3], [0, 0.7, 1]);
    const rotX = useTransform(sm, [0, 0.3], [80, 0]);
    return (
      <motion.div
        ref={ref}
        style={{ opacity: o, rotateX: rotX, transformPerspective: 1500, transformOrigin: 'center top' }}
        className="will-change-transform transform-gpu"
      >
        {children}
      </motion.div>
    );
  }

  // DEFAULT: Cinematic depth reveal
  const o = useTransform(sm, [0, 0.12, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(sm, [0, 0.12, 0.85, 1], [180, 0, 0, -180]);
  const s = useTransform(sm, [0, 0.12, 0.85, 1], [0.8, 1, 1, 0.9]);
  const r = useTransform(sm, [0, 0.12, 0.85, 1], [25, 0, 0, -25]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity: o, y, scale: s, rotateX: r, transformPerspective: 2000, transformStyle: 'preserve-3d' }}
      className="will-change-transform transform-gpu"
    >
      {children}
    </motion.div>
  );
};

SectionReveal.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'hero', 'slideIn', 'flipIn', 'scaleReveal', 'parallax', 'wipe']),
  direction: PropTypes.oneOf(['up', 'left', 'right']),
};

export default SectionReveal;