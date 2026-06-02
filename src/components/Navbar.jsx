import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Languages } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();

  // Smooth transforms for professional header transition
  const navHeight = useTransform(scrollY, [0, 150], ["6rem", "4.5rem"]);
  const navBgOpacity = useTransform(scrollY, [0, 150], [0, 0.95]);
  const navBorderOpacity = useTransform(scrollY, [0, 150], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 150], [0, 20]);

  // Dynamic color templates
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
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        height: navHeight,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        backdropFilter: backdropBlur,
        WebkitBackdropFilter: backdropBlur
      }}
      className="fixed top-0 w-full z-50 border-b transition-[background-color] duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 flex items-center cursor-pointer"
          >
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tighter">
              M.Y.H.G
            </span>
          </motion.div>

          <div className="hidden md:flex gap-10 items-center">
            {navLinks.map((link, idx) => (
              <motion.a
                key={idx}
                href={link.href}
                whileHover={{ y: -2 }}
                className="relative text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-3">
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
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-blue-600" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
