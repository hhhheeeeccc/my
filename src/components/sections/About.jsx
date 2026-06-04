import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Gem, Sparkles } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-32 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-500 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-6 ">
              <motion.div
                animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="text-blue-600" size={28} />
              </motion.div>
              <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm">
                {t('about.subtitle', 'My Journey')}
              </span>
            </div>
            <div className="mb-8">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
                {t('about.title')}
              </h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 100 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mt-4"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-6 text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium"
            >
              <p>{t('about.bio')}</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", stiffness: 100, damping: 20 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative z-10 p-10 bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-500"
            >
              <div className="flex items-center gap-6 mb-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="p-5 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl shadow-inner"
                >
                  <Gem className="text-blue-600 dark:text-blue-400" size={36} />
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none">
                  {t('about.personalTouchTitle')}
                </h3>
              </div>
              <p className="text-2xl text-slate-700 dark:text-slate-300 leading-relaxed italic font-serif opacity-90">
                "{t('about.personalTouchBio')}"
              </p>

              <div className="mt-10 flex gap-3">
                {[1, 2, 3].map(i => (
                   <div key={i} className="flex-1 h-2 rounded-full bg-blue-50 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ x: "-100%" }}
                        whileInView={{ x: "0%" }}
                        transition={{ delay: 0.6 + (i * 0.15), duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                      />
                   </div>
                ))}
              </div>
            </motion.div>

            {/* Decorative Frame */}
            <motion.div
              animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -z-10 -top-10 -right-10 w-full h-full border-4 border-blue-600/20 rounded-[3.5rem]"
            />
            <motion.div
              animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -z-10 -bottom-10 -left-10 w-full h-full border-4 border-cyan-500/10 rounded-[3.5rem]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
