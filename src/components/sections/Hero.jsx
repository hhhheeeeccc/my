import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Magnetic from '../common/Magnetic';
import TextReveal3D from '../layout/TextReveal3D';
import ParallaxContainer from '../common/ParallaxContainer';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const containerRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const name = t('hero.name') || "Developer";

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-48 pb-20 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500"
    >
      <ParallaxContainer intensity={30} className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="inline-block mb-8 px-6 py-2 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 backdrop-blur-md"
          >
            <span className="text-xs md:text-sm font-black text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase">
              {t('hero.welcome', 'Welcome to my world')}
            </span>
          </motion.div>

          <div className="text-6xl md:text-[10rem] font-black tracking-[-0.04em] mb-10 flex flex-wrap justify-center leading-[0.9]">
            <TextReveal3D
              text={name}
              className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent"
            />
          </div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100 mb-12 max-w-5xl mx-auto leading-tight"
          >
            {t('hero.title')}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-3xl text-slate-600 dark:text-slate-400 mb-16 max-w-4xl mx-auto leading-relaxed font-medium opacity-80"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Magnetic>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full sm:w-auto px-14 py-6 bg-blue-600 text-white font-black rounded-[2rem] transition-all overflow-hidden shadow-2xl shadow-blue-500/30"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
                <span className="relative z-10 text-lg">{t('hero.ctaWork')}</span>
              </motion.a>
            </Magnetic>
            <Magnetic>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-14 py-6 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-black rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all hover:border-blue-600/50 dark:hover:border-blue-500/50 text-lg"
              >
                {t('hero.ctaContact')}
              </motion.a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </ParallaxContainer>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[32px] h-[54px] rounded-full border-2 border-slate-300 dark:border-slate-700 p-1.5">
          <motion.div
            animate={{
              y: [0, 22, 0],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-2.5 h-2.5 rounded-full bg-blue-600 mx-auto shadow-[0_0_12px_rgba(59,130,246,0.9)]"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
