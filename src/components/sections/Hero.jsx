import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Magnetic from '../common/Magnetic';

const Hero = () => {
  const { t, i18n } = useTranslation();

  // 3D Parallax Mouse Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX - innerWidth / 2) / 30;
    const y = (clientY - innerHeight / 2) / 30;
    mouseX.set(x);
    mouseY.set(y);
  };

  const springX = useSpring(mouseX, { stiffness: 120, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 25 });

  const { scrollY } = useScroll();
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const contentY = useTransform(scrollY, [0, 400], [0, -50]);

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* 3D Character Area - Background is handled by GlobalCanvas */}

      {/* Hero Content - Immersive 3D Motion */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateY: contentY,
          opacity: contentOpacity
        }}
        className="relative z-20 flex flex-col items-center text-center px-6 pt-32 pb-40 max-w-7xl mx-auto pointer-events-none"
      >
        {/* H1: Cinematic & Dynamic */}
        <motion.h1
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-0.03em] font-normal text-white font-display pointer-events-auto"
        >
          {t('hero.title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-slate-200 text-base sm:text-lg max-w-2xl mt-10 leading-relaxed font-body pointer-events-auto opacity-70"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Cinematic CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="mt-14 pointer-events-auto"
        >
          <Magnetic>
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="liquid-glass rounded-full px-16 py-6 text-lg text-white font-black cursor-pointer transition-all duration-500 inline-block border border-cyan-400/30"
            >
              {t('hero.ctaWork')}
            </motion.a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* 3D Motion Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-24 bg-gradient-to-b from-cyan-400/60 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;