import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from 'framer-motion';
import Magnetic from '../common/Magnetic';
import SplitText from '../common/SplitText';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    mouseX.set((e.clientX - innerWidth / 2) / 25);
    mouseY.set((e.clientY - innerHeight / 2) / 25);
  };

  // Scroll progress
  const { scrollY } = useScroll();
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 500], [1, 0.95]);
  const contentY = useTransform(scrollY, [0, 500], [0, -60]);

  // Marquee ref
  const marqueeRef = useRef(null);
  const marqueeInView = useInView(marqueeRef, { once: false });

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* Decorative corner lines */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <motion.div
          className="w-16 h-px bg-cyan-500/40"
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="w-px h-16 bg-cyan-500/40 mt-0"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 2.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="absolute top-8 right-8 md:top-12 md:right-12">
        <motion.div
          className="w-16 h-px bg-cyan-500/40"
          initial={{ scaleX: 0, transformOrigin: 'right' }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="w-px h-16 bg-cyan-500/40 mt-0"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Year / Label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-slate-500 font-medium uppercase pointer-events-none"
      >
        Portfolio — 2024
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{ x: springX, y: springY, opacity: contentOpacity, scale: contentScale, translateY: contentY }}
        className="relative z-20 flex flex-col items-center text-center px-6 pt-32 pb-40 max-w-7xl mx-auto pointer-events-none"
      >
        {/* Subtitle top */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-8 pointer-events-auto"
        >
          <div className="h-px w-8 bg-cyan-500/50" />
          <span className="text-sm font-bold tracking-[0.25em] text-cyan-400/80 uppercase">
            {isAr ? 'مطور واجهات أمامية' : 'Frontend Developer & Designer'}
          </span>
          <div className="h-px w-8 bg-cyan-500/50" />
        </motion.div>

        {/* Main Title - Character by character animation */}
        <div className="perspective-[1000px]">
          <SplitText
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.92] tracking-[-0.04em] font-normal text-white font-display pointer-events-auto"
            animation="reveal"
            stagger={0.04}
            delay={2.4}
            duration={0.7}
            once={false}
          >
            {t('hero.title')}
          </SplitText>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 1.2, delay: 3.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-slate-300 text-base sm:text-lg max-w-2xl mt-10 leading-relaxed font-body pointer-events-auto"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 3.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 pointer-events-auto"
        >
          <Magnetic>
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-14 py-5 text-sm font-black tracking-[0.15em] uppercase text-white rounded-full cursor-pointer overflow-hidden border border-white/10 hover:border-cyan-400/40 transition-colors duration-500"
            >
              {/* Background hover fill */}
              <span className="absolute inset-0 bg-cyan-500/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />
              <span className="relative z-10">{t('hero.ctaWork')}</span>
              <motion.span
                className="relative z-10 inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                →
              </motion.span>
            </motion.a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scrolling marquee */}
      <div ref={marqueeRef} className="absolute bottom-20 left-0 right-0 overflow-hidden pointer-events-none">
        <motion.div
          className="flex whitespace-nowrap gap-8"
          animate={marqueeInView ? { x: ['0%', '-50%'] } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex gap-8">
              {['REACT', 'TYPESCRIPT', 'THREE.JS', 'NEXT.JS', 'WEBGL', 'GSAP', 'NODE.JS', 'TAILWIND'].map((tech, i) => (
                <span key={`${setIdx}-${i}`} className="text-[10rem] md:text-[14rem] font-black text-white/[0.02] leading-none select-none tracking-tighter">
                  {tech}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none"
      >
        <span className="text-[10px] tracking-[0.3em] text-slate-600 uppercase font-medium">
          {isAr ? 'مرر للأسفل' : 'Scroll'}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1"
        >
          <motion.div className="w-1 h-2 bg-cyan-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;