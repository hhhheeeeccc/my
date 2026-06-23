import React, { useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Magnetic from '../common/Magnetic';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const marqueeRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Parallax / Spring movement for mouse interaction
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  const springX = useTransform(mouseX, [-0.5, 0.5], [-30, 30]);
  const springY = useTransform(mouseY, [-0.5, 0.5], [-30, 30]);
  const deepSpringX = useTransform(mouseX, [-0.5, 0.5], [-60, 60]);
  const deepSpringY = useTransform(mouseY, [-0.5, 0.5], [-60, 60]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  // Scroll animations
  const contentOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.92]);
  const contentY = useTransform(scrollYProgress, [0, 0.08], [0, -80]);
  const marqueeOpacity = useTransform(scrollYProgress, [0.02, 0.08], [1, 0]);
  const titleLineHeight = useTransform(scrollYProgress, [0, 0.06], [0.95, 1.1]);

  // Split title into lines for staggered reveal
  const titleText = t('hero.title');
  const titleWords = useMemo(() => titleText.split(' '), [titleText]);

  // Decorative lines stagger
  const lineDelays = [2.8, 3.0, 3.1, 3.3];

  return (
    <section
      ref={sectionRef}
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-[300vh] w-full overflow-hidden bg-black"
    >
      {/* Sticky hero content that fades on scroll */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        {/* Technical FUI Brackets around the viewport center */}
        <motion.div
          style={{ x: deepSpringX, y: deepSpringY, opacity: contentOpacity }}
          className="absolute inset-0 pointer-events-none z-10"
        >
          {/* Top Left Bracket */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 2.2 }}
            className="absolute top-1/4 left-1/4 w-12 h-12 border-t border-l border-cyan-500/20"
          />
          {/* Top Right Bracket */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 2.3 }}
            className="absolute top-1/4 right-1/4 w-12 h-12 border-t border-r border-cyan-500/20"
          />
          {/* Bottom Left Bracket */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 2.4 }}
            className="absolute bottom-1/4 left-1/4 w-12 h-12 border-b border-l border-cyan-500/20"
          />
          {/* Bottom Right Bracket */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 2.5 }}
            className="absolute bottom-1/4 right-1/4 w-12 h-12 border-b border-r border-cyan-500/20"
          />

          {/* Floating Data Nodes */}
          <motion.div
            animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[30%] left-[20%] flex flex-col gap-1"
          >
            <div className="w-1 h-1 bg-cyan-400" />
            <span className="text-[7px] text-cyan-400 font-bold tracking-tighter">TRK_ID: 0842</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-[30%] right-[20%] flex flex-col items-end gap-1"
          >
            <div className="w-1 h-1 bg-violet-400" />
            <span className="text-[7px] text-violet-400 font-bold tracking-tighter">SIG_STR: HIGH</span>
          </motion.div>
        </motion.div>

        {/* Decorative corner accents (original) */}
        <div className="absolute top-10 left-10 md:top-16 md:left-16" style={{ x: deepSpringX, y: deepSpringY }}>
          <motion.div
            className="w-20 h-px bg-gradient-to-r from-cyan-500/60 to-transparent"
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, delay: lineDelays[0], ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="w-px h-20 bg-gradient-to-b from-cyan-500/60 to-transparent mt-0"
            initial={{ scaleY: 0, transformOrigin: 'top' }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.8, delay: lineDelays[1], ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="absolute top-10 right-10 md:top-16 md:right-16" style={{ x: deepSpringX, y: deepSpringY }}>
          <motion.div
            className="w-20 h-px bg-gradient-to-l from-cyan-500/60 to-transparent"
            initial={{ scaleX: 0, transformOrigin: 'right' }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, delay: lineDelays[2], ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="w-px h-20 bg-gradient-to-b from-cyan-500/60 to-transparent mt-0"
            initial={{ scaleY: 0, transformOrigin: 'top' }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.8, delay: lineDelays[3], ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Floating label - top center */}
        <motion.div
          initial={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-none"
        >
          <div className="w-8 h-px bg-cyan-500/40" />
          <span className="text-[11px] tracking-[0.4em] text-slate-500 font-medium uppercase whitespace-nowrap">
            Portfolio — 2024
          </span>
          <div className="w-8 h-px bg-cyan-500/40" />
        </motion.div>

        {/* Main hero content with parallax */}
        <motion.div
          style={{ x: springX, y: springY, opacity: contentOpacity, scale: contentScale, translateY: contentY }}
          className="relative z-20 flex flex-col items-center text-center px-6 pt-28 pb-36 max-w-7xl mx-auto pointer-events-none"
        >
          {/* Role subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-5 mb-12 pointer-events-auto"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/60" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.3em] text-cyan-400/70 uppercase">
              {isAr ? 'مطور واجهات أمامية' : 'Frontend Developer & Designer'}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/60" />
          </motion.div>

          {/* Title - word by word reveal with 3D perspective */}
          <div className="perspective-[1200px] w-full" ref={titleRef}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-normal text-white font-display leading-[0.85] tracking-[-0.04em] pointer-events-auto flex flex-wrap justify-center">
              {titleWords.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.2em] last:mr-0">
                  <motion.span
                    className="inline-block origin-bottom"
                    initial={{ y: '120%', rotateX: 60, opacity: 0, filter: 'blur(10px)' }}
                    animate={{ y: '0%', rotateX: 0, opacity: 1, filter: 'blur(0px)' }}
                    transition={{
                      duration: 1.2,
                      delay: 2.6 + i * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    style={{ lineHeight: titleLineHeight }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          {/* Subtitle - fade up with blur */}
          <motion.p
            ref={subtitleRef}
            initial={{ opacity: 0, y: 35, filter: 'blur(8px)' }}
            animate={{ opacity: 0.6, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, delay: 3.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-400 text-base sm:text-lg max-w-2xl mt-12 leading-relaxed font-body pointer-events-auto"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Button with magnetic + glow */}
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 3.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 pointer-events-auto"
          >
            <Magnetic>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="group relative inline-flex items-center gap-4 px-16 py-5 text-[13px] font-black tracking-[0.2em] uppercase text-white rounded-full cursor-pointer overflow-hidden border border-white/[0.08] hover:border-cyan-400/30 transition-all duration-700"
                style={{
                  boxShadow: '0 0 40px rgba(6, 182, 212, 0), 0 0 80px rgba(6, 182, 212, 0)',
                }}
                onHoverStart={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(6, 182, 212, 0.15), 0 0 80px rgba(6, 182, 212, 0.05)';
                }}
                onHoverEnd={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(6, 182, 212, 0), 0 0 80px rgba(6, 182, 212, 0)';
                }}
              >
                {/* Animated background fill */}
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />
                <span className="relative z-10">{t('hero.ctaWork')}</span>
                <motion.span
                  className="relative z-10 inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
                    <path d="M1 1L15 8L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.span>
              </motion.a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Giant scrolling marquee */}
        <motion.div
          ref={marqueeRef}
          style={{ opacity: marqueeOpacity }}
          className="absolute bottom-24 left-0 right-0 overflow-hidden pointer-events-none"
        >
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex">
                {['REACT', 'TYPESCRIPT', 'THREE.JS', 'WEBGL', 'GSAP', 'NODE.JS', 'ELECTRON', 'GO'].map((tech, i) => (
                  <span key={`${setIdx}-${i}`} className="text-[12rem] md:text-[16rem] font-black text-white/[0.015] leading-none select-none tracking-tighter mx-4">
                    {tech}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-none"
        >
          <span className="text-[9px] tracking-[0.4em] text-slate-600 uppercase font-medium">
            {isAr ? 'مرر للأسفل' : 'Scroll'}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[22px] h-[34px] rounded-full border border-slate-700/60 flex items-start justify-center p-1.5"
          >
            <motion.div className="w-[3px] h-[6px] bg-cyan-400/70 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
