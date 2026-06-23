import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Single Card ─── */
const Card = ({ project, idx, style }) => {
  const { t } = useTranslation();
  return (
    <div className="absolute left-0 right-0 flex items-center justify-center pointer-events-none" style={{ ...style, transformStyle: 'preserve-3d' }}>
      <div
        className="pointer-events-auto w-[320px] sm:w-[400px] md:w-[460px] lg:w-[520px] rounded-2xl bg-slate-900/80 border border-white/[0.07] backdrop-blur-sm overflow-hidden cursor-pointer select-none"
        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
      >
        {/* Color header */}
        <div className="relative h-[200px] md:h-[240px] overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor} opacity-75`} />
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }} />
          <span className="absolute -bottom-4 left-5 text-[9rem] md:text-[11rem] font-black text-white/[0.04] leading-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
            0{idx + 1}
          </span>
          {/* Decorative rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] md:w-[240px] md:h-[240px] rounded-full border border-white/[0.08]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full border border-white/[0.05]" />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-500 flex items-end">
            <div className="p-6 translate-y-6 opacity-0 hover:translate-y-0 hover:opacity-100 transition-all duration-500 ease-out">
              <div className="flex gap-3">
                <span className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white"><Github size={16} /></span>
                <span className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white"><ExternalLink size={16} /></span>
              </div>
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 3).map((tag, ti) => (
              <span key={ti} className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] rounded-full bg-white/[0.04] text-slate-500 border border-white/[0.05]">{tag}</span>
            ))}
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{project.title}</h3>
          <p className="text-slate-500 leading-relaxed font-medium text-sm line-clamp-2">{project.description}</p>
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-5">
            <span className="flex items-center gap-2 text-xs text-slate-500 font-medium"><Github size={13} /> {t('projects.sourceCode')}</span>
            <span className="flex items-center gap-2 text-xs font-medium" style={{ color: project.accentHex }}><ExternalLink size={13} /> {t('projects.liveDemo')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Section ─── */
const Projects = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  const [rotation, setRotation] = useState(0);
  const springRotation = useSpring(rotation, { stiffness: 60, damping: 25, mass: 0.8 });
  const [activeIndex, setActiveIndex] = useState(0);

  const numCards = 3;
  const angleStep = 360 / numCards;
  const radius = useMemo(() => {
    const cardW = 520;
    return Math.round((cardW * 0.7) / Math.tan(Math.PI / numCards));
  }, []);

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
  })), [t]);

  // Mouse-driven rotation
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0 to 1
    // Map 0→1 to -maxAngle→+maxAngle
    const maxAngle = 50;
    const targetRot = (x - 0.5) * 2 * maxAngle;
    setRotation(targetRot);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotation(0);
  }, []);

  // Touch support
  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const maxAngle = 50;
    const targetRot = (x - 0.5) * 2 * maxAngle;
    setRotation(targetRot);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setRotation(0);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      const headerLines = headerRef.current?.querySelectorAll('[data-gsap-reveal]');
      if (headerLines?.length) {
        gsap.set(headerLines, { y: 60, opacity: 0 });
        gsap.to(headerLines, {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%', end: 'top 40%', scrub: 1 },
        });
      }

      // Fade in carousel on scroll
      if (carouselRef.current) {
        gsap.fromTo(carouselRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0,
            duration: 1,
            scrollTrigger: { trigger: carouselRef.current, start: 'top 85%', end: 'top 50%', scrub: 1 },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Compute per-card styles from rotation
  const getCardStyle = (i) => {
    const baseAngle = i * angleStep;
    return { rotateY: baseAngle, translateZ: -radius };
  };

  // Compute per-card visual state from spring rotation
  const getCardVisual = (i) => {
    const baseAngle = i * angleStep;
    // Current effective angle of this card
    const effectiveAngle = ((baseAngle + rotation + 180 + 3600) % 360) - 180;
    const depthFactor = Math.cos((effectiveAngle * Math.PI) / 180);
    const scale = 0.7 + 0.3 * Math.max(0, depthFactor);
    const opacity = 0.05 + 0.95 * Math.max(0, depthFactor);
    const blur = 8 * (1 - Math.max(0, depthFactor));
    const brightness = 0.3 + 0.7 * Math.max(0, depthFactor);
    const isActive = Math.abs(effectiveAngle) < angleStep * 0.45;
    return { scale, opacity, blur, brightness, isActive, effectiveAngle, depthFactor };
  };

  // Subscribe to spring for active index
  useEffect(() => {
    const unsubscribe = springRotation.on('change', (v) => {
      const norm = (((-v) % 360) + 360) % 360;
      setActiveIndex(Math.round(norm / angleStep) % numCards);
    });
    return unsubscribe;
  }, [springRotation, angleStep, numCards]);

  const padIndex = (n) => String(n + 1).padStart(2, '0');

  return (
    <section ref={sectionRef} id="projects" className="relative bg-transparent overflow-hidden">
      {/* Background number */}
      <div className="absolute top-16 left-8 md:left-16 text-[10rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>03</div>

      {/* ── HEADER ── */}
      <div className="max-w-7xl mx-auto px-6 pt-48 pb-20 relative z-10">
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
          <div data-gsap-reveal className="mt-8 max-w-2xl">
            <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed">{t('projects.intro')}</p>
          </div>
        </div>
      </div>

      {/* ── 3D CYLINDER CAROUSEL (mouse-driven) ── */}
      <div ref={carouselRef} className="relative z-10">
        <div
          ref={containerRef}
          className="relative w-full h-[600px] md:h-[700px] lg:h-[750px] cursor-grab active:cursor-grabbing"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'none' }}
        >
          {/* Instruction hint */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[10px] tracking-[0.3em] text-slate-600 uppercase font-medium pointer-events-none select-none z-20">
            <div className="w-8 h-[1px] bg-slate-700" />
            Move your mouse
            <div className="w-8 h-[1px] bg-slate-700" />
          </div>

          {/* 3D scene */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1600px', perspectiveOrigin: '50% 50%' }}>
            <motion.div
              ref={trackRef}
              className="relative w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                rotateY: springRotation,
              }}
            >
              {projects.map((project, i) => {
                const visual = getCardVisual(i);
                const posStyle = getCardStyle(i);
                return (
                  <div
                    key={i}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      ...posStyle,
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateY(${-rotation}deg) scale(${visual.scale})`,
                        opacity: visual.opacity,
                        filter: `blur(${visual.blur}px) brightness(${visual.brightness})`,
                        transition: 'transform 0.15s ease-out, opacity 0.15s ease-out, filter 0.15s ease-out',
                      }}
                    >
                      <Card project={project} idx={i} style={{}} />
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Counter */}
        <div className="flex justify-center items-center gap-4 mt-2 pointer-events-none select-none">
          <span className="text-xs tracking-[0.3em] text-white/70 font-medium tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>{padIndex(activeIndex)}</span>
          <div className="w-6 h-[1px] bg-white/15" />
          <span className="text-xs tracking-[0.3em] text-white/25 font-medium tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>{padIndex(numCards - 1)}</span>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-3 pointer-events-none select-none">
          {projects.map((_, i) => (
            <div key={i} className="h-[2px] rounded-full transition-all duration-500 ease-out"
              style={{
                backgroundColor: i === activeIndex ? 'rgba(6,182,212,0.9)' : 'rgba(255,255,255,0.07)',
                width: i === activeIndex ? '28px' : '10px',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Spacer then Contact ── */}
      <div className="h-40" />
    </section>
  );
};

export default Projects;