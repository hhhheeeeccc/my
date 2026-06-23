import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from 'framer-motion';
import Magnetic from '../common/Magnetic';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const marqueeRef = useRef(null);

  // Mouse parallax with multiple depth layers
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20, mass: 0.5 });
  const deepSpringX = useSpring(mouseX, { stiffness: 30, damping: 15, mass: 1 });
  const deepSpringY = useSpring(mouseY, { stiffness: 30, damping: 15, mass: 1 });

  const handleMouseMove = useCallback((e) => {
    const { innerWidth, innerHeight } = window;
    const nx = (e.clientX - innerWidth / 2) / innerWidth;
    const ny = (e.clientY - innerHeight / 2) / innerHeight;
    mouseX.set(nx * 30);
    mouseY.set(ny * 20);
  }, [mouseX, mouseY]);

  // Scroll progress
  const { scrollYProgress } = useScroll();
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
        {/* Decorative corner accents */}
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
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-normal text-white font-display leading-[0.92] tracking-[-0.04em] pointer-events-auto flex flex-wrap justify-center">
              {titleWords.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.2em] last:mr-0">
                  <motion.span
                    className="inline-block origin-bottom"
                    initial={{ y: '120%', rotateX: 40, opacity: 0 }}
                    animate={{ y: '0%', rotateX: 0, opacity: 1 }}
                    transition={{
                      duration: 1,
                      delay: 2.6 + i * 0.08,
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