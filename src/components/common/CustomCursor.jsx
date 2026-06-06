import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, useVelocity, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);
  const [ripples, setRipples] = useState([]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sc = { damping: 25, stiffness: 250 };
  const sx = useSpring(mx, sc);
  const sy = useSpring(my, sc);
  const dx = useSpring(mx, { damping: 35, stiffness: 400 });
  const dy = useSpring(my, { damping: 35, stiffness: 400 });
  const vel = useTransform([useVelocity(mx), useVelocity(my)], ([x, y]) => Math.sqrt(x ** 2 + y ** 2));
  const sX = useSpring(useTransform(vel, [0, 1000], [1, 1.8]), { stiffness: 300, damping: 30 });
  const sY = useSpring(useTransform(vel, [0, 1000], [1, 0.6]), { stiffness: 300, damping: 30 });
  const rot = useTransform([useVelocity(mx), useVelocity(my)], ([x, y]) => (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) ? 0 : Math.atan2(y, x) * (180 / Math.PI));

  useEffect(() => {
    const t = globalThis;
    const onMove = (e) => { mx.set(e.clientX); my.set(e.clientY); };
    const onOver = (e) => {
      const el = e.target;
      const isC = el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('button') || el.closest('a');
      const isT = ['P', 'H1', 'H2', 'H3', 'SPAN', 'LI'].includes(el.tagName) || el.closest('p, h1, h2, h3, span, li');
      setIsHovering(!!isC); setIsText(!!isT && !isC);
    };
    const onDown = (e) => {
      const id = Date.now(); setRipples(p => [...p, { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => setRipples(p => p.filter(r => r.id !== id)), 1000);
    };
    t.addEventListener('mousemove', onMove); t.addEventListener('mouseover', onOver); t.addEventListener('mousedown', onDown);
    return () => { t.removeEventListener('mousemove', onMove); t.removeEventListener('mouseover', onOver); t.removeEventListener('mousedown', onDown); };
  }, [mx, my]);

  return (
    <>
      <AnimatePresence>{ripples.map(r => <motion.div key={r.id} initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 4, opacity: 0 }} exit={{ opacity: 0 }} className="fixed w-8 h-8 rounded-full border border-blue-500/50 pointer-events-none z-[9998]" style={{ left: r.x - 16, top: r.y - 16 }} />)}</AnimatePresence>
      <motion.div className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-blue-500 pointer-events-none z-[9999] hidden md:block origin-center" style={{ x: useTransform(sx, v => v - 16), y: useTransform(sy, v => v - 16), scale: isHovering ? 2.5 : isText ? 1.5 : 1, scaleX: isHovering ? 2.5 : sX, scaleY: isHovering ? 2.5 : sY, rotate: rot, backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.15)' : 'transparent', mixBlendMode: isText ? 'difference' : 'normal', borderColor: isText ? 'white' : '#3b82f6', boxShadow: isHovering ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none' }}>{isHovering && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 rounded-full bg-blue-500/20 blur-md" />}</motion.div>
      <motion.div className="fixed top-0 left-0 w-2 h-2 rounded-full bg-blue-600 pointer-events-none z-[9999] hidden md:block" style={{ x: useTransform(dx, v => v - 4), y: useTransform(dy, v => v - 4), scale: isHovering ? 0 : 1, mixBlendMode: isText ? 'difference' : 'normal', backgroundColor: isText ? 'white' : '#2563eb' }} />
    </>
  );
};
export default CustomCursor;
