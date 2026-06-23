import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Code2, Rocket, Heart, Sparkles, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../common/SplitText';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const featuresRef = useRef(null);
  const personalRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerLines = headerRef.current?.querySelectorAll('[data-gsap-reveal]');
      if (headerLines?.length) {
        gsap.set(headerLines, { y: 60, opacity: 0 });
        gsap.to(headerLines, {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%', end: 'top 40%', scrub: 1 }
        });
      }

      const features = featuresRef.current?.querySelectorAll('[data-feature-card]');
      if (features?.length) {
        gsap.set(features, { y: 80, opacity: 0, rotateX: -8 });
        gsap.to(features, {
          y: 0, opacity: 1, rotateX: 0,
          duration: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 80%', end: 'top 35%', scrub: 1 }
        });
      }

      if (personalRef.current) {
        gsap.fromTo(personalRef.current, { y: 100, opacity: 0, scale: 0.92 }, {
          y: 0, opacity: 1, scale: 1,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: personalRef.current, start: 'top 80%', end: 'top 40%', scrub: 1 }
        });
      }

      const bars = sectionRef.current?.querySelectorAll('[data-progress-bar]');
      bars?.forEach((bar, i) => {
        gsap.fromTo(bar, { scaleX: 0 }, {
          scaleX: 1, duration: 1.5, delay: i * 0.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: bar, start: 'top 90%', end: 'top 60%', scrub: 1 }
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-48 bg-transparent overflow-hidden">
      <div className="absolute top-16 left-8 md:left-16 text-[10rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>01</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-36 flex flex-col items-center text-center">
          <div data-gsap-reveal className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-cyan-500/60" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400/70">{t('about.subtitle')}</span>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-cyan-500/60" />
          </div>
          <div data-gsap-reveal className="overflow-hidden">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85]" style={{ fontFamily: 'var(--font-display)' }}>
               <SplitText delay={0.2}>{t('about.title')}</SplitText>
            </h2>
          </div>
          <div data-gsap-reveal className="mt-10 max-w-3xl">
            <p className="text-lg md:text-2xl text-slate-400 font-medium leading-relaxed italic">
              {t('about.intro')}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <div ref={featuresRef} className="space-y-6">
            {[
              { icon: <Code2 className="text-cyan-400" size={24} />, key: 'code', accent: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/20 hover:border-cyan-400/40' },
              { icon: <Rocket className="text-violet-400" size={24} />, key: 'rocket', accent: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/20 hover:border-violet-400/40' },
              { icon: <Sparkles className="text-amber-400" size={24} />, key: 'sparkles', accent: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/20 hover:border-amber-400/40' },
              { icon: <Zap className="text-emerald-400" size={24} />, key: 'zap', accent: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/20 hover:border-emerald-400/40' },
            ].map((item, idx) => (
              <div key={idx} data-feature-card className={`group relative p-8 rounded-3xl bg-slate-900/30 border ${item.border} backdrop-blur-sm transition-all duration-700 hover:bg-slate-900/50`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="relative z-10 flex items-start gap-6">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-all duration-500 shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">{t(`about.features.${item.key}.title`)}</h3>
                    <p className="text-slate-400 font-medium leading-relaxed text-sm">{t(`about.features.${item.key}.desc`)}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>
            ))}
          </div>

          <div ref={personalRef} className="lg:sticky lg:top-32">
            <div className="relative p-12 rounded-[3rem] bg-slate-900/40 border border-white/[0.06] backdrop-blur-xl overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><Heart size={180} className="text-cyan-400" fill="currentColor" /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-12">
                  <div className="p-4 bg-cyan-500/20 rounded-2xl text-cyan-400 border border-cyan-500/20"><User size={32} /></div>
                  <h3 className="text-3xl font-black text-white">{t('about.personalTouchTitle')}</h3>
                </div>
                <p className="text-2xl md:text-3xl text-slate-300 leading-relaxed italic font-display opacity-90">&ldquo;{t('about.personalTouchBio')}&rdquo;</p>
                <div className="mt-16 space-y-6">
                  {[{ w: '100%', label: 'Frontend Architecture' }, { w: '85%', label: 'Desktop (Electron)' }, { w: '70%', label: 'Performance/R&D' }].map((bar, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">{bar.label}</span>
                      <div className="w-full h-[4px] bg-white/[0.05] rounded-full overflow-hidden">
                        <div data-progress-bar className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: bar.w, transformOrigin: 'left' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
