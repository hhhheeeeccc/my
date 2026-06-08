import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Magnetic from '../common/Magnetic';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 pointer-events-none"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-40 py-[90px] max-w-7xl mx-auto">
        {/* Cinematic Typography H1 */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] font-normal text-foreground animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {t('hero.title')}
        </h1>

        {/* Subtext */}
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay">
          {t('hero.subtitle')}
        </p>

        {/* CTA Button */}
        <div className="mt-12 animate-fade-rise-delay-2">
          <Magnetic>
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="liquid-glass rounded-full px-14 py-5 text-base text-foreground cursor-pointer transition-all duration-300 inline-block"
            >
              {t('hero.ctaWork')}
            </motion.a>
          </Magnetic>
        </div>
      </div>

      {/* Scroll Indicator (Simplified) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <div className="w-[1px] h-[60px] bg-gradient-to-b from-foreground/40 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
