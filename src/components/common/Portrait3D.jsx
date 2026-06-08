import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Portrait3D = () => {
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for high-end feel
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 25 });

  // Rotate values to simulate head following mouse
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);

  // Parallax translation for the image inside the frame
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["10px", "-10px"]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], ["10px", "-10px"]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="relative flex items-center justify-center py-10"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-72 h-96 md:w-80 md:h-[420px] rounded-[3.5rem] liquid-glass cursor-pointer group shadow-2xl"
      >
        {/* Inner Content with parallax depth */}
        <motion.div
          style={{
            transform: "translateZ(60px)",
            transformStyle: "preserve-3d",
            x: translateX,
            y: translateY,
          }}
          className="absolute inset-5 rounded-[3rem] overflow-hidden bg-slate-900 shadow-2xl"
        >
          {/* Professional Man using Laptop image */}
          <img
            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop"
            alt="Professional man using laptop"
            className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          />

          {/* Liquid overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-cyan-500/10 opacity-30 group-hover:opacity-10 transition-opacity duration-700" />

          {/* Reflection glow following mouse (CSS-based simple version) */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
               style={{
                 background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
                 transform: "translateZ(80px)"
               }}
          />
        </motion.div>

        {/* Decorative glass layers */}
        <div className="absolute -inset-6 border border-white/10 rounded-[4.5rem] pointer-events-none opacity-40 blur-[1px]" />
        <div className="absolute -inset-12 border border-white/5 rounded-[5.5rem] pointer-events-none opacity-20" />

        {/* Magnetic floating particles or elements could go here */}
      </motion.div>
    </div>
  );
};

export default Portrait3D;
