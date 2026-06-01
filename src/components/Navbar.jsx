import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Languages } from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const isArabic = i18n.language?.startsWith('ar') || i18n.resolvedLanguage?.startsWith('ar');

  const toggleLanguage = () => {
    const newLang = isArabic ? 'en' : 'ar';
    i18n.changeLanguage(newLang).then(() => {
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
    });
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              M.Y.H.G
            </span>
          </div>

          <div className="hidden md:flex gap-8 items-center">
            <a href="#about" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t('nav.about')}
            </a>
            <a href="#skills" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t('nav.skills')}
            </a>
            <a href="#projects" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t('nav.projects')}
            </a>
            <a href="#contact" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t('nav.contact')}
            </a>
          </div>

          <div className="flex items-center gap-4 ">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
              aria-label="Toggle Language"
            >
              <div className="flex items-center gap-1 ">
                <Languages size={20} />
                <span className="text-sm font-medium uppercase">{isArabic ? 'EN' : 'AR'}</span>
              </div>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
