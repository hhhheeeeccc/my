import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ParallaxContainer = ({ children, intensity = 20, className = "" }) => {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const moveX = useTransform(springX, [-0.5, 0.5], [-intensity, intensity]);
  const moveY = useTransform(springY, [-0.5, 0.5], [-intensity, intensity]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [intensity / 4, -intensity / 4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-intensity / 4, intensity / 4]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative will-change-transform ${className}`}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        style={{
          x: moveX,
          y: moveY,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxContainer;
