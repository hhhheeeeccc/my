import React, { useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { NAV_LINKS } from '../../utils/constants.jsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const links = useMemo(() => NAV_LINKS.map(link => ({ ...link, label: t(link.labelKey) })), [t]);

  useEffect(() => {
    if (!footerRef.current) return;
    const items = footerRef.current.querySelectorAll('[data-footer-item]');
    if (!items.length) return;

    gsap.set(items, { y: 30, opacity: 0 });
    gsap.to(items, {
      y: 0, opacity: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 85%',
        end: 'top 50%',
        scrub: 1,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(tr => {
        if (tr.trigger === footerRef.current) tr.kill();
      });
    };
  }, []);

  return (
    <footer ref={footerRef} className="relative py-24 border-t border-white/[0.04] overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 max-w-md h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 text-center">
        <div data-footer-item className="mb-8">
          <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-tighter font-display">
            M.Y.H.G
          </span>
        </div>

        <div data-footer-item className="mb-10">
          <p className="text-base text-slate-500 font-medium">
            {t('footer.rights', { year: currentYear })}
          </p>
        </div>

        <div data-footer-item className="flex flex-wrap justify-center gap-8 mb-16">
          {links.map((link, idx) => (
            <motion.a
              key={idx}
              href={link.href}
              whileHover={{ y: -2 }}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        <div data-footer-item className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-slate-600">
            {t('footer.builtWith')}
          </p>
          <div className="flex gap-8">
            {['privacy', 'terms'].map(k => (
              <a key={k} href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-300 transition-colors">
                {t(`footer.${k}`)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;