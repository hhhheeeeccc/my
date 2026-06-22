import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { NAV_LINKS } from '../../utils/constants.jsx';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const links = useMemo(() => NAV_LINKS.map(link => ({ ...link, label: t(link.labelKey) })), [t]);

  return (
    <footer className="py-20 bg-white dark:bg-transparent border-t border-slate-100 dark:border-slate-900 transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          <div className="mb-10"><span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tighter">M.Y.H.G</span></div>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-semibold mb-10">{t('footer.rights', { year: currentYear })}</p>
          <div className="flex flex-wrap justify-center gap-10">
            {links.map((link, idx) => (
              <motion.a key={idx} href={link.href} whileHover={{ scale: 1.1, y: -2 }} className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors">{link.label}</motion.a>
            ))}
          </div>
          <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm font-bold text-slate-400 dark:text-slate-600">{t('footer.builtWith')}</p>
            <div className="flex gap-8">
               {['privacy', 'terms'].map(k => <a key={k} href="#" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">{t(`footer.${k}`)}</a>)}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
