import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Edit3, Menu, RotateCcw, X } from 'lucide-react';

const DashboardHeader = ({ t, activeSection, setIsSidebarOpen, onReset, onClose }) => (
  <div className="flex items-center justify-between px-10 sm:px-16 py-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 relative z-[110]">
    <div className="flex items-center gap-8">
      <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-4 text-slate-500 rounded-[1.5rem]"><Menu size={32} /></button>
      <div className="flex items-center gap-6">
        <div className="p-5 bg-blue-600 rounded-[2rem] text-white shadow-2xl"><Edit3 size={32} /></div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{t('admin.title')}</h2>
          <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" /><p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{activeSection} Editor</p></div>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <motion.button whileHover={{ rotate: -180, scale: 1.15 }} onClick={onReset} className="p-5 text-slate-400 hover:text-red-500 rounded-3xl" title={t('admin.resetTitle')}><RotateCcw size={28} /></motion.button>
      <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="p-5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-3xl"><X size={28} /></motion.button>
    </div>
  </div>
);

DashboardHeader.propTypes = {
  t: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default DashboardHeader;
