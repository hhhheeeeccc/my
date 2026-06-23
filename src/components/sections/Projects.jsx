import React, { useRef, useEffect, useState, useMemo } from 'react';
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
  const trackRef = useRef(null);
  const carouselRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const numCards = 3;
  const projects = useMemo(() => [1, 2, 3].map(i => ({
    title: t(`projects.project${i}.title`),
    description: t(`projects.project${i}.description`),
    tags: i === 1
      ? [t('projects.tags.react'), t('projects.tags.ts'), t('projects.tags.go'), t('projects.tags.tailwind'), t('projects.tags.arch')]
      : i === 2
        ? [t('projects.tags.electron'), t('projects.tags.js'), t('projects.tags.node'), t('projects.tags.networking'), t('projects.tags.proxy')]
        : [t('projects.tags.react'), t('projects.tags.electron'), t('projects.tags.node'), t('projects.tags.uiohook'), t('projects.tags.perf')],
    iconColor: i === 1
      ? 'from-blue-600 via-indigo-600 to-violet-600'
      : i === 2
        ? 'from-cyan-500 via-blue-500 to-indigo-500'
        : 'from-violet-600 via-purple-600 to-blue-600',
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

      // ── 3D CYLINDER CAROUSEL ──
      if (!trackRef.current || !carouselRef.current) return;

      const cards = trackRef.current.querySelectorAll('.carousel-card');
      if (!cards.length) return;

      const angleStep = 360 / numCards;
      // Radius: enough so adjacent cards are just peeking from behind
      const radius = 900;

      // Set initial card positions on cylinder
      cards.forEach((card, i) => {
        const angle = i * angleStep;
        gsap.set(card, {
          rotateY: angle,
          z: -radius,
          transformOrigin: 'center center',
        });
      });

      // Scroll-driven cylinder rotation
      const totalRotation = -360;

      gsap.to(trackRef.current, {
        rotateY: totalRotation,
        ease: 'none',
        scrollTrigger: {
          trigger: carouselRef.current,
          start: 'top top',
          end: `+=${numCards * 100}vh`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const rotation = progress * totalRotation;
            const normalizedAngle = (((-rotation) % 360) + 360) % 360;
            const idx = Math.round(normalizedAngle / angleStep) % numCards;
            setActiveIndex(idx);

            // Per-card depth & visual state
            cards.forEach((card, i) => {
              const cardAngle = i * angleStep;
              const relativeAngle = ((cardAngle - normalizedAngle + 180 + 360) % 360) - 180;
              const depthFactor = Math.cos((relativeAngle * Math.PI) / 180);

              const isActive = Math.abs(relativeAngle) < angleStep * 0.45;

              // Counter-rotate card content to always face camera
              const cardInner = card.querySelector('.card-inner');
              if (cardInner) {
                gsap.set(cardInner, { rotateY: -rotation });
              }

              // Scale: 1.0 → 0.82
              const s = 0.82 + 0.18 * Math.max(0, depthFactor);
              // Opacity: 1.0 → 0.08
              const o = 0.08 + 0.92 * Math.max(0, depthFactor);
              // Z-push: bring front card closer for parallax depth
              const zPush = -80 * (1 - Math.max(0, depthFactor));
              // Blur: 0 → 6px for back cards
              const blur = 6 * (1 - Math.max(0, depthFactor));

              gsap.to(card, {
                scale: s,
                opacity: o,
                z: -radius + zPush,
                filter: `blur(${blur}px) brightness(${0.35 + 0.65 * Math.max(0, depthFactor)})`,
                duration: 0.35,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            });
          },
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [numCards]);

  // Index display helper
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

      {/* ── HEADER (above the pinned area) ── */}
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

      {/* ── 3D CYLINDER CAROUSEL (pinned on scroll) ── */}
      <div ref={carouselRef} className="relative w-full" style={{ minHeight: '100vh' }}>

        {/* Counter indicator — bottom center */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none">
          <div className="flex items-center gap-4">
            <span className="text-xs tracking-[0.25em] text-white/80 font-medium tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
              {padIndex(activeIndex)}
            </span>
            <div className="w-8 h-[1px] bg-white/20" />
            <span className="text-xs tracking-[0.25em] text-white/30 font-medium tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
              {padIndex(numCards - 1)}
            </span>
          </div>
          {/* Dot indicators */}
          <div className="flex gap-2 mt-1">
            {projects.map((_, i) => (
              <div
                key={i}
                className="h-[2px] rounded-full transition-all duration-700 ease-out"
                style={{
                  backgroundColor: i === activeIndex ? 'rgba(6,182,212,0.9)' : 'rgba(255,255,255,0.08)',
                  width: i === activeIndex ? '32px' : '12px',
                }}
              />
            ))}
          </div>
        </div>

        {/* Scroll hint arrow — left side */}
        <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-white/15" />
          <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase font-medium -rotate-90 origin-center whitespace-nowrap">
            Scroll
          </span>
        </div>

        {/* 3D perspective wrapper */}
        <div
          className="flex items-center justify-center w-full h-screen"
          style={{
            perspective: '1800px',
            perspectiveOrigin: '50% 50%',
          }}
        >
          {/* Rotating track — GSAP rotates this */}
          <div
            ref={trackRef}
            className="relative"
            style={{
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
            }}
          >
            {projects.map((project, i) => (
              <div
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
                className="carousel-card absolute left-0 right-0 flex items-center justify-center"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Card content — counter-rotated to always face camera */}
                <div className="card-inner" style={{ transformStyle: 'preserve-3d' }}>
                  <div
                    className="w-[360px] sm:w-[440px] md:w-[520px] lg:w-[580px] rounded-2xl bg-slate-900/70 border border-white/[0.06] backdrop-blur-sm overflow-hidden cursor-pointer group"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* ── Color header area ── */}
                    <div className="relative h-[200px] md:h-[260px] overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor} opacity-70`} />

                      {/* Grid overlay */}
                      <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{
                          backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
                          backgroundSize: '48px 48px',
                        }}
                      />

                      {/* Giant index number */}
                      <span
                        className="absolute -bottom-4 left-6 text-[9rem] md:text-[11rem] font-black text-white/[0.04] select-none leading-none pointer-events-none"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {padIndex(i)}
                      </span>

                      {/* Hover overlay with links */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-700 flex items-end">
                        <div className="p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                          <div className="flex gap-3">
                            <span className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white cursor-pointer hover:bg-white/20 transition-colors">
                              <Github size={18} />
                            </span>
                            <span className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white cursor-pointer hover:bg-white/20 transition-colors">
                              <ExternalLink size={18} />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Top-right arrow */}
                      <div className="absolute top-5 right-5 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <ArrowUpRight size={16} className="text-white" />
                      </div>
                    </div>

                    {/* ── Content area ── */}
                    <div className="p-7 md:p-9">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.tags.slice(0, 3).map((tag, ti) => (
                          <span
                            key={ti}
                            className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full bg-white/[0.04] text-slate-500 border border-white/[0.04]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-cyan-300 transition-colors duration-500">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-500 leading-relaxed font-medium text-sm line-clamp-2">
                        {project.description}
                      </p>

                      {/* Bottom links */}
                      <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                        <div className="flex gap-5">
                          <a
                            href="#"
                            className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors font-medium"
                          >
                            <Github size={14} /> {t('projects.sourceCode')}
                          </a>
                          <a
                            href="#"
                            className="flex items-center gap-2 text-xs text-cyan-400/70 hover:text-cyan-300 transition-colors font-bold"
                          >
                            <ExternalLink size={14} /> {t('projects.liveDemo')}
                          </a>
                        </div>
                        <ArrowUpRight size={18} className="text-slate-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── View More (after unpinned) ── */}
      <div className="max-w-7xl mx-auto px-4 py-32 flex justify-center relative z-10">
        <motion.a
          href="#"
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
        </motion.a>
      </div>
    </section>
  );
};

export default Projects;