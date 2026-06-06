import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const SectionReveal = ({ children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const sm = useSpring(scrollYProgress, { stiffness: 60, damping: 25, mass: 1.2, restDelta: 0.0001 });
  const o = useTransform(sm, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(sm, [0, 0.2, 0.8, 1], [150, 0, 0, -150]);
  const s = useTransform(sm, [0, 0.2, 0.8, 1], [0.85, 1, 1, 0.85]);
  const r = useTransform(sm, [0, 0.2, 0.8, 1], [15, 0, 0, -15]);

  return (
    <motion.div ref={ref} style={{ opacity: o, y, scale: s, rotateX: r, perspective: "2000px" }} className="will-change-transform transform-gpu">
      {children}
    </motion.div>
  );
};

SectionReveal.propTypes = {
  children: PropTypes.node.isRequired
};

export default SectionReveal;
