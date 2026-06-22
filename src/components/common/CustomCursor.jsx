import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, useVelocity, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [visible, setVisible] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { damping: 25, stiffness: 250 });
  const sy = useSpring(my, { damping: 25, stiffness: 250 });
  const dx = useSpring(mx, { damping: 35, stiffness: 400 });
  const dy = useSpring(my, { damping: 35, stiffness: 400 });
  const vel = useTransform([useVelocity(mx), useVelocity(my)], ([x, y]) => Math.sqrt(x ** 2 + y ** 2));
  const sX = useSpring(useTransform(vel, [0, 1000], [1, 1.6]), { stiffness: 300, damping: 30 });
  const sY = useSpring(useTransform(vel, [0, 1000], [1, 0.7]), { stiffness: 300, damping: 30 });

  useEffect(() => {
    const t = globalThis;
    const onMove = (e) => { mx.set(e.clientX); my.set(e.clientY); if (!visible) setVisible(true); };
    const onLeave = () => setVisible(false);
    const onOver = (e) => {
      const el = e.target;
      const isC = el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('button') || el.closest('a') || el.closest('[role="button"]');
      const isT = ['P', 'H1', 'H2', 'H3', 'SPAN', 'LI'].includes(el.tagName) || el.closest('p, h1, h2, h3, span, li');
      setIsHovering(!!isC); setIsText(!!isT && !isC);
    };
    const onDown = (e) => {
      const id = Date.now(); setRipples(p => [...p, { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => setRipples(p => p.filter(r => r.id !== id)), 800);
    };
    t.addEventListener('mousemove', onMove);
    t.addEventListener('mouseleave', onLeave);
    t.addEventListener('mouseover', onOver);
    t.addEventListener('mousedown', onDown);
    return () => {
      t.removeEventListener('mousemove', onMove);
      t.removeEventListener('mouseleave', onLeave);
      t.removeEventListener('mouseover', onOver);
      t.removeEventListener('mousedown', onDown);
    };
  }, [mx, my, visible]);

  const cursorColor = isHovering ? 'cyan' : '#06b6d4';
  const cursorSize = isHovering ? 48 : 24;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="hidden md:block"
        >
          {/* Click ripples */}
          {ripples.map(r => (
            <motion.div
              key={r.id}
              initial={{ scale: 0, opacity: 0.4 }}
              animate={{ scale: 3, opacity: 0 }}
              className="fixed w-6 h-6 rounded-full border pointer-events-none z-[9998]"
              style={{ left: r.x - 12, top: r.y - 12, borderColor: cursorColor }}
            />
          ))}

          {/* Main cursor ring */}
          <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{
              width: cursorSize,
              height: cursorSize,
              x: useTransform(sx, v => v - cursorSize / 2),
              y: useTransform(sy, v => v - cursorSize / 2),
              scale: isHovering ? 1 : undefined,
              scaleX: isHovering ? 1 : sX,
              scaleY: isHovering ? 1 : sY,
              border: `1.5px solid ${isText ? 'white' : cursorColor}`,
              backgroundColor: isHovering ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
              boxShadow: isHovering ? '0 0 30px rgba(6, 182, 212, 0.2)' : 'none',
              transition: 'width 0.3s ease, height 0.3s ease, border-color 0.2s',
            }}
          />

          {/* Center dot */}
          <motion.div
            className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-cyan-400 pointer-events-none z-[9999] mix-blend-difference"
            style={{
              x: useTransform(dx, v => v - 3),
              y: useTransform(dy, v => v - 3),
              scale: isHovering ? 0 : 1,
              backgroundColor: isText ? 'white' : '#22d3ee',
              transition: 'background-color 0.2s',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;