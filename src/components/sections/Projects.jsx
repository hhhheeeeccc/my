import React, { useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const horizontalRef = useRef(null);
  const trackRef = useRef(null);

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
      i === 1
        ? 'from-blue-600 via-indigo-600 to-violet-600'
        : i === 2
          ? 'from-cyan-500 via-blue-500 to-indigo-500'
          : 'from-violet-600 via-purple-600 to-blue-600',
    accentHex: i === 1 ? '#818cf8' : i === 2 ? '#22d3ee' : '#a78bfa',
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
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          },
        });
      }

      // ── HORIZONTAL SCROLL (ActiveTheory style) ──
      if (!horizontalRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const totalScroll = track.scrollWidth - window.innerWidth;

      // Animate each project card individually for parallax
      const cards = track.querySelectorAll('.h-project-card');

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: horizontalRef.current,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Per-card parallax: inner elements move at different speeds
            cards.forEach((card, i) => {
              const visual = card.querySelector('.h-visual');
              const textContent = card.querySelector('.h-text');
              if (visual) {
                const direction = i % 2 === 0 ? -1 : 1;
                gsap.set(visual, { y: self.progress * 60 * direction });
              }
              if (textContent) {
                gsap.set(textContent, { y: -self.progress * 30 });
              }
            });
          },
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const padIndex = (n) => String(n + 1).padStart(2, '0');

  return (
    <section ref={sectionRef} id="projects" className="relative bg-transparent overflow-hidden">
      {/* Background number */}
      <div
        className="absolute top-16 left-8 md:left-16 text-[10rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        03
      </div>

      {/* ── HEADER ── */}
      <div className="max-w-7xl mx-auto px-4 pt-48 pb-28 relative z-10">
        <div ref={headerRef} className="flex flex-col items-center text-center">
          <div data-gsap-reveal className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500/60" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-400/70">
              {t('projects.subtitle')}
            </span>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500/60" />
          </div>
          <div data-gsap-reveal className="overflow-hidden">
            <h2
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('projects.title')}
            </h2>
          </div>
          <div data-gsap-reveal className="mt-10 max-w-3xl">
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
              {t('projects.intro')}
            </p>
          </div>
        </div>
      </div>

      {/* ── HORIZONTAL SCROLL SECTION ── */}
      <div ref={horizontalRef} className="relative z-10">
        <div
          ref={trackRef}
          className="flex h-screen will-change-transform"
          style={{ width: 'max-content' }}
        >
          {projects.map((project, i) => (
            <div
              key={i}
              className="h-project-card relative w-screen h-screen flex-shrink-0 flex items-center justify-center px-8 md:px-16 lg:px-24"
            >
              <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
                {/* Visual block */}
                <div
                  className="h-visual w-full lg:w-[58%] aspect-[16/10] rounded-2xl overflow-hidden relative flex-shrink-0 border border-white/[0.06]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor} opacity-80`} />

                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                      backgroundSize: '48px 48px',
                    }}
                  />

                  {/* Large index */}
                  <span
                    className="absolute -bottom-4 -left-2 text-[10rem] md:text-[13rem] font-black text-white/[0.05] select-none leading-none pointer-events-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {padIndex(i)}
                  </span>

                  {/* Decorative circles */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[350px] md:h-[350px] rounded-full border border-white/[0.06]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] md:w-[220px] md:h-[220px] rounded-full border border-white/[0.04]" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-700 flex items-end cursor-pointer">
                    <div className="p-6 md:p-8 translate-y-6 opacity-0 hover:translate-y-0 hover:opacity-100 transition-all duration-500">
                      <div className="flex gap-3">
                        <span className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white">
                          <Github size={18} />
                        </span>
                        <span className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white">
                          <ExternalLink size={18} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text block */}
                <div className="h-text w-full lg:w-[42%] flex flex-col">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.slice(0, 4).map((tag, ti) => (
                      <span
                        key={ti}
                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Index */}
                  <span
                    className="text-6xl md:text-7xl font-black mb-4 leading-none pointer-events-none select-none"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: project.accentHex + '15',
                    }}
                  >
                    {padIndex(i)}
                  </span>

                  {/* Title */}
                  <h3
                    className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 leading-[1.1]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 leading-relaxed font-medium text-base md:text-lg mb-8 max-w-md">
                    {project.description}
                  </p>

                  {/* Links — NO href="#" to prevent scroll break */}
                  <div className="flex items-center gap-8">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white font-medium transition-colors duration-300 cursor-pointer"
                    >
                      <Github size={16} />
                      {t('projects.sourceCode')}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2.5 text-sm font-medium transition-colors duration-300 cursor-pointer"
                      style={{ color: project.accentHex }}
                    >
                      <ExternalLink size={16} />
                      {t('projects.liveDemo')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Spacer panel so last card can be centered */}
          <div className="w-screen h-screen flex-shrink-0" />
        </div>
      </div>

      {/* ── View More ── */}
      <div className="max-w-7xl mx-auto px-4 py-32 flex justify-center relative z-10">
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.96 }}
          className="group inline-flex items-center gap-4 px-14 py-5 rounded-full bg-white/[0.04] text-white text-[13px] font-black tracking-[0.15em] uppercase border border-white/[0.08] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-700"
        >
          <span>{t('projects.viewMore')}</span>
          <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      </div>
    </section>
  );
};

export default Projects;