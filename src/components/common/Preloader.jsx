import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState('counting'); // counting → reveal → done
  const canvasRef = useRef(null);

  // Animated counter
  useEffect(() => {
    if (phase !== 'counting') return;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Eased progress
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * 100));
      if (progress < 1) requestAnimationFrame(tick);
      else setTimeout(() => setPhase('reveal'), 300);
    };
    requestAnimationFrame(tick);
  }, [phase]);

  // Reveal phase → done
  useEffect(() => {
    if (phase !== 'reveal') return;
    const timer = setTimeout(() => {
      setPhase('done');
      setTimeout(() => onComplete?.(), 100);
    }, 800);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Animated background grid lines */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px bg-cyan-500/30"
                style={{ left: 0, right: 0, top: `${i * 5}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center">
            {/* Counter number */}
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                key={count}
                className="text-[12rem] font-black text-white/90 leading-none tabular-nums tracking-tighter"
                initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                {String(count).padStart(3, '0')}
              </motion.span>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="mt-8 h-[2px] bg-cyan-500/80"
              initial={{ width: 0 }}
              animate={{ width: phase === 'reveal' ? '100%' : `${count}%` }}
              transition={{ duration: phase === 'reveal' ? 0.6 : 0.1, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Bottom text */}
            <motion.p
              className="mt-6 text-sm text-slate-500 font-medium tracking-[0.3em] uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase === 'reveal' ? 0 : 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Loading Experience
            </motion.p>

            {/* Reveal flash */}
            {phase === 'reveal' && (
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{ duration: 0.6 }}
              />
            )}
          </div>

          {/* Corner decorations */}
          {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
            <motion.div
              key={pos}
              className={`absolute ${pos} w-3 h-3`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="w-full h-px bg-cyan-500 absolute top-0 left-0" />
              <div className="w-px h-full bg-cyan-500 absolute top-0 left-0" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;