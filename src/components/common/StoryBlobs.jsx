import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const StoryBlobs = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -800]);
  const r = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <motion.div style={{ y: y1, rotate: r }} className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-blue-600/10 to-transparent blur-[120px]" />
      <motion.div style={{ y: y2, rotate: -360 }} className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-cyan-600/10 to-transparent blur-[150px]" />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-indigo-600/5 blur-[100px]" />
    </div>
  );
};

export default StoryBlobs;
