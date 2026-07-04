import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const NAV_ITEMS = [
  { key: 'about', href: '#about' },
  { key: 'skills', href: '#skills' },
  { key: 'projects', href: '#projects' },
  { key: 'contact', href: '#contact' },
];

const Navbar = ({ isAdminOpen }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < 100 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!isAdminOpen && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: visible ? 0 : -100 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-[100] w-full"
        >
          <nav className="flex items-center justify-between px-6 md:px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-white/10 flex items-center justify-center rotate-45 group hover:border-cyan-500/50 transition-all duration-500">
                <span className="text-[10px] -rotate-45 font-black text-white/80 group-hover:text-cyan-400">M</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] font-black tracking-[0.2em] text-white/70 uppercase font-mono">System.v4</span>
                <span className="text-[7px] text-white/20 uppercase font-mono">Core: Active</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 bg-white/[0.02] backdrop-blur-2xl px-8 py-3 rounded-full border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-[9px] font-black tracking-[0.3em] text-white/30 hover:text-white transition-colors duration-500 uppercase font-mono"
                >
                  {t(`nav.${item.key}`)}
                </a>
              ))}

              <div className="w-[1px] h-4 bg-white/10 mx-1" />

              <div className="flex items-center gap-6">
                <button onClick={toggleTheme} className="text-white/20 hover:text-cyan-400 transition-colors">
                  {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                </button>

                <button onClick={toggleLanguage} className="flex items-center gap-2 group">
                  <Globe size={13} className="text-white/20 group-hover:text-emerald-400 transition-colors" />
                  <span className="text-[9px] font-black tracking-widest text-white/40 group-hover:text-white transition-colors uppercase font-mono">
                    {i18n.language === 'en' ? 'AR' : 'EN'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <a
                href="#contact"
                className="hidden lg:flex items-center gap-3 px-6 py-2.5 border border-white/10 rounded-full text-[9px] font-black tracking-widest text-white/40 hover:text-white hover:border-white/30 transition-all uppercase font-mono"
              >
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
                {t('hero.ctaContact')}
              </a>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-full text-white/50 hover:border-white/30 transition-colors"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-0 bg-black/98 z-[90] flex flex-col items-center justify-center gap-10"
              >
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.key}
                    href={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setMobileOpen(false)}
                    className="text-5xl font-display text-white/20 hover:text-white transition-all tracking-tighter uppercase"
                  >
                    {t(`nav.${item.key}`)}
                  </motion.a>
                ))}
                <div className="mt-12 flex flex-col items-center gap-8 border-t border-white/10 pt-12 w-64">
                   <button onClick={() => { toggleTheme(); setMobileOpen(false); }} className="flex items-center gap-4 text-[11px] font-black tracking-[0.4em] text-white/40 uppercase">
                    {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                    {theme === 'dark' ? 'DARK MODE' : 'LIGHT MODE'}
                  </button>
                  <button onClick={() => { toggleLanguage(); setMobileOpen(false); }} className="flex items-center gap-4 text-[11px] font-black tracking-[0.4em] text-white/40 uppercase">
                    <Globe size={16} />
                    {i18n.language === 'en' ? 'VIEW ARABIC' : 'VIEW ENGLISH'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
