import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  const dotConfig = { damping: 35, stiffness: 400 };
  const dotX = useSpring(0, dotConfig);
  const dotY = useSpring(0, dotConfig);

  const velocity = useMotionValue(0);
  const scaleX = useSpring(useTransform(velocity, [0, 500], [1, 1.5]), { stiffness: 300, damping: 30 });
  const scaleY = useSpring(useTransform(velocity, [0, 500], [1, 0.7]), { stiffness: 300, damping: 30 });
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

      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
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
                           target.tagName === 'LI';

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
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-blue-500 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovering ? 2.5 : isText ? 1.5 : 1,
          scaleX: isHovering ? 2.5 : scaleX,
          scaleY: isHovering ? 2.5 : scaleY,
          rotate: rotation,
          backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
          mixBlendMode: isText ? 'difference' : 'normal',
          borderColor: isText ? 'white' : '#3b82f6',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-blue-600 pointer-events-none z-[9999] hidden md:block"
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
