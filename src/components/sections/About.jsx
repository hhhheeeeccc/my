import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Code2, Rocket, Heart } from 'lucide-react';
import SectionHeader from '../layout/SectionHeader';
import { useSectionInteraction } from '../../hooks/useSectionInteraction';

const About = () => {
  const { t } = useTranslation();
  const interaction = useSectionInteraction();
  return (
    <section id="about" className="py-40 bg-slate-50 dark:bg-slate-900/20 transition-colors duration-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <SectionHeader center={false} subtitle={t('about.subtitle')} title={t('about.title')} intro={t('about.intro')} />
            <div className="grid sm:grid-cols-2 gap-8">
              {[ { icon: <Code2 className="text-blue-600" />, key: 'code' }, { icon: <Rocket className="text-cyan-500" />, key: 'rocket' } ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group">
                  <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl w-fit group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{t(`about.features.${item.key}.title`)}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{t(`about.features.${item.key}.desc`)}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="relative" onMouseEnter={interaction.onEnter} onClick={interaction.onClick} onMouseLeave={interaction.onLeave}>
            <motion.div whileHover={{ scale: 1.02 }} className="relative z-10 p-12 rounded-[3.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Heart size={120} className="text-blue-600" fill="currentColor" /></div>
              <div className="flex items-center gap-4 mb-10"><div className="p-4 bg-blue-600 rounded-2xl text-white"><User size={32} /></div><h3 className="text-3xl font-black text-slate-900 dark:text-white">{t('about.personalTouchTitle')}</h3></div>
              <p className="text-2xl text-slate-700 dark:text-slate-300 leading-relaxed italic font-serif opacity-90">"{t('about.personalTouchBio')}"</p>
              <div className="mt-10 flex gap-3">{[1, 2, 3].map(i => (
                   <div key={i} className="flex-1 h-2 rounded-full bg-blue-50 dark:bg-slate-800 overflow-hidden"><motion.div initial={{ x: "-100%" }} whileInView={{ x: "0%" }} transition={{ delay: 0.6 + (i * 0.15), duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="w-full h-full bg-gradient-to-r from-blue-600 to-cyan-500" /></div>
              ))}</div>
            </motion.div>
            <motion.div animate={{ x: [0, 10, 0], y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -z-10 -top-10 -right-10 w-full h-full border-4 border-blue-600/20 rounded-[3.5rem]" />
            <motion.div animate={{ x: [0, -10, 0], y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -z-10 -bottom-10 -left-10 w-full h-full border-4 border-cyan-500/10 rounded-[3.5rem]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default About;
