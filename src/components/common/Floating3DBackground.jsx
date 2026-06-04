import React, { useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const FloatingShape = ({ index, mouseX, mouseY }) => {
  const { scrollYProgress } = useScroll();

  const props = useMemo(() => ({
    size: 50 + Math.random() * 150,
    top: Math.random() * 100 + "%",
    left: Math.random() * 100 + "%",
    duration: 15 + Math.random() * 25,
    z: Math.random() * -600 - 100,
    parallaxFactor: (Math.random() - 0.5) * 200,
    scrollSpeed: (Math.random() - 0.5) * 800,
    color: i => i % 3 === 0 ? 'rgba(59, 130, 246, 0.08)' : i % 3 === 1 ? 'rgba(6, 182, 212, 0.08)' : 'rgba(99, 102, 241, 0.08)',
    type: Math.random() > 0.4 ? 'circle' : 'blob'
  }), [index]);

  const x = useTransform(mouseX, [-0.5, 0.5], [-props.parallaxFactor, props.parallaxFactor]);
  const yParallax = useTransform(mouseY, [-0.5, 0.5], [-props.parallaxFactor, props.parallaxFactor]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, props.scrollSpeed]);

  const y = useTransform(() => yParallax.get() + scrollY.get());

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: props.top,
        left: props.left,
        width: props.size,
        height: props.size,
        x,
        y,
        z: props.z,
        backgroundColor: props.color(index),
        transformStyle: "preserve-3d",
        filter: "blur(40px)",
      }}
      animate={{
        rotate: [0, 360],
        scale: [1, 1.3, 1],
        borderRadius: props.type === 'circle' ? "50%" : ["40% 60% 70% 30% / 40% 50% 60% 70%", "60% 40% 30% 70% / 50% 60% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 70%"]
      }}
      transition={{
        duration: props.duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="pointer-events-none"
    />
  );
};

const Floating3DBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden perspective-[1500px]">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/20 via-white to-indigo-50/20 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/20" />
      {[...Array(12)].map((_, i) => (
        <FloatingShape key={i} index={i} mouseX={springX} mouseY={springY} />
      ))}
    </div>
  );
};

export default Floating3DBackground;
