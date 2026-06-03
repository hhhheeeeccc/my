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
        y: 60,
        scale: 0.96,
        rotateX: 10,
        z: -50
      }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        z: 0
      } : {
        opacity: 0,
        y: 60,
        scale: 0.96,
        rotateX: 10,
        z: -50
      }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1200px"
      }}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
