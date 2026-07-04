import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

/**
 * Hero Section - Active Theory style
 * - Massive minimal typography
 * - Clip-path reveals
 * - No scroll cues (per DESIGN_TASTE.md)
 * - Cinematic feel
 */

const Hero = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = titleRef.current.querySelectorAll('.word-wrapper');

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.fromTo(words,
        { y: '100%', clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
        {
          y: '0%',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.5,
          stagger: 0.1,
          delay: 0.5
        }
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.8'
      )
      .fromTo(ctaRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1 },
        '-=1'
      );

      // Subtle parallax on mouse move
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 30;
        const yPos = (clientY / window.innerHeight - 0.5) * 30;

        gsap.to(titleRef.current, {
          x: xPos,
          y: yPos,
          duration: 2,
          ease: 'power2.out'
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-black"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

        {/* Massive Title */}
        <h1
          ref={titleRef}
          className="text-[12vw] md:text-[10vw] font-display text-white leading-[0.85] tracking-tighter uppercase select-none"
        >
          {t('hero.name').split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden py-[0.1em] mr-[0.2em] last:mr-0">
              <span className="word-wrapper inline-block">
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Subtitle - Professional & Minimal */}
        <div className="mt-12 max-w-2xl overflow-hidden">
          <p
            ref={subtitleRef}
            className="text-base md:text-lg text-white/40 font-body leading-relaxed tracking-wide"
          >
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Minimal CTA */}
        <div ref={ctaRef} className="mt-16">
          <a
            href="#projects"
            className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 backdrop-blur-md overflow-hidden"
          >
            <span className="relative z-10 text-[10px] tracking-[0.4em] text-white/60 group-hover:text-white uppercase font-black transition-colors duration-500">
              {t('hero.ctaWork')}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/20 to-violet-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </a>
        </div>
      </div>

      {/* Decorative Technical UI Corner - Subtle */}
      <div className="absolute top-12 left-12 w-32 h-32 border-l border-t border-white/5 pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-32 h-32 border-r border-b border-white/5 pointer-events-none" />
    </section>
  );
};

export default Hero;
