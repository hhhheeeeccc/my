import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const SectionReveal = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        rotateX: 45,
        y: 100,
        scale: 0.9,
        z: -200
      }}
      animate={isInView ? {
        opacity: 1,
        rotateX: 0,
        y: 0,
        scale: 1,
        z: 0
      } : {
        opacity: 0,
        rotateX: 45,
        y: 100,
        scale: 0.9,
        z: -200
      }}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.8 }
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
