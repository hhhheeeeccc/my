import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">
          {t('footer.rights', { year })}
        </p>
        <p className="text-slate-500 dark:text-slate-500 text-sm">
          {t('footer.builtWith')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
