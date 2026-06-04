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

  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);
  const rotateX = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [20, 0, 0, -20]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        scale,
        y,
        rotateX,
        transformStyle: "preserve-3d",
        perspective: "1200px"
      }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
