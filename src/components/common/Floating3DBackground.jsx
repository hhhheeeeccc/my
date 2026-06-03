import React, { useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const FloatingShape = ({ index, mouseX, mouseY }) => {
  const { scrollYProgress } = useScroll();

  const props = useMemo(() => ({
    size: 40 + Math.random() * 120,
    top: Math.random() * 100 + "%",
    left: Math.random() * 100 + "%",
    duration: 15 + Math.random() * 25,
    z: Math.random() * -800 - 100,
    parallaxFactor: (Math.random() - 0.5) * 250,
    scrollSpeed: (Math.random() - 0.5) * 800,
    color: i => i % 3 === 0 ? 'bg-blue-500/10' : i % 3 === 1 ? 'bg-cyan-400/10' : 'bg-indigo-600/10',
    type: Math.random() > 0.6 ? 'circle' : (Math.random() > 0.3 ? 'square' : 'pill')
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
        height: props.type === 'pill' ? props.size / 2 : props.size,
        x,
        y,
        z: props.z,
        transformStyle: "preserve-3d"
      }}
      animate={{
        rotateX: [0, 360],
        rotateY: [0, 360],
        rotateZ: [0, 180],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: props.duration,
        repeat: Infinity,
        ease: "linear"
      }}
      className={`absolute pointer-events-none blur-[2px] ${props.color(index)} ${
        props.type === 'circle' ? 'rounded-full' :
        props.type === 'pill' ? 'rounded-full border border-white/5' :
        'rounded-3xl border-2 border-white/5'
      } shadow-[0_0_40px_rgba(59,130,246,0.05)]`}
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,41,59,0.2)_0%,transparent_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.4)_0%,transparent_100%)] pointer-events-none" />
      {[...Array(25)].map((_, i) => (
        <FloatingShape key={i} index={i} mouseX={springX} mouseY={springY} />
      ))}
    </div>
  );
};

export default Floating3DBackground;
