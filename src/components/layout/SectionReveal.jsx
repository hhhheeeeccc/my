import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const SectionReveal = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        rotateX: 25,
        y: 150,
        scale: 0.85,
        translateZ: -500
      }}
      animate={isInView ? {
        opacity: 1,
        rotateX: 0,
        y: 0,
        scale: 1,
        translateZ: 0
      } : {
        opacity: 0,
        rotateX: 25,
        y: 150,
        scale: 0.85,
        translateZ: -500
      }}
      transition={{
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 1 }
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "2000px"
      }}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
