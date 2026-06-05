import React from 'react';
import { motion } from 'framer-motion';

const TextReveal3D = ({ text, className = "" }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 90,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ perspective: "1000px" }}
      className={`flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden pb-2 mr-[0.2em] last:mr-0">
          <motion.span
            variants={child}
            className="inline-block transform-gpu origin-bottom"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

export default TextReveal3D;
