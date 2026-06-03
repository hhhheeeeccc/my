import React, { useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const FloatingShape = ({ index, mouseX, mouseY }) => {
  const { scrollYProgress } = useScroll();

  const props = useMemo(() => ({
    size: 20 + Math.random() * 60,
    top: Math.random() * 100 + "%",
    left: Math.random() * 100 + "%",
    duration: 10 + Math.random() * 20,
    z: Math.random() * -400 - 50,
    parallaxFactor: (Math.random() - 0.5) * 150,
    scrollSpeed: (Math.random() - 0.5) * 500,
    color: i => i % 3 === 0 ? 'bg-blue-500/10' : i % 3 === 1 ? 'bg-cyan-500/10' : 'bg-indigo-500/10',
    type: Math.random() > 0.5 ? 'circle' : 'square'
  }), [index]);

  const x = useTransform(mouseX, [-0.5, 0.5], [-props.parallaxFactor, props.parallaxFactor]);
  const yParallax = useTransform(mouseY, [-0.5, 0.5], [-props.parallaxFactor, props.parallaxFactor]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, props.scrollSpeed]);

  const y = useTransform(() => yParallax.get() + scrollY.get());

  return (
    <motion.div
      style={{
        top: props.top,
        left: props.left,
        width: props.size,
        height: props.size,
        x,
        y,
        z: props.z,
        transformStyle: "preserve-3d"
      }}
      animate={{
        rotateX: [0, 360],
        rotateY: [0, 360],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: props.duration,
        repeat: Infinity,
        ease: "linear"
      }}
      className={`absolute pointer-events-none blur-sm ${props.color(index)} ${props.type === 'circle' ? 'rounded-full' : 'rounded-2xl border-2 border-blue-500/10'}`}
    />
  );
};

const Floating3DBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden perspective-[1200px]">
      {[...Array(15)].map((_, i) => (
        <FloatingShape key={i} index={i} mouseX={springX} mouseY={springY} />
      ))}
    </div>
  );
};

export default Floating3DBackground;
