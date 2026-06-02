import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Gem, Sparkles } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-32 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-6 ">
              <Sparkles className="text-blue-600" size={24} />
              <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">
                {t('about.subtitle', 'My Journey')}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 dark:text-white leading-tight">
              {t('about.title')}
              <div className="w-24 h-2 bg-blue-600 rounded-full mt-4" />
            </h2>
            <div className="space-y-6 text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              <p>{t('about.bio')}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", damping: 15 }}
            className="relative"
          >
            <div className="relative z-10 p-10 bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 transform hover:scale-[1.02] transition-transform duration-500">
              <div className="flex items-center gap-5  mb-8">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl shadow-inner">
                  <Gem className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none">
                  {t('about.personalTouchTitle')}
                </h3>
              </div>
              <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed italic font-serif">
                "{t('about.personalTouchBio')}"
              </p>

              <div className="mt-8 flex gap-2">
                {[1, 2, 3].map(i => (
                   <div key={i} className="w-12 h-1.5 rounded-full bg-blue-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ x: "-100%" }}
                        whileInView={{ x: "0%" }}
                        transition={{ delay: 0.5 + (i * 0.2), duration: 1 }}
                        className="w-full h-full bg-blue-600"
                      />
                   </div>
                ))}
              </div>
            </div>

            {/* Legendary Decorative Frame */}
            <div className="absolute -z-10 -top-8 -right-8 w-full h-full border-4 border-blue-600/20 rounded-[3rem]" />
            <div className="absolute -z-10 -bottom-8 -left-8 w-full h-full border-4 border-cyan-500/10 rounded-[3rem]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
