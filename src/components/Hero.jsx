import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Hero = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const name = t('hero.name') || "Developer";

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Background decoration - Legendary Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1.1, 1.3, 1],
            rotate: [0, 90, 180, 270, 360],
            x: [0, 60, -30, 40, 0],
            y: [0, 40, 80, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/10 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 0.9, 1.2, 1],
            rotate: [360, 270, 180, 90, 0],
            x: [0, -50, 40, -80, 0],
            y: [0, -40, -90, 30, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-[10%] -right-[10%] w-[70%] h-[70%] rounded-full bg-cyan-500/10 blur-[130px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-block mb-8 px-6 py-2 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 backdrop-blur-md">
            <span className="text-xs md:text-sm font-black text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase">
              {t('hero.welcome', 'Welcome to my world')}
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-[10rem] font-black tracking-[-0.04em] mb-10 flex flex-wrap justify-center leading-[0.9]"
          >
            <span className="sr-only">{name}</span>
            <span className="flex flex-wrap justify-center bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent" aria-hidden="true">
              {name.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          </motion.h1>

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
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full sm:w-auto px-14 py-6 bg-blue-600 text-white font-black rounded-[2rem] transition-all overflow-hidden shadow-2xl shadow-blue-500/30"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
              <span className="relative z-10 text-lg">{t('hero.ctaWork')}</span>
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-14 py-6 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-black rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all hover:border-blue-600/50 dark:hover:border-blue-500/50 text-lg"
            >
              {t('hero.ctaContact')}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

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
