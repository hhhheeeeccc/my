import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TextReveal3D = ({ text, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  // Split text into words, then words into characters to preserve word spacing
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.02 * i,
      },
    }),
  };

  const charVariants = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
      },
    },
    hidden: {
      opacity: 0,
      y: 60,
      rotateX: -90,
      rotateY: 10,
      translateZ: -100,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{ transformStyle: "preserve-3d", perspective: "1500px" }}
      className={`flex flex-wrap overflow-visible ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.3em] py-1" style={{ transformStyle: "preserve-3d" }}>
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={charVariants}
              className="inline-block origin-bottom transition-all"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

export default TextReveal3D;
