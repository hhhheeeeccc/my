import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const LanguageSwitcher = ({ activeLang, onLangChange }) => {
  const langs = [
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
      {langs.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLangChange(lang.code)}
          className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors duration-300 ${
            activeLang === lang.code
              ? 'text-white'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          {activeLang === lang.code && (
            <motion.div
              layoutId="lang-active"
              className="absolute inset-0 bg-blue-600 rounded-lg"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{lang.label}</span>
        </button>
      ))}
    </div>
  );
};

LanguageSwitcher.propTypes = {
  activeLang: PropTypes.string.isRequired,
  onLangChange: PropTypes.func.isRequired,
};

export default LanguageSwitcher;