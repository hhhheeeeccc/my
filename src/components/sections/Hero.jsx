import React, { useRef, useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import Magnetic from '../common/Magnetic';

const HUDElement = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`absolute pointer-events-none select-none ${className}`}
  >
    {children}
  </motion.div>
);

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
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);
  const marqueeOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Magnetic & Parallax Mouse Effect
  const mouseX = useSpring(0, { stiffness: 40, damping: 15 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 15 });

  const springX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), { stiffness: 30, damping: 10 });
  const springY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-30, 30]), { stiffness: 30, damping: 10 });

  const deepSpringX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-80, 80]), { stiffness: 20, damping: 15 });
  const deepSpringY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-80, 80]), { stiffness: 20, damping: 15 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  const titleText = t('hero.title');
  const titleLineHeight = 0.85;
  const titleWords = useMemo(() => titleText.split(' '), [titleText]);

  const lineDelays = [2.8, 3.0, 3.1, 3.3];

  const letterVariants = {
    initial: { y: '120%', rotateX: 60, opacity: 0 },
    animate: (i) => ({
      y: '0%',
      rotateX: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        delay: 2.6 + i * 0.08,
        ease: [0.16, 1, 0.3, 1]
      }
    }),
    hover: {
      skewX: [0, -10, 10, -5, 0],
      opacity: [1, 0.8, 1, 0.9, 1],
      x: [0, 2, -2, 1, 0],
      transition: { duration: 0.3 }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-[300vh] w-full overflow-hidden bg-black"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        {/* CROSSHAIR / SCANNER */}
        <motion.div
           style={{ x: deepSpringX, y: deepSpringY }}
           className="absolute z-10 w-32 h-32 border border-white/5 pointer-events-none"
        >
           <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
           <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
           <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400" />
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />
           <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2" />
           <div className="absolute top-0 left-1/2 w-px h-full bg-white/5 -translate-x-1/2" />
        </motion.div>

        {/* HUD ELEMENTS */}
        <HUDElement className="top-10 left-10 text-[8px] font-black tracking-[0.4em] text-white/20 uppercase" delay={1}>
          <div className="flex items-center gap-4">
            <span className="w-1 h-1 bg-cyan-400 animate-ping" />
            01_SYS_READY
          </div>
        </HUDElement>

        <HUDElement className="bottom-10 right-10 text-[8px] font-black tracking-[0.4em] text-white/20 uppercase text-right" delay={1.5}>
          COORD_34.0522°N_118.2437°W<br/>
          ACTIVE_EXPERIENCE_V.1.0
        </HUDElement>

        <HUDElement className="top-1/2 left-6 -translate-y-1/2 flex flex-col gap-8" delay={2}>
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="w-px h-12 bg-white/10 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-cyan-400"
                  animate={{ y: ['-100%', '100%'] }}
                  transition={{ duration: 2 + i, repeat: Infinity, ease: 'linear' }}
                />
             </div>
           ))}
        </HUDElement>

        <HUDElement className="top-1/2 right-6 -translate-y-1/2" delay={2.5}>
           <div className="text-[6px] tracking-widest text-white/10 rotate-90 origin-right">
              SYSTEM_ARCHITECTURE_OVERRIDE_ACTIVE
           </div>
        </HUDElement>

        {/* Cinematic Background Elements */}
        <motion.div
          style={{ x: deepSpringX, y: deepSpringY, opacity: contentOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
           <div className="absolute top-[15%] left-[10%] w-[40vw] h-[40vw] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
           <div className="absolute bottom-[10%] right-[5%] w-[50vw] h-[50vw] bg-blue-600/5 rounded-full blur-[150px]" />
        </motion.div>

        {/* Decorative corner accents */}
        <div className="absolute top-10 left-10 md:top-16 md:left-16" style={{ x: deepSpringX, y: deepSpringY }}>
          <motion.div
            className="w-24 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent"
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, delay: lineDelays[0], ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="w-[2px] h-24 bg-gradient-to-b from-cyan-400 to-transparent mt-0"
            initial={{ scaleY: 0, transformOrigin: 'top' }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 2, delay: lineDelays[1], ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="absolute top-10 right-10 md:top-16 md:right-16" style={{ x: deepSpringX, y: deepSpringY }}>
          <motion.div
            className="w-24 h-[2px] bg-gradient-to-l from-cyan-400 to-transparent"
            initial={{ scaleX: 0, transformOrigin: 'right' }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, delay: lineDelays[2], ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="w-[2px] h-24 bg-gradient-to-b from-cyan-400 to-transparent mt-0"
            initial={{ scaleY: 0, transformOrigin: 'top' }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 2, delay: lineDelays[3], ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-6 pointer-events-none"
        >
          <div className="w-12 h-px bg-white/10" />
          <span className="text-[10px] tracking-[0.6em] text-white/30 font-bold uppercase whitespace-nowrap">
            EST. 2024 — {isAr ? 'المصمم الرقمي' : 'DIGITAL ARCHITECT'}
          </span>
          <div className="w-12 h-px bg-white/10" />
        </motion.div>

        <motion.div
          style={{ x: springX, y: springY, opacity: contentOpacity, scale: contentScale, translateY: contentY }}
          className="relative z-20 flex flex-col items-center text-center px-6 pt-28 pb-36 max-w-7xl mx-auto pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-6 mb-16 pointer-events-auto"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400" />
            <span className="text-xs sm:text-sm font-black tracking-[0.4em] text-cyan-400 uppercase">
              {isAr ? 'مطور واجهات أمامية' : 'Creative Developer & UI/UX Specialist'}
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400" />
          </motion.div>

          <div className="perspective-[2000px] w-full" ref={titleRef}>
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black text-white font-display leading-[0.85] tracking-tighter pointer-events-auto flex flex-wrap justify-center">
              {titleWords.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0 py-2">
                  <motion.span
                    className="inline-block origin-bottom cursor-default select-none"
                    variants={letterVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    custom={i}
                    style={{ lineHeight: titleLineHeight }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          <motion.p
            ref={subtitleRef}
            initial={{ opacity: 0, y: 40, filter: 'blur(15px)' }}
            animate={{ opacity: 0.4, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, delay: 3.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-lg sm:text-2xl max-w-3xl mt-16 leading-relaxed font-body pointer-events-auto font-medium italic px-4"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 3.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 pointer-events-auto"
          >
            <Magnetic range={60}>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="group relative inline-flex items-center gap-6 px-20 py-7 text-[14px] font-black tracking-[0.3em] uppercase text-white rounded-full cursor-pointer overflow-hidden border border-white/10 hover:border-cyan-400 transition-all duration-1000"
                style={{
                  boxShadow: '0 0 0 rgba(6, 182, 212, 0)',
                }}
                onHoverStart={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 60px rgba(6, 182, 212, 0.2)';
                }}
                onHoverEnd={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 rgba(6, 182, 212, 0)';
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-1000 ease-[0.16, 1, 0.3, 1]" />
                <span className="relative z-10 group-hover:text-black transition-colors duration-700">{t('hero.ctaWork')}</span>
                <motion.span
                  className="relative z-10 inline-block group-hover:text-black transition-colors duration-700"
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                >
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="inline-block">
                    <path d="M1 1L15 8L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.span>
              </motion.a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div
          ref={marqueeRef}
          style={{ opacity: marqueeOpacity, x: springX }}
          className="absolute bottom-20 left-0 right-0 overflow-hidden pointer-events-none"
        >
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex">
                {['REACT', 'TYPESCRIPT', 'THREE.JS', 'WEBGL', 'GSAP', 'NODE.JS', 'ELECTRON', 'GO'].map((tech, i) => (
                  <span key={`${setIdx}-${i}`} className="text-[15rem] md:text-[20rem] font-black text-white/[0.01] leading-none select-none tracking-tighter mx-8">
                    {tech}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.8, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none"
        >
          <span className="text-[10px] tracking-[0.6em] text-white/20 uppercase font-bold">
            {isAr ? 'مرر للأسفل' : 'Explore'}
          </span>
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[24px] h-[40px] rounded-full border border-white/10 flex items-start justify-center p-2"
          >
            <motion.div className="w-[4px] h-[8px] bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
