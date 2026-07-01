import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'about', href: '#about' },
  { key: 'skills', href: '#skills' },
  { key: 'projects', href: '#projects' },
  { key: 'contact', href: '#contact' },
];

const Navbar = ({ isAdminOpen }) => {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  // Hide on scroll down, show on scroll up (AT style)
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
    <AnimatePresence>
      {!isAdminOpen && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: visible ? 0 : -100 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-[100] w-full"
        >
          <nav className="flex items-center justify-between px-6 md:px-10 py-5 md:py-6">
            {/* Logo — AT style: simple text */}
            <a href="#" className="text-[13px] md:text-[14px] font-normal tracking-[0.15em] text-white/70 hover:text-white transition-colors duration-500 uppercase font-body">
              M.Y.H.G
            </a>

            {/* Desktop nav — AT style: minimal, spaced out */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-[11px] font-normal tracking-[0.2em] text-white/30 hover:text-white/80 transition-colors duration-500 uppercase font-body"
                >
                  {t(`nav.${item.key}`)}
                </a>
              ))}
            </div>

            {/* Contact button — AT style */}
            <a
              href="#contact"
              className="hidden md:inline-block text-[11px] font-normal tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-500 uppercase font-body"
            >
              {t('hero.ctaContact')}
            </a>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/50 hover:text-white transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/[0.04]"
              >
                <div className="flex flex-col items-center gap-6 py-10">
                  {NAV_ITEMS.map((item, i) => (
                    <motion.a
                      key={item.key}
                      href={item.href}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-white/40 hover:text-white transition-colors tracking-[0.15em] uppercase font-body"
                    >
                      {t(`nav.${item.key}`)}
                    </motion.a>
                  ))}
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