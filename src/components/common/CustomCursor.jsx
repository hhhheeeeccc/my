import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform, useVelocity, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);
  const [ripples, setRipples] = useState([]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const dotX = useSpring(cursorX, { damping: 35, stiffness: 400 });
  const dotY = useSpring(cursorY, { damping: 35, stiffness: 400 });

  const velocityX = useVelocity(cursorX);
  const velocityY = useVelocity(cursorY);

  const velocity = useTransform([velocityX, velocityY], ([x, y]) =>
    Math.sqrt(x ** 2 + y ** 2)
  );

  const scaleX = useSpring(useTransform(velocity, [0, 1000], [1, 1.8]), { stiffness: 300, damping: 30 });
  const scaleY = useSpring(useTransform(velocity, [0, 1000], [1, 0.6]), { stiffness: 300, damping: 30 });

  const rotation = useTransform([velocityX, velocityY], ([x, y]) => {
    if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) return 0;
    return Math.atan2(y, x) * (180 / Math.PI);
  });

  useEffect(() => {
    const moveMouse = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = target.tagName === 'A' ||
                         target.tagName === 'BUTTON' ||
                         target.closest('button') ||
                         target.closest('a');

      const isTextElement = target.tagName === 'P' ||
                           target.tagName === 'H1' ||
                           target.tagName === 'H2' ||
                           target.tagName === 'H3' ||
                           target.tagName === 'SPAN' ||
                           target.tagName === 'LI';

      setIsHovering(isClickable);
      setIsText(isTextElement && !isClickable);
    };

    const handleClick = (e) => {
      const id = Date.now();
      setRipples((prev) => [...prev, { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1000);
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="fixed w-8 h-8 rounded-full border border-blue-500/50 pointer-events-none z-[9998]"
            style={{
              left: ripple.x - 16,
              top: ripple.y - 16,
            }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-blue-500 pointer-events-none z-[9999] hidden md:block origin-center"
        style={{
          x: useTransform(smoothX, (v) => v - 16),
          y: useTransform(smoothY, (v) => v - 16),
          scale: isHovering ? 2.5 : isText ? 1.5 : 1,
          scaleX: isHovering ? 2.5 : scaleX,
          scaleY: isHovering ? 2.5 : scaleY,
          rotate: rotation,
          backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
          mixBlendMode: isText ? 'difference' : 'normal',
          borderColor: isText ? 'white' : '#3b82f6',
          boxShadow: isHovering ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
        }}
      >
        {isHovering && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 rounded-full bg-blue-500/20 blur-md"
          />
        )}
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-blue-600 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: useTransform(dotX, (v) => v - 4),
          y: useTransform(dotY, (v) => v - 4),
          scale: isHovering ? 0 : 1,
          mixBlendMode: isText ? 'difference' : 'normal',
          backgroundColor: isText ? 'white' : '#2563eb',
        }}
      />
    </>
  );
};

export default CustomCursor;
