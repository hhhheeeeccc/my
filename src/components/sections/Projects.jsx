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
  const projectRefs = useRef([]);

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
          ? 'from-cyan-500 via-teal-500 to-emerald-500'
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
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          },
        });
      }

      // ── Per-project parallax scroll (ActiveTheory style) ──
      projectRefs.current.forEach((panel, i) => {
        if (!panel) return;

        const visual = panel.querySelector('.at-visual');
        const titleEl = panel.querySelector('.at-title');
        const descEl = panel.querySelector('.at-desc');
        const metaEl = panel.querySelector('.at-meta');
        const tagsEl = panel.querySelector('.at-tags');
        const linksEl = panel.querySelector('.at-links');
        const indexEl = panel.querySelector('.at-index');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.4,
          },
        });

        // Visual: parallax — moves slower (enters from below)
        if (visual) {
          tl.fromTo(visual,
            { y: 120, scale: 1.08 },
            { y: -80, scale: 1.0, ease: 'none' },
            0
          );
        }

        // Index number: slow parallax
        if (indexEl) {
          tl.fromTo(indexEl,
            { y: 60, opacity: 0 },
            { y: -40, opacity: 1, ease: 'none' },
            0
          );
        }

        // Title: slides up and fades in
        if (titleEl) {
          tl.fromTo(titleEl,
            { y: 80, opacity: 0 },
            { y: -30, opacity: 1, ease: 'none' },
            0.1
          );
        }

        // Meta (year/category): slides up
        if (metaEl) {
          tl.fromTo(metaEl,
            { y: 50, opacity: 0 },
            { y: -20, opacity: 1, ease: 'none' },
            0.15
          );
        }

        // Tags: fade in
        if (tagsEl) {
          tl.fromTo(tagsEl,
            { y: 40, opacity: 0 },
            { y: -15, opacity: 1, ease: 'none' },
            0.2
          );
        }

        // Description: slides up
        if (descEl) {
          tl.fromTo(descEl,
            { y: 40, opacity: 0 },
            { y: -15, opacity: 1, ease: 'none' },
            0.25
          );
        }

        // Links: fade in last
        if (linksEl) {
          tl.fromTo(linksEl,
            { y: 30, opacity: 0 },
            { y: -10, opacity: 1, ease: 'none' },
            0.3
          );
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const padIndex = (n) => String(n + 1).padStart(2, '0');

  return (
    <section ref={sectionRef} id="projects" className="relative bg-transparent">
      {/* ── HEADER ── */}
      <div className="max-w-7xl mx-auto px-6 pt-48 pb-32 relative z-10">
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
              className="text-5xl md:text-7xl lg:text-[8rem] font-black text-white tracking-tight leading-[0.85]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('projects.title')}
            </h2>
          </div>
          <div data-gsap-reveal className="mt-10 max-w-2xl">
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
              {t('projects.intro')}
            </p>
          </div>
        </div>
      </div>

      {/* ── FULL-SCREEN PROJECT SECTIONS (ActiveTheory style) ── */}
      {projects.map((project, i) => (
        <div
          key={i}
          ref={(el) => (projectRefs.current[i] = el)}
          className="at-project relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{ paddingTop: '80px', paddingBottom: '80px' }}
        >
          {/* Full-width visual background */}
          <div
            className="at-visual absolute inset-0 opacity-30 pointer-events-none"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor}`} />
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              {/* Left: Visual card */}
              <div className="w-full lg:w-[60%]">
                <div
                  className="at-visual aspect-[16/10] rounded-2xl overflow-hidden relative border border-white/[0.06]"
                  style={{ boxShadow: `0 40px 120px -30px ${project.accentHex}30` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor}`} />

                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                      backgroundSize: '48px 48px',
                    }}
                  />

                  {/* Giant index */}
                  <span
                    className="at-index absolute -bottom-6 -left-4 text-[12rem] md:text-[16rem] font-black text-white/[0.05] select-none leading-none pointer-events-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {padIndex(i)}
                  </span>

                  {/* Decorative rings */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full border border-white/[0.08]"
                  />
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] md:w-[250px] md:h-[250px] rounded-full border border-white/[0.05]"
                  />
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-full border border-white/[0.03]"
                  />

                  {/* Hover overlay with icons */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-700 flex items-end pointer-events-auto cursor-pointer">
                    <div className="p-8 translate-y-8 opacity-0 hover:translate-y-0 hover:opacity-100 transition-all duration-500 ease-out">
                      <div className="flex gap-3">
                        <span className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white">
                          <Github size={18} />
                        </span>
                        <span className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white">
                          <ExternalLink size={18} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Text content */}
              <div className="w-full lg:w-[40%]">
                {/* Meta line */}
                <div className="at-meta flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                    {project.year}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: project.accentHex + 'aa' }}>
                    {project.category}
                  </span>
                </div>

                {/* Index */}
                <div
                  className="at-index text-7xl md:text-8xl lg:text-9xl font-black leading-none mb-2 select-none pointer-events-none"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: project.accentHex + '12',
                  }}
                >
                  {padIndex(i)}
                </div>

                {/* Title */}
                <h3
                  className="at-title text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 leading-[1.05]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {project.title}
                </h3>

                {/* Tags */}
                <div className="at-tags flex flex-wrap gap-2 mb-8">
                  {project.tags.slice(0, 3).map((tag, ti) => (
                    <span
                      key={ti}
                      className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border"
                      style={{
                        backgroundColor: project.accentHex + '08',
                        color: project.accentHex + '99',
                        borderColor: project.accentHex + '15',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="at-desc text-slate-400 leading-relaxed font-medium text-base md:text-lg mb-10 max-w-md">
                  {project.description}
                </p>

                {/* Links */}
                <div className="at-links flex items-center gap-8">
                  <span
                    role="button"
                    tabIndex={0}
                    className="group flex items-center gap-3 text-sm text-slate-400 hover:text-white font-medium transition-colors duration-300 cursor-pointer"
                  >
                    <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all duration-300">
                      <Github size={15} />
                    </span>
                    {t('projects.sourceCode')}
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    className="group flex items-center gap-3 text-sm font-medium transition-colors duration-300 cursor-pointer"
                    style={{ color: project.accentHex + 'cc' }}
                  >
                    <span
                      className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
                      style={{ borderColor: project.accentHex + '25' }}
                    >
                      <ExternalLink size={15} />
                    </span>
                    {t('projects.liveDemo')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Separator line between projects */}
          {i < projects.length - 1 && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          )}
        </div>
      ))}

      {/* ── View All ── */}
      <div className="max-w-7xl mx-auto px-6 py-40 flex justify-center relative z-10">
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.96 }}
          className="group inline-flex items-center gap-4 px-16 py-5 rounded-full bg-white/[0.03] text-white text-[13px] font-black tracking-[0.2em] uppercase border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.06] transition-all duration-700"
        >
          <span>{t('projects.viewMore')}</span>
          <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      </div>
    </section>
  );
};

export default Projects;