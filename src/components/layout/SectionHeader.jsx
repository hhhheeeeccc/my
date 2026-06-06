import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import TextReveal3D from './TextReveal3D';

const SectionHeader = ({ subtitle, title, intro, center = true }) => (
  <div className={`${center ? 'text-center items-center' : 'text-start items-start'} mb-32 flex flex-col`}>
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`flex items-center gap-3 mb-6 ${center ? 'justify-center' : ''}`}>
      <div className="w-16 h-1.5 bg-blue-600 rounded-full" />
      <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs md:text-sm">{subtitle}</span>
      {center && <div className="w-16 h-1.5 bg-blue-600 rounded-full" />}
    </motion.div>
    <div className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-10 tracking-tight leading-[0.9]">
      <TextReveal3D text={title} />
    </div>
    <p className={`text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl font-semibold opacity-80 leading-relaxed ${center ? 'mx-auto' : ''}`}>
      {intro}
    </p>
  </div>
);

SectionHeader.propTypes = {
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  center: PropTypes.bool
};

export default SectionHeader;
