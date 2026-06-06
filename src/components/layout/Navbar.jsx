import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Languages } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion';
import Magnetic from '../common/Magnetic';
import { NAV_LINKS } from '../../utils/constants';

const Navbar = ({ isAdminOpen }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();

  const isArabic = i18n.language?.startsWith('ar') || i18n.resolvedLanguage?.startsWith('ar');

  const navStyles = {
    height: useTransform(scrollY, [0, 150], ["6.5rem", "5rem"]),
    bgOpacity: useTransform(scrollY, [0, 150], [0, 0.8]),
    borderOpacity: useTransform(scrollY, [0, 150], [0, 1]),
    blur: useTransform(scrollY, [0, 150], [0, 25]),
    scale: useTransform(scrollY, [0, 150], [1, 0.98])
  };

  const backgroundColor = useMotionTemplate`rgba(${theme === 'dark' ? '15, 23, 42' : '255, 255, 255'}, ${navStyles.bgOpacity})`;
  const borderColor = useMotionTemplate`rgba(${theme === 'dark' ? '30, 41, 59' : '226, 232, 240'}, ${navStyles.borderOpacity})`;
  const backdropBlur = useMotionTemplate`blur(${navStyles.blur}px)`;

  const links = useMemo(() => NAV_LINKS.map(link => ({ ...link, label: t(link.labelKey) })), [t]);

  const onToggleLang = () => {
    const nl = isArabic ? 'en' : 'ar';
    i18n.changeLanguage(nl).then(() => {
      document.documentElement.dir = nl === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = nl;
    });
  };

  return (
    <AnimatePresence>
      {!isAdminOpen && (
        <div className="fixed top-0 w-full z-[200] flex justify-center pointer-events-none px-4 pt-4">
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: navStyles.height, backgroundColor, borderColor, backdropFilter: backdropBlur, WebkitBackdropFilter: backdropBlur, scale: navStyles.scale }}
            className="w-full max-w-7xl border rounded-[2.5rem] shadow-2xl pointer-events-auto transition-[background-color] duration-300 px-8"
          >
            <div className="flex justify-between items-center h-full">
              <Magnetic>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0 flex items-center cursor-pointer">
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tighter">M.Y.H.G</span>
                </motion.div>
              </Magnetic>

              <div className="hidden md:flex gap-10 items-center">
                {links.map((link, idx) => (
                  <Magnetic key={idx}>
                    <motion.a href={link.href} className="relative text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1 group">
                      {link.label}
                      <span className="absolute -bottom-1 left-2 right-2 h-0.5 bg-blue-600 scale-x-0 transition-transform group-hover:scale-x-100" />
                    </motion.a>
                  </Magnetic>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Magnetic><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onToggleLang} className="p-2.5 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5"><Languages size={18} className="text-blue-600 dark:text-blue-400" /><span className="text-xs font-black uppercase tracking-wider">{isArabic ? 'EN' : 'AR'}</span></div>
                </motion.button></Magnetic>
                <Magnetic><motion.button whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme} className="p-2.5 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                  {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-blue-600" />}
                </motion.button></Magnetic>
              </div>
            </div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
