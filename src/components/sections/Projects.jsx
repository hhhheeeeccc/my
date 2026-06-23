import React, { useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── 3D Floating Shape Component ─── */
const FloatingShape = ({ type, color, size, position }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const floats = [
      { prop: 'rotateX', range: 360, duration: 8 + Math.random() * 4 },
      { prop: 'rotateY', range: 360, duration: 10 + Math.random() * 4 },
      { prop: 'rotateZ', range: 180, duration: 12 + Math.random() * 4 },
    ];

    const anims = floats.map(f => {
      const dir = Math.random() > 0.5 ? 1 : -1;
      return gsap.to(el, {
        [f.prop]: f.range * dir,
        duration: f.duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    gsap.to(el, {
      y: position?.floatY || -20,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => anims.forEach(a => a.kill());
  }, []);

  const shapeStyle = {
    width: size,
    height: size,
    position: 'absolute',
    left: position?.left || '50%',
    top: position?.top || '50%',
    transformStyle: 'preserve-3d',
    perspective: '800px',
  };

  if (type === 'cube') {
    return (
      <div ref={ref} style={shapeStyle} className="pointer-events-none">
        <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
          {[0, 90, 180, 270].map((r, i) => (
            <div
              key={i}
              className="absolute inset-0 border rounded-lg"
              style={{
                borderColor: color + '30',
                background: color + '08',
                transform: `rotateY(${r}deg) translateZ(${size / 2}px)`,
                backfaceVisibility: 'hidden',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'ring') {
    return (
      <div ref={ref} style={shapeStyle} className="pointer-events-none">
        <div
          className="w-full h-full rounded-full border-2"
          style={{
            borderColor: color + '25',
            boxShadow: `0 0 30px ${color}15, inset 0 0 30px ${color}08`,
          }}
        />
      </div>
    );
  }

  if (type === 'diamond') {
    return (
      <div ref={ref} style={shapeStyle} className="pointer-events-none">
        <div
          className="w-full h-full border rotate-45"
          style={{
            borderColor: color + '20',
            background: `linear-gradient(135deg, ${color}10, transparent)`,
          }}
        />
      </div>
    );
  }

  // Default: sphere-like circle
  return (
    <div ref={ref} style={shapeStyle} className="pointer-events-none">
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}30, ${color}05)`,
          boxShadow: `0 0 40px ${color}15`,
        }}
      />
    </div>
  );
};

/* ─── Project Visual with 3D tilt on scroll ─── */
const ProjectVisual = ({ project, index }) => {
  const visualRef = useRef(null);
  const innerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!visualRef.current || !innerRef.current) return;

    const ctx = gsap.context(() => {
      // 3D perspective tilt based on scroll
      gsap.to(innerRef.current, {
        rotateY: index % 2 === 0 ? 8 : -8,
        rotateX: -3,
        scale: 0.92,
        ease: 'none',
        scrollTrigger: {
          trigger: visualRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Parallax overlay
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          y: -60,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: visualRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={visualRef} className="relative w-full" style={{ perspective: '1200px' }}>
      <div
        ref={innerRef}
        className="relative w-full aspect-[16/9] md:aspect-[16/10] rounded-2xl overflow-hidden border border-white/[0.06]"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: `0 40px 100px -20px ${project.accentHex}20, 0 0 0 1px ${project.accentHex}08`,
          willChange: 'transform',
        }}
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor}`} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Center circle decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full border border-white/[0.08]">
          <div className="absolute inset-4 rounded-full border border-white/[0.05]" />
          <div className="absolute inset-10 rounded-full border border-white/[0.03]" />
        </div>

        {/* Project number watermark */}
        <span className="absolute -bottom-4 -left-2 text-[10rem] md:text-[14rem] font-black text-white/[0.03] select-none leading-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* 3D floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          <FloatingShape type="ring" color={project.accentHex} size={80} position={{ left: '15%', top: '20%', floatY: -15 }} />
          <FloatingShape type="cube" color={project.accentHex} size={50} position={{ left: '75%', top: '65%', floatY: -20 }} />
          <FloatingShape type="diamond" color="#ffffff" size={35} position={{ left: '85%', top: '15%', floatY: -12 }} />
          <FloatingShape type="sphere" color={project.accentHex} size={25} position={{ left: '25%', top: '75%', floatY: -18 }} />
        </div>

        {/* Scroll parallax overlay */}
        <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-700 flex items-end">
          <div className="p-6 md:p-8 translate-y-6 opacity-0 hover:translate-y-0 hover:opacity-100 transition-all duration-500 ease-out">
            <div className="flex gap-3">
              <span className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white"><Github size={16} /></span>
              <span className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white"><ExternalLink size={16} /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Projects Section ─── */
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
        gsap.set(headerLines, { y: 80, opacity: 0 });
        gsap.to(headerLines, {
          y: 0, opacity: 1,
          duration: 1.2, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', end: 'top 35%', scrub: 1 },
        });
      }

      // ── ActiveTheory-style: each project section with scroll-driven parallax ──
      const sections = sectionRef.current?.querySelectorAll('.project-section');
      if (!sections?.length) return;

      sections.forEach((section, i) => {
        const visual = section.querySelector('.project-visual');
        const textContent = section.querySelector('.project-text');
        const title = section.querySelector('.project-title');
        const desc = section.querySelector('.project-desc');
        const tags = section.querySelector('.project-tags');
        const links = section.querySelector('.project-links');
        const meta = section.querySelector('.project-meta');
        const numBg = section.querySelector('.project-num-bg');
        const divider = section.querySelector('.project-divider');

        // Section clip-path reveal (like ActiveTheory)
        gsap.fromTo(section, {
          clipPath: i % 2 === 0
            ? 'inset(0 0 100% 0)'
            : 'inset(100% 0 0 0)',
        }, {
          clipPath: 'inset(0 0 0% 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 20%',
            scrub: 1,
          },
        });

        // Visual parallax - moves slower than scroll
        if (visual) {
          gsap.fromTo(visual, { y: 120 }, {
            y: -80,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
        }

        // Large background number parallax
        if (numBg) {
          gsap.fromTo(numBg, { y: 200, opacity: 0 }, {
            y: -100, opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.3,
            },
          });
        }

        // Text elements stagger reveal
        const textElements = [meta, title, desc, tags, links].filter(Boolean);
        if (textElements.length) {
          gsap.set(textElements, { y: 60, opacity: 0 });
          gsap.to(textElements, {
            y: 0, opacity: 1,
            duration: 0.8, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 1,
            },
          });
        }

        // Divider line grow
        if (divider) {
          gsap.fromTo(divider, { scaleX: 0 }, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              end: 'top 40%',
              scrub: 1,
            },
          });
        }

        // Section fade out at bottom
        gsap.to(section, {
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'bottom 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pad = (n) => String(n + 1).padStart(2, '0');

  return (
    <section ref={sectionRef} id="projects" className="relative bg-transparent">
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

      {/* ── PROJECT SECTIONS (ActiveTheory-style scroll-driven) ── */}
      {projects.map((project, i) => (
        <div
          key={i}
          className={`project-section relative py-24 md:py-40 ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}`}
        >
          {/* Large background number */}
          <div
            className="project-num-bg absolute top-0 left-0 md:left-8 text-[8rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {pad(i)}
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-16">
            {i % 2 === 0 ? (
              /* ── Even: Visual top, Text bottom ── */
              <div className="space-y-16 md:space-y-24">
                {/* Visual */}
                <div className="project-visual">
                  <ProjectVisual project={project} index={i} />
                </div>

                {/* Divider */}
                <div className="project-divider h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ transformOrigin: 'left' }} />

                {/* Text */}
                <div className="project-text max-w-3xl">
                  <div className="project-meta flex items-center gap-3 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-600">{project.year}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: project.accentHex + '88' }}>{project.category}</span>
                  </div>

                  <h3 className="project-title text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                    {project.title}
                  </h3>

                  <p className="project-desc text-slate-400 leading-relaxed font-medium text-lg md:text-xl mb-10 max-w-2xl">
                    {project.description}
                  </p>

                  <div className="project-tags flex flex-wrap gap-2.5 mb-10">
                    {project.tags.map((tag, ti) => (
                      <span
                        key={ti}
                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border"
                        style={{
                          backgroundColor: project.accentHex + '08',
                          color: project.accentHex + '99',
                          borderColor: project.accentHex + '18',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="project-links flex items-center gap-8">
                    <span role="button" tabIndex={0} className="group flex items-center gap-3 text-sm text-slate-500 hover:text-white font-medium transition-colors duration-300 cursor-pointer">
                      <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/25 group-hover:bg-white/5 transition-all duration-300">
                        <Github size={15} />
                      </span>
                      {t('projects.sourceCode')}
                    </span>
                    <span role="button" tabIndex={0} className="group flex items-center gap-3 text-sm font-medium transition-colors duration-300 cursor-pointer" style={{ color: project.accentHex + 'aa' }}>
                      <span className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ borderColor: project.accentHex + '25' }}>
                        <ArrowUpRight size={15} />
                      </span>
                      {t('projects.liveDemo')}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Odd: Text top, Visual bottom ── */
              <div className="space-y-16 md:space-y-24">
                {/* Text */}
                <div className="project-text max-w-3xl ml-auto md:ml-0">
                  <div className="project-meta flex items-center gap-3 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-600">{project.year}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: project.accentHex + '88' }}>{project.category}</span>
                  </div>

                  <h3 className="project-title text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                    {project.title}
                  </h3>

                  <p className="project-desc text-slate-400 leading-relaxed font-medium text-lg md:text-xl mb-10 max-w-2xl">
                    {project.description}
                  </p>

                  <div className="project-tags flex flex-wrap gap-2.5 mb-10">
                    {project.tags.map((tag, ti) => (
                      <span
                        key={ti}
                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border"
                        style={{
                          backgroundColor: project.accentHex + '08',
                          color: project.accentHex + '99',
                          borderColor: project.accentHex + '18',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="project-links flex items-center gap-8">
                    <span role="button" tabIndex={0} className="group flex items-center gap-3 text-sm text-slate-500 hover:text-white font-medium transition-colors duration-300 cursor-pointer">
                      <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/25 group-hover:bg-white/5 transition-all duration-300">
                        <Github size={15} />
                      </span>
                      {t('projects.sourceCode')}
                    </span>
                    <span role="button" tabIndex={0} className="group flex items-center gap-3 text-sm font-medium transition-colors duration-300 cursor-pointer" style={{ color: project.accentHex + 'aa' }}>
                      <span className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ borderColor: project.accentHex + '25' }}>
                        <ArrowUpRight size={15} />
                      </span>
                      {t('projects.liveDemo')}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="project-divider h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ transformOrigin: 'right' }} />

                {/* Visual */}
                <div className="project-visual">
                  <ProjectVisual project={project} index={i} />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Bottom spacer */}
      <div className="h-32" />
    </section>
  );
};

export default Projects;