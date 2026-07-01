import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState('counting');
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  const labelRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase !== 'counting') return;

    const obj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => { timerRef.current = setTimeout(() => setPhase('reveal'), 400); }
    });

    tl.to(obj, {
      val: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => setCount(Math.floor(obj.val)),
    });

    if (progressBarRef.current) {
      tl.to(progressBarRef.current, {
        scaleX: 1,
        duration: 2.5,
        ease: 'power2.inOut',
      }, '<');
    }

    if (labelRef.current) {
      tl.fromTo(labelRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.3
      );
    }

    return () => { tl.kill(); clearTimeout(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'reveal') return;
    const timer = setTimeout(() => {
      setPhase('done');
      setTimeout(() => onComplete?.(), 100);
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center overflow-hidden"
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
                style={{ left: 0, right: 0, top: `${i * 3.33}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>

          <motion.div
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 0.5 }}
          />

          <div className="relative flex flex-col items-center">
            <div className="overflow-hidden">
              <motion.span
                ref={counterRef}
                key={count}
                className="text-[14rem] font-black text-white/90 leading-none tabular-nums tracking-tighter"
                style={{ fontFamily: 'var(--font-display)' }}
                initial={{ y: 50, opacity: 0, filter: 'blur(10px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
              >
                {String(count).padStart(3, '0')}
              </motion.span>
            </div>

            <div className="mt-10 w-48 h-[1px] bg-white/[0.06] rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                style={{ transformOrigin: 'left', transform: 'scaleX(0)' }}
              />
            </div>

            <p
              ref={labelRef}
              className="mt-6 text-[11px] text-slate-600 font-bold tracking-[0.4em] uppercase opacity-0"
            >
              Loading Experience
            </p>

            {phase === 'reveal' && (
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.12, 0] }}
                transition={{ duration: 0.8 }}
              />
            )}
          </div>

          {[
            'top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'
          ].map((pos, i) => (
            <motion.div
              key={pos}
              className={`absolute ${pos} w-4 h-4 opacity-0`}
              animate={{ opacity: 0.25 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
            >
              <div className="absolute top-0 left-0 w-full h-px bg-cyan-500/50" />
              <div className="absolute top-0 left-0 w-px h-full bg-cyan-500/50" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;