import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const SectionReveal = ({ children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 25,
    mass: 1.2,
    restDelta: 0.0001
  });

  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [150, 0, 0, -150]);
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.85, 1, 1, 0.85]);
  const rotateX = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [15, 0, 0, -15]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        y,
        scale,
        rotateX,
        perspective: "2000px"
      }}
      className="will-change-transform transform-gpu"
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
