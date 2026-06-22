import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

// ===================== WORLD-CLASS SECTION REVEAL =====================
const SectionReveal = ({ children, variant = 'default', direction = 'up' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const sm = useSpring(scrollYProgress, { stiffness: 50, damping: 22, mass: 1.5, restDelta: 0.0001 });

  if (variant === 'hero') {
    return (
      <motion.div ref={ref} className="will-change-transform transform-gpu">
        {children}
      </motion.div>
    );
  }

  if (variant === 'slideIn') {
    const dir = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
    const x = useTransform(sm, [0, 0.15, 0.3], [300 * dir, 80 * dir, 0]);
    const o = useTransform(sm, [0, 0.1, 0.25], [0, 0.5, 1]);
    const rotY = useTransform(sm, [0, 0.3], [12 * dir, 0]);
    const sc = useTransform(sm, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.9]);

    return (
      <motion.div
        ref={ref}
        style={{
          opacity: o,
          x,
          scale: sc,
          rotateY: rotY,
          transformPerspective: 1200,
          transformStyle: 'preserve-3d',
        }}
        className="will-change-transform transform-gpu"
      >
        {children}
      </motion.div>
    );
  }

  if (variant === 'flipIn') {
    const o = useTransform(sm, [0, 0.15, 0.3], [0, 0.6, 1]);
    const rotX = useTransform(sm, [0, 0.3], [90, 0]);
    const sc = useTransform(sm, [0, 0.15, 0.85, 1], [0.6, 1, 1, 0.95]);

    return (
      <motion.div
        ref={ref}
        style={{
          opacity: o,
          rotateX: rotX,
          scale: sc,
          transformPerspective: 1500,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center top',
        }}
        className="will-change-transform transform-gpu"
      >
        {children}
      </motion.div>
    );
  }

  if (variant === 'scaleReveal') {
    const o = useTransform(sm, [0, 0.1, 0.25], [0, 0.4, 1]);
    const sc = useTransform(sm, [0, 0.2, 0.8, 1], [0.5, 1.05, 1, 0.95]);
    const blur = useTransform(sm, [0, 0.2], [15, 0]);
    const y = useTransform(sm, [0, 0.2, 0.8, 1], [80, 0, 0, -40]);

    return (
      <motion.div
        ref={ref}
        style={{
          opacity: o,
          scale: sc,
          y,
          filter: blur.get() > 1 ? `blur(${blur}px)` : 'none',
        }}
        className="will-change-transform transform-gpu"
      >
        {children}
      </motion.div>
    );
  }

  if (variant === 'parallax') {
    const y = useTransform(sm, [0, 1], [120, -120]);
    const o = useTransform(sm, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

    return (
      <motion.div
        ref={ref}
        style={{ opacity: o, y }}
        className="will-change-transform transform-gpu"
      >
        {children}
      </motion.div>
    );
  }

  // DEFAULT: Premium 3D reveal with depth
  const o = useTransform(sm, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(sm, [0, 0.15, 0.85, 1], [180, 0, 0, -180]);
  const s = useTransform(sm, [0, 0.15, 0.85, 1], [0.75, 1, 1, 0.85]);
  const r = useTransform(sm, [0, 0.15, 0.85, 1], [25, 0, 0, -25]);
  const z = useTransform(sm, [0, 0.15, 0.85, 1], [-300, 0, 0, -300]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity: o, y, scale: s, rotateX: r, z,
        transformPerspective: 2000,
        transformStyle: 'preserve-3d',
      }}
      className="will-change-transform transform-gpu"
    >
      {children}
    </motion.div>
  );
};

SectionReveal.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'hero', 'slideIn', 'flipIn', 'scaleReveal', 'parallax']),
  direction: PropTypes.oneOf(['up', 'left', 'right']),
};

export default SectionReveal;