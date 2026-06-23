import React, { useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const projects = useMemo(() => [1, 2, 3].map((i) => ({
    title: t(`projects.project${i}.title`),
    description: t(`projects.project${i}.description`),
    tags:
      i === 1
        ? [t('projects.tags.react'), t('projects.tags.ts'), t('projects.tags.go'), t('projects.tags.tailwind'), t('projects.tags.arch')]
        : i === 2
          ? [t('projects.tags.electron'), t('projects.tags.js'), t('projects.tags.node'), t('projects.tags.networking'), t('projects.tags.proxy')]
          : [t('projects.tags.react'), t('projects.tags.electron'), t('projects.tags.node'), t('projects.tags.uiohook'), t('projects.tags.perf')],
    iconColor:
      i === 1 ? 'from-blue-600 via-indigo-600 to-violet-600'
      : i === 2 ? 'from-cyan-500 via-teal-500 to-emerald-500'
      : 'from-violet-600 via-purple-600 to-fuchsia-500',
    accentHex: i === 1 ? '#818cf8' : i === 2 ? '#2dd4bf' : '#c084fc',
    year: '2024',
    category: i === 1 ? 'WEB / ENTERPRISE' : i === 2 ? 'DESKTOP / NETWORKING' : 'DESKTOP / PERFORMANCE',
  })), [t]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Header reveal ──
      const headerLines = headerRef.current?.querySelectorAll('[data-gsap-reveal]');
      if (headerLines?.length) {
        gsap.set(headerLines, { y: 60, opacity: 0 });
        gsap.to(headerLines, {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%', end: 'top 40%', scrub: 1 },
        });
      }

      // ── ActiveTheory-style: each project panel pinned with scroll-driven animation ──
      const panels = sectionRef.current?.querySelectorAll('.at-panel');
      if (!panels?.length) return;

      panels.forEach((panel, i) => {
        const stickyWrap = panel.querySelector('.at-sticky');
        const visual = panel.querySelector('.at-visual-inner');
        const textGroup = panel.querySelector('.at-text-group');
        const nextPanel = panels[i + 1];

        if (!stickyWrap) return;

        // The visual scales down and fades as you scroll through the panel
        if (visual) {
          gsap.to(visual, {
            scale: 0.88,
            y: -60,
            opacity: 0.4,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.3,
            },
          });
        }

        // Text group slides up into view
        if (textGroup) {
          gsap.fromTo(textGroup,
            { y: 120, opacity: 0 },
            {
              y: -80,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.3,
              },
            }
          );
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pad = (n) => String(n + 1).padStart(2, '0');

  return (
    <section ref={sectionRef} id="projects" className="relative bg-transparent">
      {/* Background number */}
      <div className="absolute top-16 left-8 md:left-16 text-[10rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>03</div>

      {/* ── HEADER ── */}
      <div className="max-w-7xl mx-auto px-6 pt-48 pb-32 relative z-10">
        <div ref={headerRef} className="flex flex-col items-center text-center">
          <div data-gsap-reveal className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500/60" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-400/70">{t('projects.subtitle')}</span>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500/60" />
          </div>
          <div data-gsap-reveal className="overflow-hidden">
            <h2 className="text-5xl md:text-7xl lg:text-[8rem] font-black text-white tracking-tight leading-[0.85]" style={{ fontFamily: 'var(--font-display)' }}>
              {t('projects.title')}
            </h2>
          </div>
          <div data-gsap-reveal className="mt-10 max-w-2xl">
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">{t('projects.intro')}</p>
          </div>
        </div>
      </div>

      {/* ── PROJECT PANELS (ActiveTheory sticky scroll) ── */}
      {projects.map((project, i) => (
        <div
          key={i}
          className="at-panel relative"
          style={{ height: `${Math.max(window?.innerHeight || 800, 800) * 2.2}px` }}
        >
          {/* Sticky container — stays pinned while scrolling through panel */}
          <div className="at-sticky sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden" style={{ zIndex: 10 + i }}>
            <div className="w-full max-w-[1300px] mx-auto px-6 md:px-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

              {/* ── Visual block (left) ── */}
              <div className="at-visual-inner w-full lg:w-[58%] flex-shrink-0">
                <div
                  className="aspect-[16/10] rounded-2xl overflow-hidden relative border border-white/[0.06]"
                  style={{ boxShadow: `0 40px 100px -20px ${project.accentHex}25` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor}`} />
                  <div className="absolute inset-0 opacity-[0.07]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                  }} />
                  <span className="absolute -bottom-5 -left-3 text-[11rem] md:text-[14rem] font-black text-white/[0.04] select-none leading-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
                    {pad(i)}
                  </span>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] md:w-[360px] md:h-[360px] rounded-full border border-white/[0.07]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] md:w-[230px] md:h-[230px] rounded-full border border-white/[0.04]" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-700 flex items-end cursor-pointer">
                    <div className="p-8 translate-y-6 opacity-0 hover:translate-y-0 hover:opacity-100 transition-all duration-500 ease-out">
                      <div className="flex gap-3">
                        <span className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white"><Github size={16} /></span>
                        <span className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white"><ExternalLink size={16} /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Text block (right) ── */}
              <div className="at-text-group w-full lg:w-[42%]">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-600">{project.year}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: project.accentHex + '88' }}>{project.category}</span>
                </div>

                <div className="text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-3 select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)', color: project.accentHex + '10' }}>
                  {pad(i)}
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
                  {project.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-7">
                  {project.tags.slice(0, 3).map((tag, ti) => (
                    <span key={ti} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border" style={{ backgroundColor: project.accentHex + '08', color: project.accentHex + '88', borderColor: project.accentHex + '15' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-slate-400 leading-relaxed font-medium text-base md:text-lg mb-9 max-w-md">
                  {project.description}
                </p>

                <div className="flex items-center gap-8">
                  <span role="button" tabIndex={0} className="group flex items-center gap-2.5 text-sm text-slate-500 hover:text-white font-medium transition-colors duration-300 cursor-pointer">
                    <span className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/25 group-hover:bg-white/5 transition-all duration-300">
                      <Github size={14} />
                    </span>
                    {t('projects.sourceCode')}
                  </span>
                  <span role="button" tabIndex={0} className="group flex items-center gap-2.5 text-sm font-medium transition-colors duration-300 cursor-pointer" style={{ color: project.accentHex + 'aa' }}>
                    <span className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300" style={{ borderColor: project.accentHex + '20' }}>
                      <ExternalLink size={14} />
                    </span>
                    {t('projects.liveDemo')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Spacer */}
      <div className="h-32" />
    </section>
  );
};

export default Projects;