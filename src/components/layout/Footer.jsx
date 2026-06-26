import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-20 md:py-28 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-white/20 uppercase font-body mb-4">
              {t('footer.builtWith')}
            </p>
            <p className="text-xs text-white/30 font-body">
              {t('footer.rights', { year: currentYear })}
            </p>
          </div>
          <div className="flex items-center gap-6">
            {['privacy', 'terms'].map(k => (
              <a
                key={k}
                href="#"
                className="text-[10px] tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors duration-500 uppercase font-body"
              >
                {t(`footer.${k}`)}
              </a>
            ))}
          </div>
        </div>

        {/* Social links — AT style */}
        <div className="flex items-center gap-8">
          {['GITHUB', 'LINKEDIN', 'TWITTER'].map(name => (
            <a
              key={name}
              href="#"
              className="text-[10px] tracking-[0.25em] text-white/15 hover:text-white/50 transition-colors duration-500 uppercase font-body"
            >
              {name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;