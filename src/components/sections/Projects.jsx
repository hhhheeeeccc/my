import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Prevent '#' links from breaking scroll
const preventDefault = (e) => e.preventDefault();

const Projects = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const wrapperRef = useRef(null);

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
    accentColor: i === 1 ? '#6366f1' : i === 2 ? '#06b6d4' : '#8b5cf6',
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

      // ── ActiveTheory-style stacking scroll ──
      if (!wrapperRef.current) return;

      const projectEls = wrapperRef.current.querySelectorAll('.project-panel');
      if (!projectEls.length) return;

      projectEls.forEach((panel, i) => {
        const stickyCard = panel.querySelector('.project-sticky-card');
        const colorBlock = panel.querySelector('.project-color-block');
        const textBlock = panel.querySelector('.project-text-block');
        if (!stickyCard) return;

        // Create a ScrollTrigger for each project panel
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;

            // Scale down as user scrolls past (1.0 → 0.82)
            const scale = 1 - 0.18 * p;
            // Fade out (1.0 → 0.15)
            const opacity = 1 - 0.85 * p;
            // Move up slightly as it shrinks
            const y = -40 * p;

            gsap.set(stickyCard, {
              scale,
              opacity,
              y,
            });

            // Color block parallax — moves slower
            if (colorBlock) {
              gsap.set(colorBlock, {
                y: -80 * p,
              });
            }

            // Text block slides in from right
            if (textBlock) {
              const textProgress = Math.max(0, Math.min(1, (p - 0.15) / 0.35));
              const textX = 60 * (1 - textProgress);
              const textOpacity = textProgress;
              gsap.set(textBlock, {
                x: textX,
                opacity: textOpacity,
              });
            }
          },
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const padIndex = (n) => String(n + 1).padStart(2, '0');

  return (
    <section ref={sectionRef} id="projects" className="relative bg-transparent overflow-hidden">
      {/* Background giant number */}
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

      {/* ── STACKING PROJECT PANELS ── */}
      <div ref={wrapperRef} className="relative">
        {projects.map((project, i) => (
          <div
            key={i}
            className="project-panel relative"
            style={{ height: '200vh' }}
          >
            {/* Sticky card — stays in viewport while scrolling through the panel */}
            <div
              className="project-sticky-card sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
              style={{ zIndex: 10 + i }}
            >
              <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                {/* Color/visual block (left) */}
                <div
                  className="project-color-block w-full lg:w-[55%] aspect-[16/10] rounded-2xl overflow-hidden relative flex-shrink-0"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor}`} />
                  {/* Grid overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)',
                      backgroundSize: '48px 48px',
                    }}
                  />
                  {/* Giant index */}
                  <span
                    className="absolute -bottom-6 -left-2 text-[10rem] md:text-[14rem] font-black text-white/[0.06] select-none leading-none pointer-events-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {padIndex(i)}
                  </span>
                  {/* Decorative ring */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-white/[0.06]"
                  />
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full border border-white/[0.04]"
                  />
                </div>

                {/* Text block (right) */}
                <div
                  className="project-text-block w-full lg:w-[45%] flex flex-col justify-center"
                >
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

                  {/* Title */}
                  <h3
                    className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 leading-[1.1]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 leading-relaxed font-medium text-base md:text-lg mb-8 max-w-xl">
                    {project.description}
                  </p>

                  {/* Links */}
                  <div className="flex items-center gap-6">
                    <button
                      onClick={preventDefault}
                      className="group/btn flex items-center gap-2.5 text-sm text-white font-medium hover:gap-4 transition-all duration-500"
                    >
                      <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:bg-white/10 transition-colors duration-300">
                        <Github size={16} />
                      </span>
                      <span>{t('projects.sourceCode')}</span>
                    </button>
                    <button
                      onClick={preventDefault}
                      className="group/btn flex items-center gap-2.5 text-sm font-medium transition-all duration-500"
                      style={{ color: project.accentColor }}
                    >
                      <span className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-300" style={{ borderColor: project.accentColor + '40' }}>
                        <ExternalLink size={16} />
                      </span>
                      <span>{t('projects.liveDemo')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── View More ── */}
      <div className="max-w-7xl mx-auto px-4 py-32 flex justify-center relative z-10">
        <motion.button
          onClick={preventDefault}
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