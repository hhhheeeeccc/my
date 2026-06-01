import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-8 relative inline-block text-slate-900 dark:text-white">
              {t('about.title')}
              <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-600 rounded-full" />
            </h2>
            <div className="space-y-6 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>{t('about.bio')}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="p-8 bg-white dark:bg-slate-950 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4  mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                  <Gem className="text-blue-600 dark:text-blue-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {t('about.personalTouchTitle')}
                </h3>
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{t('about.personalTouchBio')}"
              </p>
            </div>

            {/* Decorative background shape */}
            <div className="absolute -z-10 -top-6 -right-6 w-full h-full border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
