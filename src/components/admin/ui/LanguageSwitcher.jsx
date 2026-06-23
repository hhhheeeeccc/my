import React from 'react';
import PropTypes from 'prop-types';

const LanguageSwitcher = ({ activeLang, onLangChange }) => (
  <div className="flex bg-slate-100/50 dark:bg-slate-950 p-2 rounded-[2rem] mb-10 border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
    {['en', 'ar'].map(lang => (
      <button key={lang} onClick={() => onLangChange(lang)} className={`flex-1 py-4 rounded-[1.5rem] text-sm font-black transition-all uppercase tracking-[0.3em] ${activeLang === lang ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-2xl' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>{lang}</button>
    ))}
  </div>
);

LanguageSwitcher.propTypes = {
  activeLang: PropTypes.string.isRequired,
  onLangChange: PropTypes.func.isRequired
};

export default LanguageSwitcher;
