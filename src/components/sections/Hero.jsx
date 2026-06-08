import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Instagram, Twitter, ArrowRight } from 'lucide-react';
import Portrait3D from '../common/Portrait3D';
import Magnetic from '../common/Magnetic';

const Hero = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const fadingOutRef = useRef(false);
  const animationFrameRef = useRef(null);

  const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4";

  const fade = (targetOpacity, duration) => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const startTime = performance.now();
    const startOpacity = parseFloat(videoRef.current?.style.opacity || 0);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;

      if (videoRef.current) {
        videoRef.current.style.opacity = currentOpacity;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const timeLeft = video.duration - video.currentTime;
      if (timeLeft <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fade(0, 500);
      }
    };

    const handleEnded = () => {
      if (video) {
        video.style.opacity = 0;
        setTimeout(() => {
          video.currentTime = 0;
          video.play();
          fadingOutRef.current = false;
          fade(1, 500);
        }, 100);
      }
    };

    const handleCanPlay = () => {
      fade(1, 500);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const navLinks = [
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.skills'), href: '#skills' },
    { name: t('nav.projects'), href: '#projects' }
  ];

  return (
    <section id="hero" className="relative min-h-screen bg-black overflow-hidden font-sans">
      {/* Background Video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover translate-y-[17%] pointer-events-none"
        style={{ opacity: 0 }}
      />

      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="w-full px-6 py-6">
          <div className="max-w-5xl mx-auto liquid-glass rounded-full px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-white font-semibold text-lg">
                <Globe size={24} />
                <span>{t('hero.name')?.split(' ')[0] || 'Marwan'}</span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-white text-sm font-medium">{t('contact.emailMe')}</button>
              <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium">
                {t('admin.loginBtn')}
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[10%]">
          <div className="mb-6">
            <Magnetic>
              <Portrait3D />
            </Magnetic>
          </div>

          <h1
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-5xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tight"
          >
            {t('hero.name')}
          </h1>

          <div className="max-w-2xl w-full space-y-6">
            <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              <input
                type="email"
                placeholder={t('contact.emailPlaceholder')}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 text-base"
              />
              <button className="bg-white rounded-full p-3 text-black hover:scale-105 transition-transform">
                <ArrowRight size={20} />
              </button>
            </div>

            <p className="text-white text-base md:text-lg leading-relaxed px-4 opacity-90 font-medium">
              {t('hero.subtitle')}
            </p>

            <div className="pt-4">
              <a
                href="#projects"
                className="inline-block liquid-glass rounded-full px-10 py-4 text-white text-base font-medium hover:bg-white/5 transition-colors"
              >
                {t('hero.ctaWork')}
              </a>
            </div>
          </div>
        </div>

        {/* Social Icons Footer */}
        <div className="pb-12 flex justify-center gap-6">
          {[
            { icon: <Instagram size={22} />, label: 'Instagram' },
            { icon: <Twitter size={22} />, label: 'Twitter' },
            { icon: <Globe size={22} />, label: 'Website' }
          ].map((social, index) => (
            <button
              key={index}
              aria-label={social.label}
              className="liquid-glass rounded-full p-5 text-white/80 hover:text-white hover:bg-white/5 hover:scale-110 transition-all"
            >
              {social.icon}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
