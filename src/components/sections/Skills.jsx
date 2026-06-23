import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import TechIcons from '../../icons/TechIcons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

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

      // Skill cards - diagonal stagger
      const cards = gridRef.current?.querySelectorAll('[data-skill-card]');
      if (cards?.length) {
        gsap.set(cards, { y: 100, opacity: 0, scale: 0.9 });
        gsap.to(cards, {
          y: 0, opacity: 1, scale: 1,
          duration: 0.8,
          stagger: {
            each: 0.08,
            from: 'start',
            grid: [2, 3],
          },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1,
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const skillList = [
    { key: 'frontend', techIcon: 'react', gradient: 'from-cyan-500/10 to-blue-500/10', borderHover: 'hover:border-cyan-500/30' },
    { key: 'backend', techIcon: 'go', gradient: 'from-blue-500/10 to-violet-500/10', borderHover: 'hover:border-blue-500/30' },
    { key: 'desktop', techIcon: 'electron', gradient: 'from-violet-500/10 to-purple-500/10', borderHover: 'hover:border-violet-500/30' },
    { key: 'arch', techIcon: 'cleanArch', gradient: 'from-emerald-500/10 to-cyan-500/10', borderHover: 'hover:border-emerald-500/30' },
    { key: 'optimization', techIcon: 'performance', gradient: 'from-amber-500/10 to-orange-500/10', borderHover: 'hover:border-amber-500/30' },
    { key: 'localization', techIcon: 'i18next', gradient: 'from-rose-500/10 to-pink-500/10', borderHover: 'hover:border-rose-500/30' },
  ].map(s => ({ ...s, name: t(`skills.items.${s.key}.name`), description: t(`skills.items.${s.key}.desc`) }));

  return (
    <section ref={sectionRef} id="skills" className="relative py-48 bg-transparent overflow-hidden">
      {/* Background number */}
      <div className="absolute top-16 right-8 md:right-16 text-[10rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
        02
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-36 flex flex-col items-center text-center">
          <div data-gsap-reveal className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-violet-500/60" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-violet-400/70">{t('skills.subtitle')}</span>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-violet-500/60" />
          </div>
          <div data-gsap-reveal className="overflow-hidden">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
              {t('skills.title')}
            </h2>
          </div>
          <div data-gsap-reveal className="mt-10 max-w-3xl">
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
              {t('skills.intro')}
            </p>
          </div>
        </div>

        {/* Skills grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillList.map((skill, i) => (
            <div
              key={i}
              data-skill-card
              className={`group relative p-8 md:p-10 rounded-2xl bg-slate-900/30 border border-white/[0.06] backdrop-blur-sm ${skill.borderHover} transition-all duration-700 overflow-hidden cursor-default`}
              style={{ perspective: '800px' }}
            >
              {/* Hover gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`} />

              {/* Glow spot */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/0 group-hover:bg-cyan-500/5 rounded-full blur-3xl transition-all duration-700" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-8 p-4 bg-white/[0.04] rounded-xl w-fit group-hover:bg-white/[0.08] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 border border-white/[0.04] group-hover:border-white/[0.08]">
                  <TechIcons name={skill.techIcon} className="w-7 h-7 text-cyan-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-cyan-300 transition-colors duration-500">
                  {skill.name}
                </h3>

                {/* Description */}
                <p className="text-slate-500 font-medium leading-relaxed text-sm group-hover:text-slate-400 transition-colors duration-500">
                  {skill.description}
                </p>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

              {/* Corner number */}
              <div className="absolute top-4 right-5 text-[3rem] font-black text-white/[0.02] leading-none select-none group-hover:text-white/[0.05] transition-colors duration-700" style={{ fontFamily: 'var(--font-display)' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Skills;