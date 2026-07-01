import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Code2, Rocket, Heart, Sparkles, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const featuresRef = useRef(null);
  const personalRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      const headerLines = headerRef.current?.querySelectorAll('[data-gsap-reveal]');
      if (headerLines?.length) {
        gsap.set(headerLines, { y: 60, opacity: 0 });
        gsap.to(headerLines, {
          y: 0, opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          }
        });
      }

      // Feature cards stagger
      const features = featuresRef.current?.querySelectorAll('[data-feature-card]');
      if (features?.length) {
        gsap.set(features, { y: 80, opacity: 0, rotateX: -8 });
        gsap.to(features, {
          y: 0, opacity: 1, rotateX: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
            end: 'top 35%',
            scrub: 1,
          }
        });
      }

      // Personal card reveal
      if (personalRef.current) {
        gsap.fromTo(personalRef.current,
          { y: 100, opacity: 0, scale: 0.92, rotateY: -5 },
          {
            y: 0, opacity: 1, scale: 1, rotateY: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: personalRef.current,
              start: 'top 80%',
              end: 'top 40%',
              scrub: 1,
            }
          }
        );
      }

      // Progress bars fill
      const bars = sectionRef.current?.querySelectorAll('[data-progress-bar]');
      if (bars?.length) {
        bars.forEach((bar, i) => {
          gsap.fromTo(bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.5,
              delay: i * 0.2,
              ease: 'power3.inOut',
              scrollTrigger: {
                trigger: bar,
                start: 'top 90%',
                end: 'top 60%',
                scrub: 1,
              }
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-48 bg-transparent overflow-hidden">
      {/* Large background number */}
      <div className="absolute top-16 left-8 md:left-16 text-[10rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
        01
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="mb-36 flex flex-col items-center text-center">
          <div data-gsap-reveal className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-cyan-500/60" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400/70">{t('about.subtitle')}</span>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-cyan-500/60" />
          </div>
          <div data-gsap-reveal className="overflow-hidden">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
              {t('about.title')}
            </h2>
          </div>
          <div data-gsap-reveal className="mt-10 max-w-3xl">
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
              {t('about.intro')}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-24 items-start">
          {/* Left column - features */}
          <div ref={featuresRef} className="space-y-6">
            {[
              { icon: <Code2 className="text-cyan-400" size={24} />, key: 'code', accent: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/20 hover:border-cyan-400/40' },
              { icon: <Rocket className="text-violet-400" size={24} />, key: 'rocket', accent: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/20 hover:border-violet-400/40' },
              { icon: <Sparkles className="text-amber-400" size={24} />, key: 'sparkles', accent: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/20 hover:border-amber-400/40' },
              { icon: <Zap className="text-emerald-400" size={24} />, key: 'zap', accent: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/20 hover:border-emerald-400/40' },
            ].map((item, idx) => (
              <div
                key={idx}
                data-feature-card
                className={`group relative p-8 rounded-3xl bg-slate-900/30 border ${item.border} backdrop-blur-sm transition-all duration-700 hover:bg-slate-900/50`}
                style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="relative z-10 flex items-start gap-6">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-2">
                      {t(`about.features.${item.key}.title`)}
                    </h3>
                    <p className="text-slate-400 font-medium leading-relaxed text-sm">
                      {t(`about.features.${item.key}.desc`)}
                    </p>
                  </div>
                </div>
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>
            ))}
          </div>

          {/* Right column - personal card */}
          <div ref={personalRef} className="lg:sticky lg:top-32">
            <div className="relative p-10 md:p-14 rounded-[2.5rem] bg-slate-900/40 border border-white/[0.06] backdrop-blur-sm overflow-hidden" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 p-6 opacity-[0.06]">
                <Heart size={140} className="text-cyan-400" fill="currentColor" />
              </div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3.5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl text-cyan-400 border border-cyan-500/20">
                    <User size={28} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white">{t('about.personalTouchTitle')}</h3>
                </div>

                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed italic opacity-80" style={{ fontFamily: 'var(--font-display)' }}>
                  &ldquo;{t('about.personalTouchBio')}&rdquo;
                </p>

                {/* Progress bars */}
                <div className="mt-12 space-y-4">
                  {[{ w: '100%', label: 'Frontend' }, { w: '85%', label: 'Desktop' }, { w: '70%', label: 'Backend' }].map((bar, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 w-20 shrink-0">{bar.label}</span>
                      <div className="flex-1 h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          data-progress-bar
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: bar.w, transformOrigin: 'left' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating border decorations */}
            <motion.div
              animate={{ x: [0, 8, 0], y: [0, -8, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -z-10 -top-4 -right-4 w-full h-full border border-cyan-500/[0.08] rounded-[2.5rem] pointer-events-none"
            />
            <motion.div
              animate={{ x: [0, -8, 0], y: [0, 8, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -z-10 -bottom-4 -left-4 w-full h-full border border-violet-500/[0.05] rounded-[2.5rem] pointer-events-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;