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
        <header className="fixed top-0 left-0 right-0 z-[100] w-full pointer-events-none">
          <nav className="flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto pointer-events-auto">
            {/* Logo - Restored User Data */}
            <Magnetic>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center cursor-pointer"
              >
                <span
                  className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent tracking-tighter font-display"
                >
                  M.Y.H.G<sup className="text-[10px] text-white/50">®</sup>
                </span>
              </motion.div>
            </Magnetic>

            {/* Nav Links */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="hidden md:flex gap-1 items-center bg-white/5 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10 shadow-2xl"
            >
              {links.map((link, idx) => (
                <Magnetic key={idx}>
                  <motion.a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-white transition-all duration-300 font-medium px-4 py-1 rounded-full hover:bg-white/10"
                  >
                    {link.label}
                  </motion.a>
                </Magnetic>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-1">
                <Magnetic>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleLang}
                    className="p-2.5 text-muted-foreground hover:text-white transition-colors rounded-full"
                  >
                    <Languages size={18} />
                  </motion.button>
                </Magnetic>
                <Magnetic>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className="p-2.5 text-muted-foreground hover:text-white transition-colors rounded-full"
                  >
                    {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
                  </motion.button>
                </Magnetic>
              </div>

              <Magnetic>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white font-bold transition-all duration-500 inline-block border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  {t('hero.ctaContact')}
                </motion.a>
              </Magnetic>
            </motion.div>
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
