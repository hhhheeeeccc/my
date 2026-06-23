import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TechIcons from '../../icons/TechIcons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../common/SplitText';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

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

      const cards = gridRef.current?.querySelectorAll('[data-skill-card]');
      if (cards?.length) {
        gsap.set(cards, { y: 120, opacity: 0, scale: 0.85 });
        gsap.to(cards, {
          y: 0, opacity: 1, scale: 1,
          duration: 1, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%', end: 'top 30%', scrub: 1 }
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
    <section ref={sectionRef} id="skills" className="relative py-64 bg-transparent overflow-hidden">
      <div className="absolute top-16 right-8 md:right-16 text-[10rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>02</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-48 flex flex-col items-center text-center">
          <div data-gsap-reveal className="flex items-center gap-6 mb-12">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-violet-500" />
            <span className="text-xs font-black uppercase tracking-[0.5em] text-violet-400">{t('skills.subtitle')}</span>
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-violet-500" />
          </div>
          <div data-gsap-reveal className="overflow-hidden">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85]" style={{ fontFamily: 'var(--font-display)' }}>
              <SplitText delay={0.1}>{t('skills.title')}</SplitText>
            </h2>
          </div>
          <div data-gsap-reveal className="mt-12 max-w-3xl">
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed italic">{t('skills.intro')}</p>
          </div>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillList.map((skill, i) => (
            <div key={i} data-skill-card className={`group relative p-12 rounded-[2.5rem] bg-slate-900/30 border border-white/[0.06] backdrop-blur-xl ${skill.borderHover} transition-all duration-700 overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              <div className="relative z-10">
                <div className="mb-10 p-5 bg-white/5 rounded-2xl w-fit group-hover:bg-white/10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 border border-white/5">
                  <TechIcons name={skill.techIcon} className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-5 group-hover:text-cyan-300 transition-colors duration-500">{skill.name}</h3>
                <p className="text-slate-400 font-medium leading-relaxed text-base group-hover:text-slate-300 transition-colors duration-500">{skill.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Skills;
