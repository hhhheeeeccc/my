import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ParallaxContainer = ({ children, intensity = 20, className = "" }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });

  const tx = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
  const ty = useTransform(sy, [-0.5, 0.5], [-intensity, intensity]);
  const rx = useTransform(sy, [-0.5, 0.5], [intensity / 4, -intensity / 4]);
  const ry = useTransform(sx, [-0.5, 0.5], [-intensity / 4, intensity / 4]);

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }} className={`relative will-change-transform ${className}`} style={{ perspective: "1200px" }}>
      <motion.div style={{ x: tx, y: ty, rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
};

ParallaxContainer.propTypes = {
  children: PropTypes.node.isRequired,
  intensity: PropTypes.number,
  className: PropTypes.string
};

export default ParallaxContainer;
