import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Fade out hero content on scroll
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -60,
        scale: 0.96,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=40%',
          scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-[5] text-center px-6 max-w-5xl mx-auto"
      >
        {/* Top label — AT style */}
        <p className="text-[10px] md:text-[11px] tracking-[0.4em] text-white/25 uppercase font-body mb-8 md:mb-12">
          Creative Developer &amp; Designer
        </p>

        {/* Main title — AT style: large, minimal, elegant */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] font-normal text-white leading-[0.95] tracking-tight font-body">
          {t('hero.title').split(' ').map((word, i) => (
            <span key={i} className="inline-block mr-[0.15em] last:mr-0" style={{
              opacity: 0,
              animation: `atFadeUp 1.2s ${0.8 + i * 0.1}s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            }}>
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          className="mt-8 md:mt-12 text-sm md:text-base text-white/30 max-w-xl mx-auto leading-relaxed font-body"
          style={{
            opacity: 0,
            animation: `atFadeUp 1s 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
          }}
        >
          {t('hero.subtitle')}
        </p>

        {/* CTA — AT style: minimal underline link */}
        <div
          className="mt-10 md:mt-14"
          style={{
            opacity: 0,
            animation: `atFadeUp 1s 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
          }}
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-3 text-[11px] tracking-[0.25em] text-white/40 hover:text-white/80 transition-colors duration-500 uppercase font-body"
          >
            <span>{t('hero.ctaWork')}</span>
            <svg
              width="16"
              height="8"
              viewBox="0 0 16 8"
              fill="none"
              className="transition-transform duration-500 group-hover:translate-x-1"
            >
              <path d="M0 4H14M14 4L10 0.5M14 4L10 7.5" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator — AT style: minimal dot */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-3"
        style={{
          opacity: 0,
          animation: `atFadeUp 1s 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
        }}
      >
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/0 to-white/20" />
        <span className="text-[9px] tracking-[0.4em] text-white/15 uppercase font-body">
          Scroll
        </span>
      </div>
    </section>
  );
};

export default Hero;