import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Languages } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import Magnetic from '../common/Magnetic';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();

  const navHeight = useTransform(scrollY, [0, 100], ["5.5rem", "4.5rem"]);
  const navBgOpacity = useTransform(scrollY, [0, 100], [0, 0.85]);
  const navBorderOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 20]);
  const navY = useTransform(scrollY, [0, 100], [0, 10]);

  const backgroundColor = useMotionTemplate`rgba(${theme === 'dark' ? '15, 23, 42' : '255, 255, 255'}, ${navBgOpacity})`;
  const borderColor = useMotionTemplate`rgba(${theme === 'dark' ? '30, 41, 59' : '226, 232, 240'}, ${navBorderOpacity})`;
  const backdropBlur = useMotionTemplate`blur(${navBlur}px)`;

  const isArabic = i18n.language?.startsWith('ar');

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
    <div className="fixed top-0 w-full z-[300] flex justify-center pointer-events-none px-6">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: navHeight,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          backdropFilter: backdropBlur,
          WebkitBackdropFilter: backdropBlur,
          y: navY
        }}
        className="w-full max-w-6xl border rounded-[2rem] shadow-lg pointer-events-auto transition-[background-color] duration-300 px-10"
      >
        <div className="flex justify-between items-center h-full">
          <Magnetic>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-shrink-0 cursor-pointer"
            >
              <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent tracking-tighter">
                M.Y.H.G
              </span>
            </motion.div>
          </Magnetic>

          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link, idx) => (
              <Magnetic key={idx}>
                <motion.a
                  href={link.href}
                  className="relative text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group px-2 py-1"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-2 right-2 h-0.5 bg-blue-600 scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </motion.a>
              </Magnetic>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Magnetic>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="p-2 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
              >
                <Languages size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="text-[10px] font-black uppercase">{isArabic ? 'EN' : 'AR'}</span>
              </motion.button>
            </Magnetic>
            <Magnetic>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors text-slate-600 dark:text-slate-400"
              >
                {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-blue-600" />}
              </motion.button>
            </Magnetic>
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
