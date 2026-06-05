import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Languages } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion';
import Magnetic from '../common/Magnetic';

const Navbar = ({ isAdminOpen }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();

  const navHeight = useTransform(scrollY, [0, 150], ["6.5rem", "5rem"]);
  const navBgOpacity = useTransform(scrollY, [0, 150], [0, 0.8]);
  const navBorderOpacity = useTransform(scrollY, [0, 150], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 150], [0, 25]);
  const navScale = useTransform(scrollY, [0, 150], [1, 0.98]);

  const backgroundColor = useMotionTemplate`rgba(${theme === 'dark' ? '15, 23, 42' : '255, 255, 255'}, ${navBgOpacity})`;
  const borderColor = useMotionTemplate`rgba(${theme === 'dark' ? '30, 41, 59' : '226, 232, 240'}, ${navBorderOpacity})`;
  const backdropBlur = useMotionTemplate`blur(${navBlur}px)`;

  const isArabic = i18n.language?.startsWith('ar') || i18n.resolvedLanguage?.startsWith('ar');

  const toggleLanguage = () => {
    const newLang = isArabic ? 'en' : 'ar';
    i18n.changeLanguage(newLang).then(() => {
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
    });
  };

  const navLinks = [
    { href: "#about", label: t('nav.about') },
    { href: "#skills", label: t('nav.skills') },
    { href: "#projects", label: t('nav.projects') },
    { href: "#contact", label: t('nav.contact') },
  ];

  return (
    <AnimatePresence>
      {!isAdminOpen && (
        <div className="fixed top-0 w-full z-[200] flex justify-center pointer-events-none px-4 pt-4">
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: navHeight,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              backdropFilter: backdropBlur,
              WebkitBackdropFilter: backdropBlur,
              scale: navScale
            }}
            className="w-full max-w-7xl border rounded-[2.5rem] shadow-2xl pointer-events-auto transition-[background-color] duration-300 px-8"
          >
            <div className="flex justify-between items-center h-full">
              <Magnetic>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 flex items-center cursor-pointer"
                >
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tighter">
                    M.Y.H.G
                  </span>
                </motion.div>
              </Magnetic>

              <div className="hidden md:flex gap-10 items-center">
                {navLinks.map((link, idx) => (
                  <Magnetic key={idx}>
                    <motion.a
                      href={link.href}
                      className="relative text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group px-2 py-1"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-2 right-2 h-0.5 bg-blue-600 scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </motion.a>
                  </Magnetic>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Magnetic>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleLanguage}
                    className="p-2.5 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300"
                    aria-label="Toggle Language"
                  >
                    <div className="flex items-center gap-1.5 ">
                      <Languages size={18} className="text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-black uppercase tracking-wider">{isArabic ? 'EN' : 'AR'}</span>
                    </div>
                  </motion.button>
                </Magnetic>
                <Magnetic>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className="p-2.5 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300"
                    aria-label="Toggle Theme"
                  >
                    {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-blue-600" />}
                  </motion.button>
                </Magnetic>
              </div>
            </div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
