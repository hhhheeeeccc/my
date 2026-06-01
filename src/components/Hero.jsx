import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 bg-clip-text text-transparent">
              {t('hero.name')}
            </span>
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8 max-w-3xl mx-auto leading-tight">
            {t('hero.title')}
          </h2>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#projects"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
            >
              {t('hero.ctaWork')}
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 border-2 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all transform hover:scale-105 active:scale-95"
            >
              {t('hero.ctaContact')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
