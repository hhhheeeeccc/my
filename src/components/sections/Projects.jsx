import React, { useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   ActiveTheory /work clone
   ─ Full-bleed fullscreen projects (no cards, no borders)
   ─ Minimal text: number + category + title only
   ─ Crossfade + zoom transitions driven by scroll
   ─ 3D perspective shift on visuals
   ═══════════════════════════════════════════════════════════════ */

const Projects = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const projects = useMemo(() => [1, 2, 3].map((i) => ({
    title: t(`projects.project${i}.title`),
    category: i === 1 ? 'WEB / ENTERPRISE' : i === 2 ? 'DESKTOP / NETWORKING' : 'DESKTOP / PERFORMANCE',
    accentHex: i === 1 ? '#818cf8' : i === 2 ? '#2dd4bf' : '#c084fc',
    iconColor:
      i === 1 ? 'from-blue-600 via-indigo-600 to-violet-600'
      : i === 2 ? 'from-cyan-500 via-teal-500 to-emerald-500'
      : 'from-violet-600 via-purple-600 to-fuchsia-500',
  })), [t]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {

      // ── Header reveal ──
      const hl = headerRef.current?.querySelectorAll('[data-r]');
      if (hl?.length) {
        gsap.set(hl, { y: 80, opacity: 0 });
        gsap.to(hl, {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', end: 'top 30%', scrub: 1 },
        });
      }

      // ── Each fullscreen project ──
      const panels = sectionRef.current.querySelectorAll('.at-project');
      panels.forEach((panel, i) => {
        const bg = panel.querySelector('.at-bg');
        const num = panel.querySelector('.at-num');
        const cat = panel.querySelector('.at-cat');
        const title = panel.querySelector('.at-title');
        const line = panel.querySelector('.at-line');

        // ENTER: project fades in from below
        gsap.set([bg, num, cat, title, line], { opacity: 0 });
        gsap.set(bg, { scale: 1.08, y: 40 });
        gsap.set(title, { y: 50 });
        gsap.set(cat, { y: 30 });
        gsap.set(line, { scaleX: 0 });

        gsap.to(bg, {
          opacity: 1, scale: 1, y: 0,
          duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: panel, start: 'top 95%', end: 'top 30%', scrub: 0.6 },
        });
        gsap.to(num, {
          opacity: 0.15, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: panel, start: 'top 90%', end: 'top 40%', scrub: 0.6 },
        });
        gsap.to(cat, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: panel, start: 'top 80%', end: 'top 35%', scrub: 0.6 },
        });
        gsap.to(title, {
          opacity: 1, y: 0, scale: 1.05, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: panel, start: 'top 75%', end: 'top 25%', scrub: 0.6 },
        });
        // Split title into words if possible for better stagger (manual implementation here via simple CSS)
        title.style.perspective = '1000px';
        gsap.to(line, {
          scaleX: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: panel, start: 'top 80%', end: 'top 40%', scrub: 0.6 },
        });

        // 3D PERSPECTIVE: subtle tilt on the background
        gsap.to(bg, {
          rotateX: -1.5,
          rotateY: i % 2 === 0 ? 1.5 : -1.5,
          ease: 'none',
          scrollTrigger: { trigger: panel, start: 'top 80%', end: 'bottom 20%', scrub: 1 },
        });

        // DURING VIEW: slow zoom in as user reads
        gsap.to(bg, {
          scale: 1.04,
          ease: 'none',
          scrollTrigger: { trigger: panel, start: 'top top', end: 'bottom top', scrub: 0.3 },
        });

        // EXIT: fade out
        gsap.to(bg, {
          scale: 0.96, opacity: 0, y: -30,
          ease: 'none',
          scrollTrigger: { trigger: panel, start: 'bottom 80%', end: 'bottom 20%', scrub: 0.6 },
        });
        gsap.to(title, {
          opacity: 0, y: -40,
          ease: 'none',
          scrollTrigger: { trigger: panel, start: 'bottom 75%', end: 'bottom 25%', scrub: 0.6 },
        });
        gsap.to(cat, {
          opacity: 0, y: -20,
          ease: 'none',
          scrollTrigger: { trigger: panel, start: 'bottom 70%', end: 'bottom 30%', scrub: 0.6 },
        });
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const pad = (n) => String(n + 1).padStart(2, '0');

  return (
    <section ref={sectionRef} id="projects" className="relative bg-black">

      {/* ── Minimal Header ── */}
      <div className="relative z-10 pt-40 pb-20 md:pt-52 md:pb-28 px-6 md:px-12 lg:px-20">
        <div ref={headerRef}>
          <div data-r className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
              {t('projects.subtitle')}
            </span>
          </div>
          <div data-r className="overflow-hidden">
            <h2
              className="text-5xl md:text-7xl lg:text-[8rem] font-black text-white tracking-tight leading-[0.85]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('projects.title')}
            </h2>
          </div>
          <div data-r className="mt-6 max-w-lg">
            <p className="text-sm md:text-base text-white/20 font-medium leading-relaxed">
              {t('projects.intro')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Fullscreen Projects (ActiveTheory pattern) ── */}
      {projects.map((project, i) => (
        <div
          key={i}
          className="at-project relative"
          style={{ height: '120vh' }}
        >
          {/* Sticky fullscreen viewport */}
          <div
            className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between"
            style={{ perspective: '1400px' }}
          >
            {/* ── Full-bleed Background Visual ── */}
            <div
              className="at-bg absolute inset-0"
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity',
              }}
            >
              {/* Main gradient - simulates fullscreen project image */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor}`} />
              {/* Noise grain overlay for ActiveTheory feel */}
              <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")', backgroundSize: '200px' }} />

              {/* Subtle texture */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }} />

              {/* Radial vignette */}
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.4) 100%)',
              }} />

              {/* Very subtle center glow */}
              <div className="absolute inset-0" style={{
                background: `radial-gradient(ellipse 40% 35% at 50% 45%, ${project.accentHex}12, transparent)`,
              }} />
            </div>

            {/* ── Text Overlay (bottom-left, ActiveTheory style) ── */}
            <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-12 lg:px-20 pb-16 md:pb-24">
              {/* Category line */}
              <div className="flex items-center gap-4 mb-5">
                <div className="at-line h-px w-10 bg-white/20" style={{ transformOrigin: 'left' }} />
                <span
                  className="at-cat text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em]"
                  style={{ color: `${project.accentHex}88` }}
                >
                  {pad(i)} — {project.category}
                </span>
              </div>

              {/* Project Title with staggered word effect */}
              <h3
                className="at-title text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-black text-white leading-[0.9] tracking-tight max-w-[90vw]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {project.title.split(' ').map((word, idx) => (
                  <span key={idx} className="inline-block mr-[0.2em] last:mr-0 transition-transform duration-700 hover:scale-110">
                    {word}
                  </span>
                ))}
              </h3>
            </div>

            {/* ── Large background number ── */}
            <div
              className="at-num absolute top-8 right-8 md:top-16 md:right-16 text-[8rem] md:text-[14rem] font-black leading-none select-none pointer-events-none"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'rgba(255,255,255,0.03)',
              }}
            >
              {pad(i)}
            </div>

            {/* Bottom fade to black for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-[5]" />
          </div>
        </div>
      ))}

      {/* Bottom spacer */}
      <div className="h-20" />
    </section>
  );
};

export default Projects;