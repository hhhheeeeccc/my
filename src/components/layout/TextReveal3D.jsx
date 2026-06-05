import React from 'react';
import { motion } from 'framer-motion';

const TextReveal3D = ({ text, className = "" }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1 * i,
        ease: [0.16, 1, 0.3, 1]
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      z: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 80,
        mass: 1,
      },
    },
    hidden: {
      opacity: 0,
      y: 100,
      rotateX: 45,
      z: -50,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 80,
      },
    },
  };

  return (
    <motion.div
      style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
      className={`flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden py-4 mr-[0.25em] last:mr-0 transform-gpu">
          <motion.span
            variants={child}
            className="inline-block transform-gpu origin-top"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

export default TextReveal3D;
