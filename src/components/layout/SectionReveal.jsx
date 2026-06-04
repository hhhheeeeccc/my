import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const SectionReveal = ({ children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [30, 0, 0, -30]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        y,
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
