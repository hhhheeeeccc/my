import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Gem, Sparkles } from 'lucide-react';
import TextReveal3D from '../common/TextReveal3D';
import ParallaxContainer from '../common/ParallaxContainer';

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-40 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="text-blue-600" size={24} />
              <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">
                {t('about.subtitle')}
              </span>
            </div>

            <h2 className="text-4xl md:text-7xl font-black mb-10 text-slate-900 dark:text-white tracking-tight leading-tight">
              {t('about.title')}
            </h2>

            <div className="space-y-8 text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium opacity-90">
              <p>{t('about.bio')}</p>
            </div>
          </motion.div>

          <ParallaxContainer className="relative">
            <div className="p-12 bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-6 mb-10">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <Gem className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {t('about.personalTouchTitle')}
                </h3>
              </div>
              <p className="text-xl text-slate-700 dark:text-slate-300 italic font-serif leading-relaxed">
                "{t('about.personalTouchBio')}"
              </p>
            </div>
          </ParallaxContainer>
        </div>
      </div>
    </section>
  );
};

export default About;
