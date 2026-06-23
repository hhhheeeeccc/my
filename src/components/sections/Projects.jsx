import React, { useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   ActiveTheory-Style Cinematic Scroll Project Showcase
   - Pinned fullscreen sections with scale/opacity transitions
   - Clip-path reveals between projects
   - 3D perspective tilt on visuals
   - Parallax depth layers
   - Rich visual atmosphere
   ═══════════════════════════════════════════════════════ */

const PROJECT_SCROLL_HEIGHT = 3; // multiplier of viewport height per project

const ProjectCard = ({ project, index, total }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const infoRef = useRef(null);
  const overlayTextRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      const card = cardRef.current;
      const image = imageRef.current;
      const title = titleRef.current;
      const info = infoRef.current;
      const overlay = overlayTextRef.current;
      const line = lineRef.current;

      // ─── ENTER ANIMATION ───
      // Project reveals as you scroll to it
      const enterTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'top 15%',
          scrub: 0.6,
        },
      });

      enterTl
        .fromTo(image,
          { scale: 1.15, y: 80, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(title,
          { y: 60, opacity: 0, rotateX: -12 },
          { y: 0, opacity: 1, rotateX: 0, ease: 'none' },
          0.15
        )
        .fromTo(info,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.25
        )
        .fromTo(line,
          { scaleX: 0 },
          { scaleX: 1, ease: 'none' },
          0.1
        )
        .fromTo(overlay,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 0.6, ease: 'none' },
          0.3
        );

      // ─── EXIT ANIMATION (not for last project) ───
      if (index < total - 1) {
        const exitTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'bottom top',
            end: 'bottom -30%',
            scrub: 0.6,
          },
        });

        exitTl
          .to(image, {
            scale: 0.82,
            y: -80,
            opacity: 0,
            ease: 'none',
          }, 0)
          .to(title, {
            y: -60,
            opacity: 0,
            ease: 'none',
          }, 0)
          .to(info, {
            y: -40,
            opacity: 0,
            ease: 'none',
          }, 0.05)
          .to(line, {
            scaleX: 0,
            ease: 'none',
          }, 0)
          .to(overlay, {
            opacity: 0,
            ease: 'none',
          }, 0);
      }

      // ─── 3D PERSPECTIVE TILT ON SCROLL ───
      gsap.to(image, {
        rotateX: -2.5,
        rotateY: index % 2 === 0 ? 3 : -3,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });

      // ─── PARALLAX: image moves slower than text ───
      gsap.to(image, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.3,
        },
      });

    }, cardRef);

    return () => ctx.revert();
  }, [index, total]);

  const pad = (n) => String(n + 1).padStart(2, '0');

  return (
    <div
      ref={cardRef}
      className="project-card relative"
      style={{ height: `${PROJECT_SCROLL_HEIGHT * 100}vh` }}
    >
      {/* ── Sticky fullscreen container ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center" style={{ perspective: '1400px' }}>

        {/* Background number - parallax */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.012] leading-none select-none pointer-events-none"
          style={{ fontFamily: 'var(--font-display)', willChange: 'transform' }}
        >
          {pad(index)}
        </div>

        {/* ── Project Image / Visual ── */}
        <div
          ref={imageRef}
          className="relative w-[85vw] max-w-[1400px] aspect-[16/9] md:aspect-[16/10] rounded-2xl overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity',
            boxShadow: `0 60px 120px -30px ${project.accentHex}18, 0 0 0 1px ${project.accentHex}06`,
          }}
        >
          {/* Main gradient visual */}
          <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor}`} />

          {/* Grid mesh overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

          {/* Radial light */}
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${project.accentHex}15, transparent 70%)`,
          }} />

          {/* Center rings - 3D floating */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }}>
            <div className="w-[180px] h-[180px] md:w-[280px] md:h-[280px] rounded-full border border-white/[0.08] animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-6 md:inset-10 rounded-full border border-white/[0.05] animate-[spin_30s_linear_infinite_reverse]" />
            <div className="absolute inset-14 md:inset-20 rounded-full border border-white/[0.03] animate-[spin_15s_linear_infinite]" />
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/20" />
          </div>

          {/* 3D floating geometric shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {/* Cube shape */}
            <div className="absolute left-[12%] top-[18%] w-16 h-16 md:w-24 md:h-24 animate-[float_6s_ease-in-out_infinite]" style={{
              transformStyle: 'preserve-3d',
              animationDelay: '0s',
            }}>
              <div className="w-full h-full border border-white/10 rounded-lg" style={{
                background: `linear-gradient(135deg, ${project.accentHex}12, transparent)`,
                transform: 'rotateX(15deg) rotateY(25deg)',
              }} />
            </div>

            {/* Diamond */}
            <div className="absolute right-[10%] top-[15%] w-10 h-10 md:w-16 md:h-16 animate-[float_8s_ease-in-out_infinite]" style={{
              animationDelay: '1s',
            }}>
              <div className="w-full h-full border border-white/[0.08] rotate-45" style={{
                background: `linear-gradient(135deg, ${project.accentHex}08, transparent)`,
              }} />
            </div>

            {/* Ring */}
            <div className="absolute right-[20%] bottom-[20%] w-20 h-20 md:w-32 md:h-32 rounded-full border border-white/[0.06] animate-[float_7s_ease-in-out_infinite]" style={{
              animationDelay: '2s',
              boxShadow: `0 0 40px ${project.accentHex}08, inset 0 0 40px ${project.accentHex}04`,
            }} />

            {/* Small sphere */}
            <div className="absolute left-[30%] bottom-[25%] w-6 h-6 md:w-10 md:h-10 rounded-full animate-[float_5s_ease-in-out_infinite]" style={{
              animationDelay: '3s',
              background: `radial-gradient(circle at 30% 30%, ${project.accentHex}30, ${project.accentHex}05)`,
              boxShadow: `0 0 20px ${project.accentHex}10`,
            }} />

            {/* Cross shape */}
            <div className="absolute left-[65%] top-[30%] w-12 h-12 md:w-18 md:h-18 animate-[float_9s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }}>
              <div className="w-full h-px bg-white/[0.06] absolute top-1/2 left-0" />
              <div className="w-px h-full bg-white/[0.06] absolute left-1/2 top-0" />
            </div>
          </div>

          {/* Project number watermark */}
          <span className="absolute -bottom-6 -right-2 text-[12rem] md:text-[18rem] font-black text-white/[0.025] select-none leading-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
            {pad(index)}
          </span>

          {/* Hover overlay with links */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all duration-700 flex items-end cursor-pointer">
            <div className="p-8 md:p-12 translate-y-8 opacity-0 hover:translate-y-0 hover:opacity-100 transition-all duration-500 ease-out w-full">
              <div className="flex items-center gap-4">
                <span className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/20 transition-colors">
                  <Github size={18} />
                </span>
                <span className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/20 transition-colors">
                  <ExternalLink size={18} />
                </span>
                <span className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/20 transition-colors">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Accent line ── */}
        <div
          ref={lineRef}
          className="w-[85vw] max-w-[1400px] h-px my-6 md:my-8"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.accentHex}30, transparent)`,
            transformOrigin: 'center',
          }}
        />

        {/* ── Project Info ── */}
        <div ref={infoRef} className="w-[85vw] max-w-[1400px] flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-8">
          {/* Left: category + title */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">{project.year}</span>
              <span className="w-1 h-1 rounded-full bg-white/15" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: project.accentHex + '60' }}>
                {project.category}
              </span>
            </div>
            <h3
              ref={titleRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1] tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                transformStyle: 'preserve-3d',
              }}
            >
              {project.title}
            </h3>
          </div>

          {/* Right: tags + links */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 4).map((tag, ti) => (
                <span
                  key={ti}
                  className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border"
                  style={{
                    backgroundColor: project.accentHex + '06',
                    color: project.accentHex + '70',
                    borderColor: project.accentHex + '12',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <span className="group flex items-center gap-2 text-xs text-white/30 hover:text-white/70 font-medium transition-colors duration-300 cursor-pointer">
                <Github size={14} />
                {project.viewSourceLabel}
              </span>
              <span className="group flex items-center gap-2 text-xs font-medium transition-colors duration-300 cursor-pointer" style={{ color: project.accentHex + '60' }}>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                {project.viewLiveLabel}
              </span>
            </div>
          </div>
        </div>

        {/* ── Overlay description text ── */}
        <p
          ref={overlayTextRef}
          className="w-[85vw] max-w-[1400px] mt-6 text-sm md:text-base text-white/25 font-medium leading-relaxed max-w-2xl"
        >
          {project.description}
        </p>

      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════
   MAIN PROJECTS SECTION
   ═══════════════════════════════════════════════════════ */
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
    viewSourceLabel: t('projects.sourceCode'),
    viewLiveLabel: t('projects.liveDemo'),
  })), [t]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Section header reveal ──
      const headerLines = headerRef.current?.querySelectorAll('[data-gsap-reveal]');
      if (headerLines?.length) {
        gsap.set(headerLines, { y: 100, opacity: 0 });
        gsap.to(headerLines, {
          y: 0, opacity: 1,
          duration: 1.2, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1,
          },
        });
      }

      // ── ActiveTheory-style: overlapping clip-path transitions between projects ──
      const cards = sectionRef.current?.querySelectorAll('.project-card');
      if (!cards?.length) return;

      // Create clip-path overlap: each card reveals the next one
      for (let i = 0; i < cards.length - 1; i++) {
        const current = cards[i];
        const next = cards[i + 1];

        // The next card's sticky content clips upward as current exits
        const nextSticky = next?.querySelector('.sticky');
        if (nextSticky) {
          gsap.fromTo(nextSticky,
            { clipPath: 'inset(100% 0 0 0)' },
            {
              clipPath: 'inset(0% 0 0 0)',
              ease: 'none',
              scrollTrigger: {
                trigger: current,
                start: '60% top',
                end: 'bottom top',
                scrub: 0.4,
              },
            }
          );
        }
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative bg-black">

      {/* ── HEADER ── */}
      <div className="relative z-10 pt-48 pb-24 md:pb-32">
        <div ref={headerRef} className="flex flex-col items-center text-center px-6">
          <div data-gsap-reveal className="flex items-center gap-4 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">
              {t('projects.subtitle')}
            </span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/20" />
          </div>
          <div data-gsap-reveal className="overflow-hidden">
            <h2
              className="text-5xl md:text-7xl lg:text-[8rem] font-black text-white tracking-tight leading-[0.85]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('projects.title')}
            </h2>
          </div>
          <div data-gsap-reveal className="mt-8 max-w-xl">
            <p className="text-base md:text-lg text-white/25 font-medium leading-relaxed">
              {t('projects.intro')}
            </p>
          </div>
        </div>
      </div>

      {/* ── ACTIVE THEORY STYLE PROJECTS ── */}
      {projects.map((project, i) => (
        <ProjectCard
          key={i}
          project={project}
          index={i}
          total={projects.length}
        />
      ))}

      {/* Bottom fade to next section */}
      <div className="relative h-40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none" />
      </div>
    </section>
  );
};

export default Projects;