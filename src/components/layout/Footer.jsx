import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            &copy; {currentYear} <span className="font-bold text-slate-900 dark:text-white">Marwan Yahya Hassan Ghazi</span>.
            {t('footer.rights', ' All rights reserved.')}
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm font-bold text-slate-400 dark:text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">{t('footer.privacy', 'Privacy')}</a>
            <a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">{t('footer.terms', 'Terms')}</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
