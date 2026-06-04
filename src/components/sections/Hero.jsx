import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Magnetic from '../common/Magnetic';

const Hero = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const name = t('hero.name') || "Developer";

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-visible bg-white dark:bg-slate-950 transition-colors duration-500 perspective-[2000px]"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-10 max-w-7xl mx-auto px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="inline-block mb-10 px-6 py-2 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 backdrop-blur-md" style={{ translateZ: "40px" }}>
            <span className="text-[10px] md:text-xs font-black text-blue-600 dark:text-blue-400 tracking-[0.4em] uppercase">
              {t('hero.welcome')}
            </span>
          </div>

          <h1
            style={{ translateZ: "80px" }}
            className="text-6xl md:text-[10rem] font-black tracking-[-0.04em] mb-12 flex flex-wrap justify-center leading-[0.85]"
          >
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
              {name}
            </span>
          </h1>

          <h2
            style={{ translateZ: "60px" }}
            className="text-2xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-12 max-w-4xl mx-auto leading-tight"
          >
            {t('hero.title')}
          </h2>

          <p
            style={{ translateZ: "40px" }}
            className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-16 max-w-3xl mx-auto leading-relaxed font-medium opacity-80"
          >
            {t('hero.subtitle')}
          </p>

          <div
            style={{ translateZ: "50px" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-10"
          >
            <Magnetic>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full sm:w-auto px-16 py-7 bg-blue-600 text-white font-black rounded-full transition-all overflow-hidden shadow-2xl shadow-blue-500/20"
              >
                <div className="absolute inset-0 w-full h-full bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-15deg]" />
                <span className="relative z-10 text-base md:text-lg uppercase tracking-widest">{t('hero.ctaWork')}</span>
              </motion.a>
            </Magnetic>
            <Magnetic>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-16 py-7 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-black rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-base md:text-lg uppercase tracking-widest"
              >
                {t('hero.ctaContact')}
              </motion.a>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-4"
      >
        <div className="w-[28px] h-[48px] rounded-full border-2 border-slate-300 dark:border-slate-700 p-1.5 opacity-50">
          <motion.div
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-blue-600 mx-auto"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
