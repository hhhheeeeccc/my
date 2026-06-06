import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const DashboardField = ({ label, value, onChange, type = 'text' }) => (
  <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative z-[110]">
    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3 ms-1">
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        className="editor-input w-full px-6 py-5 rounded-[1.5rem] bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-lg min-h-[140px] shadow-sm resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input
        className="editor-input w-full px-6 py-5 rounded-[1.5rem] bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-lg shadow-sm"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </motion.div>
);

DashboardField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string
};

export default DashboardField;
