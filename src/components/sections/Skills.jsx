import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TechIcons from '../../icons/TechIcons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Skills Section - Cleaned & Technical
 * - Removed decorative numbering (per DESIGN_TASTE.md)
 * - Minimalist Technical Grid
 * - Refined Glassmorphism
 */

const Skills = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal - Technical split
      const headerElements = headerRef.current?.querySelectorAll('[data-reveal]');
      if (headerElements?.length) {
        gsap.fromTo(headerElements,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
            }
          }
        );
      }

      // Skill items - Matrix stagger
      const items = gridRef.current?.querySelectorAll('.skill-item');
      if (items?.length) {
        gsap.fromTo(items,
          { opacity: 0, scale: 0.95, y: 30 },
          {
            opacity: 1, scale: 1, y: 0,
            duration: 1,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const skillList = [
    { key: 'frontend', techIcon: 'react' },
    { key: 'backend', techIcon: 'go' },
    { key: 'desktop', techIcon: 'electron' },
    { key: 'arch', techIcon: 'cleanArch' },
    { key: 'optimization', techIcon: 'performance' },
    { key: 'localization', techIcon: 'i18next' },
  ].map(s => ({ ...s, name: t(`skills.items.${s.key}.name`), description: t(`skills.items.${s.key}.desc`) }));

  return (
    <section ref={sectionRef} id="skills" className="relative py-48 bg-transparent">

      <div className="max-w-7xl mx-auto px-6">
        {/* Technical Header */}
        <div ref={headerRef} className="mb-32 max-w-4xl">
          <div data-reveal className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-white/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
              {t('skills.subtitle')}
            </span>
          </div>
          <h2 data-reveal className="text-5xl md:text-7xl font-display text-white leading-none tracking-tighter mb-10">
            {t('skills.title')}
          </h2>
          <p data-reveal className="text-base md:text-lg text-white/40 font-body leading-relaxed max-w-2xl">
            {t('skills.intro')}
          </p>
        </div>

        {/* Minimal Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-white/5">
          {skillList.map((skill, i) => (
            <div
              key={i}
              className="skill-item group relative p-12 border-r border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-700 overflow-hidden"
            >
              {/* Subtle hover accent */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

              <div className="relative z-10">
                {/* Tech Icon - Integrated */}
                <div className="mb-10 text-white/20 group-hover:text-white transition-colors duration-500 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                  <TechIcons name={skill.techIcon} className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">
                  {skill.name}
                </h3>

                <p className="text-sm text-white/30 font-medium leading-relaxed group-hover:text-white/50 transition-colors duration-500">
                  {skill.description}
                </p>
              </div>

              {/* Technical corner detail */}
              <div className="absolute bottom-4 right-4 w-2 h-2 border-r border-b border-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
