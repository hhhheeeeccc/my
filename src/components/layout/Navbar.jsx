import React, { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Languages, Menu, X } from 'lucide-react';
import Magnetic from '../common/Magnetic';
import { NAV_LINKS } from '../../utils/constants.jsx';
import { useState, useEffect } from 'react';

const Navbar = ({ isAdminOpen }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  const isArabic = i18n.language?.startsWith('ar') || i18n.resolvedLanguage?.startsWith('ar');
  const links = useMemo(() => NAV_LINKS.map(link => ({ ...link, label: t(link.labelKey) })), [t]);

  const onToggleLang = () => {
    const nl = isArabic ? 'en' : 'ar';
    i18n.changeLanguage(nl).then(() => {
      document.documentElement.dir = nl === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = nl;
    });
  };

  // Scroll detection for navbar style
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {!isAdminOpen && (
        <header
          ref={navRef}
          className="fixed top-0 left-0 right-0 z-[100] w-full pointer-events-none transition-all duration-700"
        >
          {/* Background blur that appears on scroll */}
          <motion.div
            className="absolute inset-0 bg-black/0 backdrop-blur-none border-b border-transparent transition-all duration-700"
            animate={{
              backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0)',
              backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
              borderBottomColor: scrolled ? 'rgba(255,255,255,0.04)' : 'transparent',
            }}
            transition={{ duration: 0.5 }}
          />

          <nav className="relative flex flex-row justify-between items-center px-6 md:px-8 py-5 max-w-7xl mx-auto pointer-events-auto">
            {/* Logo */}
            <Magnetic>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center cursor-pointer"
              >
                <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-tighter font-display">
                  M.Y.H.G<sup className="text-[9px] text-white/40 ml-0.5">®</sup>
                </span>
              </motion.div>
            </Magnetic>

            {/* Desktop nav links */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex gap-1 items-center px-5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02]"
            >
              {links.map((link, idx) => (
                <Magnetic key={idx}>
                  <motion.a
                    href={link.href}
                    className="text-[13px] text-slate-400 hover:text-white transition-all duration-300 font-medium px-4 py-1.5 rounded-full hover:bg-white/[0.06]"
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
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="hidden md:flex items-center gap-1">
                <Magnetic>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleLang}
                    className="p-2.5 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/[0.06]"
                  >
                    <Languages size={17} />
                  </motion.button>
                </Magnetic>
                <Magnetic>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className="p-2.5 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/[0.06]"
                  >
                    {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
                  </motion.button>
                </Magnetic>
              </div>

              <Magnetic>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:inline-flex items-center px-5 py-2 text-[12px] text-white font-bold tracking-[0.1em] uppercase rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-500"
                >
                  {t('hero.ctaContact')}
                </motion.a>
              </Magnetic>

              {/* Mobile menu button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 text-slate-400 hover:text-white transition-colors rounded-full"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </motion.div>
          </nav>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="md:hidden relative overflow-hidden border-t border-white/[0.04] bg-black/90 backdrop-blur-xl"
              >
                <div className="flex flex-col items-center gap-2 py-6 px-8">
                  {links.map((link, idx) => (
                    <motion.a
                      key={idx}
                      href={link.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setMobileOpen(false)}
                      className="text-lg text-slate-300 hover:text-white transition-colors py-2 font-medium"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                  <div className="flex items-center gap-2 mt-4">
                    <button onClick={onToggleLang} className="p-2.5 text-slate-400 hover:text-white rounded-full">
                      <Languages size={18} />
                    </button>
                    <button onClick={toggleTheme} className="p-2.5 text-slate-400 hover:text-white rounded-full">
                      {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}
    </AnimatePresence>
  );
};

Navbar.propTypes = {
  isAdminOpen: PropTypes.bool.isRequired
};

export default Navbar;