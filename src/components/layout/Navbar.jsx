import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from '../common/Magnetic';
import { NAV_LINKS } from '../../utils/constants.jsx';

const Navbar = ({ isAdminOpen }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const isArabic = i18n.language?.startsWith('ar') || i18n.resolvedLanguage?.startsWith('ar');

  const links = useMemo(() => NAV_LINKS.map(link => ({ ...link, label: t(link.labelKey) })), [t]);

  const onToggleLang = () => {
    const nl = isArabic ? 'en' : 'ar';
    const target = globalThis;
    i18n.changeLanguage(nl).then(() => {
      target.document.documentElement.dir = nl === 'ar' ? 'rtl' : 'ltr';
      target.document.documentElement.lang = nl;
    });
  };

  return (
    <AnimatePresence>
      {!isAdminOpen && (
        <header className="relative z-10 w-full">
          <nav className="flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto">
            {/* Logo */}
            <Magnetic>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center cursor-pointer"
              >
                <span
                  className="text-3xl tracking-tight text-foreground"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  M.Y.H.G<sup className="text-xs">®</sup>
                </span>
              </motion.div>
            </Magnetic>

            {/* Nav Links */}
            <div className="hidden md:flex gap-10 items-center">
              {links.map((link, idx) => (
                <Magnetic key={idx}>
                  <motion.a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium"
                  >
                    {link.label}
                  </motion.a>
                </Magnetic>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Magnetic>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleLang}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <Languages size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{isArabic ? 'EN' : 'AR'}</span>
                    </div>
                  </motion.button>
                </Magnetic>
                <Magnetic>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  </motion.button>
                </Magnetic>
              </div>

              <Magnetic>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground transition-all duration-300 inline-block"
                >
                  {t('hero.ctaWork')}
                </motion.a>
              </Magnetic>
            </div>
          </nav>
        </header>
      )}
    </AnimatePresence>
  );
};

Navbar.propTypes = {
  isAdminOpen: PropTypes.bool.isRequired
};

export default Navbar;
