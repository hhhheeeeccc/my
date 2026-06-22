import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Single project card content (rendered inside the 3D carousel)
const ProjectCardContent = ({ project, idx, isActive }) => {
  const { t } = useTranslation();

  return (
    <div
      className="project-cylinder-card w-[340px] sm:w-[420px] md:w-[480px] h-[520px] md:h-[600px] rounded-2xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-500"
      style={{
        backfaceVisibility: 'hidden',
        opacity: isActive ? 1 : 0.4,
        transform: isActive ? 'scale(1)' : 'scale(0.88)',
        filter: isActive ? 'brightness(1)' : 'brightness(0.5)',
        transition: 'opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease',
      }}
    >
      {/* Color header */}
      <div className="relative h-[240px] md:h-[280px] overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.iconColor} opacity-80`} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Large number */}
        <span
          className="absolute bottom-2 left-5 text-[10rem] md:text-[12rem] font-black text-white/[0.04] select-none leading-none pointer-events-none"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          0{idx + 1}
        </span>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-500 flex items-end">
          <div className="p-6 translate-y-8 opacity-0 hover:translate-y-0 hover:opacity-100 transition-all duration-500 ease-out">
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

        {/* Top arrow */}
        <div className="absolute top-5 right-5 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 opacity-0 hover:opacity-100 transition-opacity">
          <ArrowUpRight size={16} className="text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-7 md:p-9">
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full bg-white/[0.04] text-slate-500 border border-white/[0.04]">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white mb-3 hover:text-cyan-300 transition-colors duration-500">
          {project.title}
        </h3>
        <p className="text-slate-500 leading-relaxed font-medium text-sm line-clamp-2">
          {project.description}
        </p>
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex gap-5">
            <a href="#" className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors font-medium">
              <Github size={14} /> {t('projects.sourceCode')}
            </a>
            <a href="#" className="flex items-center gap-2 text-xs text-cyan-400/70 hover:text-cyan-300 transition-colors font-bold">
              <ExternalLink size={14} /> {t('projects.liveDemo')}
            </a>
          </div>
          <ArrowUpRight size={18} className="text-slate-600" />
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const carouselRef = useRef(null);
  const cylinderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const numCards = 3;
  // Calculate cylinder radius based on card width (approximate)
  const cardWidth = 480;
  const angleStep = 360 / numCards;
  const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / numCards)) + 60;

  const projects = useMemo(() => [1, 2, 3].map(i => ({
    title: t(`projects.project${i}.title`),
    description: t(`projects.project${i}.description`),
    tags: i === 1 ? [t('projects.tags.react'), t('projects.tags.ts'), t('projects.tags.go'), t('projects.tags.tailwind'), t('projects.tags.arch')] :
          i === 2 ? [t('projects.tags.electron'), t('projects.tags.js'), t('projects.tags.node'), t('projects.tags.networking'), t('projects.tags.proxy')] :
          [t('projects.tags.react'), t('projects.tags.electron'), t('projects.tags.node'), t('projects.tags.uiohook'), t('projects.tags.perf')],
    iconColor: i === 1 ? "from-blue-600 via-indigo-600 to-violet-600" : i === 2 ? "from-cyan-500 via-blue-500 to-indigo-500" : "from-violet-600 via-purple-600 to-blue-600"
  })), [t]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      const headerLines = headerRef.current?.querySelectorAll('[data-gsap-reveal]');
      if (headerLines?.length) {
        gsap.set(headerLines, { y: 60, opacity: 0 });
        gsap.to(headerLines, {
          y: 0, opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          }
        });
      }

      // === 3D CYLINDER CAROUSEL ===
      if (!carouselRef.current || !cylinderRef.current) return;

      const cards = cylinderRef.current.querySelectorAll('.project-cylinder-card');
      if (!cards.length) return;

      // Set initial positions on the cylinder
      cards.forEach((card, i) => {
        const angle = i * angleStep;
        gsap.set(card, {
          rotateY: angle,
          z: -radius,
          transformOrigin: 'center center',
        });
        // Counter-rotate the card content so it always faces the viewer
        gsap.set(card, {
          rotateY: angle,
          z: -radius,
        });
      });

      // Scroll-driven rotation of the entire cylinder
      const totalRotation = -360; // One full rotation

      const scrollTween = gsap.to(cylinderRef.current, {
        rotateY: totalRotation,
        ease: 'none',
        scrollTrigger: {
          trigger: carouselRef.current,
          start: 'top top',
          end: `+=${numCards * 100}vh`, // Scroll distance per rotation
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Determine which card is active (closest to facing viewer)
            const progress = self.progress;
            const rotation = progress * totalRotation;
            const normalizedAngle = (((-rotation) % 360) + 360) % 360;
            const idx = Math.round(normalizedAngle / angleStep) % numCards;
            setActiveIndex(idx);

            // Update each card's counter-rotation and visual state
            cards.forEach((card, i) => {
              const cardAngle = i * angleStep;
              const relativeAngle = ((cardAngle - normalizedAngle + 180 + 360) % 360) - 180;
              const isActive = Math.abs(relativeAngle) < angleStep / 2;

              // Counter-rotate so card content stays upright
              gsap.set(card, {
                rotateY: cardAngle,
              });

              // Visual depth based on angle
              const depth = Math.cos((relativeAngle * Math.PI) / 180);
              const scale = 0.75 + 0.25 * Math.max(0, depth);
              const opacity = 0.15 + 0.85 * Math.max(0, depth);
              const brightness = 0.4 + 0.6 * Math.max(0, depth);

              gsap.to(card, {
                scale,
                opacity,
                filter: `brightness(${brightness})`,
                duration: 0.3,
                ease: 'power2.out',
              });
            });
          }
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [numCards, angleStep, radius]);

  return (
    <section ref={sectionRef} id="projects" className="relative bg-transparent overflow-hidden">
      {/* Background number */}
      <div className="absolute top-16 left-8 md:left-16 text-[10rem] md:text-[14rem] font-black text-white/[0.015] leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
        03
      </div>

      {/* Header - NOT inside the pinned area */}
      <div className="max-w-7xl mx-auto px-4 pt-48 pb-24 relative z-10">
        <div ref={headerRef} className="flex flex-col items-center text-center">
          <div data-gsap-reveal className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500/60" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-400/70">{t('projects.subtitle')}</span>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500/60" />
          </div>
          <div data-gsap-reveal className="overflow-hidden">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
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

      {/* 3D CYLINDER CAROUSEL - pinned on scroll */}
      <div ref={carouselRef} className="relative w-full" style={{ minHeight: '100vh' }}>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[10px] tracking-[0.3em] text-slate-600 uppercase font-medium">
            {activeIndex + 1} / {numCards}
          </span>
          <div className="flex gap-2">
            {projects.map((_, i) => (
              <div
                key={i}
                className="w-6 h-[2px] rounded-full transition-all duration-500"
                style={{
                  backgroundColor: i === activeIndex ? 'rgba(6, 182, 212, 0.8)' : 'rgba(255,255,255,0.1)',
                  width: i === activeIndex ? '24px' : '16px',
                }}
              />
            ))}
          </div>
        </div>

        {/* 3D perspective container */}
        <div className="flex items-center justify-center h-screen" style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}>
          <div
            ref={cylinderRef}
            className="relative"
            style={{
              width: `${cardWidth}px`,
              height: '100%',
              transformStyle: 'preserve-3d',
            }}
          >
            {projects.map((p, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <ProjectCardContent project={p} idx={i} isActive={i === activeIndex} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View more - after unpinned */}
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