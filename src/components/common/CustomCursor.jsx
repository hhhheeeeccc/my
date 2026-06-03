import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });

  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  const dotConfig = { damping: 40, stiffness: 500, mass: 0.2 };
  const dotX = useSpring(0, dotConfig);
  const dotY = useSpring(0, dotConfig);

  const velocity = useMotionValue(0);
  const scaleX = useSpring(useTransform(velocity, [0, 800], [1, 1.8]), { stiffness: 400, damping: 35 });
  const scaleY = useSpring(useTransform(velocity, [0, 800], [1, 0.6]), { stiffness: 400, damping: 35 });
  const rotation = useMotionValue(0);

  useEffect(() => {
    let lastTime = Date.now();

    const moveMouse = (e) => {
      const now = Date.now();
      const dt = now - lastTime;

      if (dt > 0) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const v = dist / dt * 100; // pixels per second
        velocity.set(v);

        if (dist > 0) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          rotation.set(angle);
        }
      }

      mousePos.current = { x: e.clientX, y: e.clientY };
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      lastTime = now;

      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
      dotX.set(e.clientX - 4);
      dotY.set(e.clientY - 4);
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
                           target.tagName === 'LI' ||
                           target.classList.contains('inline-block');

      setIsHovering(isClickable);
      setIsText(isTextElement && !isClickable);
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, dotX, dotY, velocity, rotation]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-blue-500/50 pointer-events-none z-[9999] hidden md:block backdrop-blur-[2px]"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovering ? 2.8 : isText ? 1.8 : 1,
          scaleX: isHovering ? 2.8 : scaleX,
          scaleY: isHovering ? 2.8 : scaleY,
          rotate: rotation,
          backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          mixBlendMode: isText ? 'difference' : 'normal',
          borderColor: isText ? 'rgba(255,255,255,0.8)' : 'rgba(59, 130, 246, 0.5)',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-blue-600 pointer-events-none z-[9999] hidden md:block shadow-[0_0_15px_rgba(37,99,235,0.8)]"
        style={{
          x: dotX,
          y: dotY,
          scale: isHovering ? 0 : 1,
          mixBlendMode: isText ? 'difference' : 'normal',
          backgroundColor: isText ? 'white' : '#2563eb',
        }}
      />
    </>
  );
};

export default CustomCursor;
